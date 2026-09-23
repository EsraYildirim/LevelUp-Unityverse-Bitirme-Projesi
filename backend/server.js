require("dotenv").config(); //! .env dosyamızı import ettik (şifreler kodda durmasın)
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const db = require("./db"); //! Artık JSON dosyaları yerine MySQL veritabanını kullanıyoruz.
const app = express();
app.use(cors());
// Açıklama gibi uzun metinler gelebildiği için gövde sınırını büyüttük
app.use(express.json({ limit: "10mb" }));

//! Yardımcılar
// orders tablosunda ürün adları/id'leri virgülle saklanır, API'de dizi olarak döner
function metniDiziyeCevir(metin) {
  return metin ? String(metin).split(",") : [];
}
function diziyiMetneCevir(dizi) {
  return Array.isArray(dizi) ? dizi.join(",") : dizi;
}
// orders satırını API formatına çevirir
function siparisiBicimlendir(satir) {
  return {
    ...satir,
    o_products: metniDiziyeCevir(satir.o_products),
    o_pids: metniDiziyeCevir(satir.o_pids).map(Number),
  };
}

//! get,post,put,delete
//! get hello endpointi
app.get("/api/hello", (req, res) => {
  res.status(200).json({
    message: "Merhaba! Backend çalışıyor.",
    time: new Date().toISOString(),
  });
});

// Öğrencileri veritabanından oku
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json("Sunucu Hatası");
  }
});

//! PRODUCT KISMI
//? Ürünler artık sütun adlarıyla (p_name, p_stock ...) olduğu gibi dönüyor.

//? Gelen istek gövdesindeki ürün alanlarını okur.
//? Hem önekli (p_name) hem sade (name) gönderimi kabul eder; böylece
//? formun hangi isimlendirmeyi kullandığından bağımsız çalışır.
function urunAlanlariniOku(govde) {
  return {
    p_name: govde.p_name ?? govde.name,
    p_stock: govde.p_stock ?? govde.stock,
    p_price: govde.p_price ?? govde.price,
    p_desc: govde.p_desc ?? govde.desc,
    // kategori gönderilmezse Oyun; görsel boş bırakılabilir
    p_category: govde.p_category ?? govde.category ?? "Oyun",
    p_image: govde.p_image ?? govde.image ?? null,
    // indirimli fiyat: boş bırakılırsa aşağıda normal fiyata eşitlenir
    p_disc: govde.p_disc ?? govde.disc,
    // ürünü kimin eklediği: satıcı kimliği
    u_id: govde.u_id ?? null,
  };
}

//? Sayı alanı geçerli mi? Stok 0 da geçerli bir değerdir, bu yüzden
//? "!p_stock" ile kontrol edilemez (0 yanlış sayılır ve stok sıfırlanamazdı).
function sayiGecerli(deger) {
  return deger !== undefined && deger !== null && deger !== "" && !isNaN(Number(deger));
}

//? İndirimli fiyat boş ya da normal fiyattan büyükse indirim yok demektir;
//? o durumda p_disc = p_price olur ve sitede üstü çizili fiyat görünmez.
function indirimliFiyat(p_disc, p_price) {
  const fiyat = Number(p_price);
  if (!sayiGecerli(p_disc)) return fiyat;
  const indirim = Number(p_disc);
  return indirim > 0 && indirim < fiyat ? indirim : fiyat;
}

//? İstek sahibinin rolünü okur (0 = kullanıcı, 1 = admin)
async function rolunuOku(kullaniciId) {
  const [satirlar] = await db.query("SELECT u_role FROM users WHERE u_id = ?", [
    kullaniciId,
  ]);
  return satirlar.length > 0 ? Number(satirlar[0].u_role) : null;
}

//? Ürüne müdahale yetkisi: admin her üründe, kullanıcı yalnızca kendi ürününde
async function urunYetkisiVar(urunId, kullaniciId) {
  if (!kullaniciId) return false;
  if ((await rolunuOku(kullaniciId)) === 1) return true;

  const [satirlar] = await db.query("SELECT u_id FROM products WHERE p_id = ?", [
    urunId,
  ]);
  return satirlar.length > 0 && Number(satirlar[0].u_id) === Number(kullaniciId);
}

//? PRODUCTS LİSTELE
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY p_id ASC");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? PRODUCTS LİSTELE - KULLANICIYA GÖRE
//? Panelde kullanılır: admin tüm ürünleri, normal kullanıcı yalnızca
//? kendi eklediği ürünleri görür.
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    const rol = await rolunuOku(id);
    if (rol === null) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    let rows;
    if (rol === 1) {
      // istekte bulunan adminse tüm ürünleri yolla
      [rows] = await db.query("SELECT * FROM products ORDER BY p_id ASC");
    } else {
      // değilse yalnızca kendi eklediklerini
      [rows] = await db.query(
        "SELECT * FROM products WHERE u_id = ? ORDER BY p_id ASC",
        [id]
      );
    }

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? PRODUCTS EKLE
app.post("/api/products", async (req, res) => {
  try {
    const { p_name, p_stock, p_price, p_desc, p_category, p_image, p_disc, u_id } =
      urunAlanlariniOku(req.body);

    // Stok 0 olabilir (tükenmiş ürün), fiyat 0 olamaz
    if (!p_name || !p_desc || !sayiGecerli(p_stock) || !sayiGecerli(p_price)) {
      return res.status(400).json({ error: "Hatalı veri geldi" });
    }

    if (!u_id) return res.status(400).json({ error: "Ürünü ekleyen belli değil" });

    // p_active = 1 (yayında). İndirim girilmediyse p_disc = p_price (indirim yok)
    const [sonuc] = await db.query(
      "INSERT INTO products (u_id, p_name, p_category, p_active, p_stock, p_price, p_disc, p_desc, p_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [u_id, p_name.trim(), p_category, 1, Number(p_stock), Number(p_price), indirimliFiyat(p_disc, p_price), p_desc.trim(), p_image || null]
    );

    // Eklenen kaydı veritabanından okuyup geri döndürüyoruz (p_created_at de gelsin)
    const [rows] = await db.query("SELECT * FROM products WHERE p_id = ?", [
      sonuc.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? PRODUCTS GÜNCELLE
app.put("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { p_name, p_stock, p_price, p_desc, p_category, p_image, p_disc, u_id } =
      urunAlanlariniOku(req.body);

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    // Stok 0 olabilir: ürün tükendiğinde panelden 0 yazılabilmeli
    if (!p_name || !sayiGecerli(p_stock) || !sayiGecerli(p_price)) {
      return res.status(400).json({ error: "Hatalı veri geldi" });
    }

    // Kullanıcı başkasının ürününü düzenleyemesin
    if (!(await urunYetkisiVar(id, u_id))) {
      return res.status(403).json({ error: "Bu ürün üzerinde yetkiniz yok." });
    }

    // p_disc de güncelleniyor: eskiden güncellenmediği için fiyat yükseltilince
    // eski indirim fiyatı kalıyor ve sitede olmayan bir indirim görünüyordu.
    const [sonuc] = await db.query(
      "UPDATE products SET p_name = ?, p_category = ?, p_stock = ?, p_price = ?, p_disc = ?, p_desc = ?, p_image = ? WHERE p_id = ?",
      [p_name.trim(), p_category, Number(p_stock), Number(p_price), indirimliFiyat(p_disc, p_price), (p_desc ?? "").trim(), p_image || null, id]
    );

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek ürün bulunamadı." });
    }

    const [rows] = await db.query("SELECT * FROM products WHERE p_id = ?", [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? PRODUCTS SİL
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Silme isteğini kimin yaptığı adres satırında gelir: /api/products/5?u_id=2
    if (!(await urunYetkisiVar(id, req.query.u_id))) {
      return res.status(403).json({ error: "Bu ürün üzerinde yetkiniz yok." });
    }

    const [sonuc] = await db.query("DELETE FROM products WHERE p_id = ?", [id]);

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Silinecek ürün bulunamadı." });
    }

    res.status(200).json({ message: "Ürün silindi." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! USER KISMI
//? Kullanıcılar da sütun adlarıyla (u_id, u_firstName ...) olduğu gibi dönüyor.

//? USER LİSTELE - GET - SQL sorgu: Select
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY u_id ASC");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? Kayıt formu ve admin paneli aynı alanları gönderir, tek yerde okuyoruz.
function kullaniciAlanlariniOku(govde) {
  return {
    firstName: govde.firstName,
    lastName: govde.lastName,
    email: govde.email,
    pass: govde.pass,
    birthdate: govde.birthdate,
    tel: govde.tel ?? null,
    // rol gönderilmezse (kayıt formu) herkes normal kullanıcı (0) olur
    role: Number(govde.role ?? 0),
  };
}

//? Yeni kullanıcıyı veritabanına yazar. /api/users ve /api/register aynı işi yapar,
//? sadece dönen mesaj farklı.
async function kullaniciEkle(req, res, basariMesaji) {
  try {
    const { firstName, lastName, email, pass, birthdate, tel, role } =
      kullaniciAlanlariniOku(req.body);

    if (!firstName || !lastName || !email || !pass || !birthdate) {
      return res.status(400).json({ error: "Hatalı veri geldi" });
    }

    await db.query(
      "INSERT INTO users (u_firstName, u_lastName, u_email, u_tel, u_pass, u_birthdate, u_role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [firstName.trim(), lastName.trim(), email.trim(), tel, pass, birthdate, role]
    );

    res.status(201).json(basariMesaji ?? firstName + " adlı kullanıcı eklendi.");
  } catch (err) {
    // u_email sütunu UNIQUE: aynı e-posta ile ikinci hesap açılamaz.
    // Bu olmadan aynı adresle birden fazla kayıt oluşuyor ve giriş yaparken
    // hangi hesaba girildiği belirsiz kalıyordu.
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Bu e-posta adresiyle zaten bir hesap var." });
    }
    res.status(500).json({ error: err.message });
  }
}

//? USER EKLE - POST - Sql sorgu: Insert Into  (admin panelinden)
app.post("/api/users", (req, res) => kullaniciEkle(req, res));

//? REGISTER - POST - Sql sorgu: Insert Into  (kayıt sayfasından)
app.post("/api/register", (req, res) => kullaniciEkle(req, res, "Kayıt Başarılı"));

//? LOGIN - POST - Sql sorgu: Select
//? Email + parola eşleşen kullanıcı varsa kimlik bilgilerini döner (parola dönmez).
app.post("/api/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT u_id, u_role, u_firstName FROM users WHERE u_email = ? AND u_pass = ?",
      [email, pass]
    );

    if (rows.length > 0) return res.status(200).json(rows);
    else return res.status(404).json({ error: "Giriş Başarısız" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? ADMIN/KULLANICI PANELİ - Giriş yapan kullanıcının adını getirir
//? Oturumda sadece u_id tutuluyor; panelde "Hoş geldin X" yazmak için ad buradan alınır.
app.post("/api/getUsername", async (req, res) => {
  const { id } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT u_firstName FROM users WHERE u_id = ?",
      [id]
    );

    // rows her zaman dizidir; boş dizi de doğru sayıldığı için uzunluğa bakıyoruz
    if (rows.length > 0) return res.status(200).json(rows[0].u_firstName);
    else return res.status(404).json({ error: "Kullanıcı bulunamadı" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? TEK KULLANICI - GET - Sql sorgu: Select (kullanıcı kendi bilgilerini görür)
app.get("/api/users/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE u_id = ?", [
      Number(req.params.id),
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? USER GÜNCELLE - PUT - Sql sorgu: Update set
app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, email, pass, birthdate, tel, role } =
      kullaniciAlanlariniOku(req.body);

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    if (!firstName || !lastName || !email || !pass || !birthdate) {
      return res.status(400).json({ error: "Hatalı veri geldi" });
    }

    // tel istekte yoksa COALESCE sayesinde mevcut değer korunur
    const [sonuc] = await db.query(
      "UPDATE users SET u_firstName = ?, u_lastName = ?, u_email = ?, u_tel = COALESCE(?, u_tel), u_pass = ?, u_birthdate = ?, u_role = ? WHERE u_id = ?",
      [firstName.trim(), lastName.trim(), email.trim(), tel, pass, birthdate, role, id]
    );

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek kullanıcı bulunamadı." });
    }

    res.status(200).json("Kişi bilgisi güncellendi");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Bu e-posta adresi başka bir hesapta kullanılıyor." });
    }
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//? USER SİL - DELETE - Sql sorgu: Delete
app.delete("/api/users/:id", async (req, res) => {
  try {
    const [sonuc] = await db.query("DELETE FROM users WHERE u_id = ?", [
      Number(req.params.id),
    ]);

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Silinecek kullanıcı bulunamadı." });
    }

    res.status(200).json("Kullanıcı silindi.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! ORDERS KISMI
//? Siparişler de sütun adlarıyla (o_id, o_no ...) olduğu gibi dönüyor.
//? Tarihi veritabanı kendisi atar (o_created_at).

//? ORDER LİSTELE - GET - SQL sorgu: Select  (en yeni sipariş en üstte)
app.get("/api/orders", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY o_id DESC");
    res.status(200).json(rows.map(siparisiBicimlendir));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? ORDER EKLE - POST - Sql sorgu: Insert Into  (ödeme sayfasından)
//? Ödeme sayfası sadece ham sepet + form bilgilerini yollar, sipariş kaydı burada oluşturulur
app.post("/api/orders", async (req, res) => {
  try {
    const { sepet, order, amount } = req.body;

    if (!sepet || !order || !amount) {
      return res.status(400).json({ error: "Eksik veri geldi" });
    }

    // sepetteki ürünlerin adlarını ve id'lerini ayrı dizilere topla
    let products = [],
      pids = [];
    for (let i = 0; i < sepet.length; i++) {
      products.push(sepet[i].name);
      pids.push(sepet[i].id);
    }

    // Stok kontrolü: sepet tarayıcıda tutulduğu için oradaki stok bilgisine
    // güvenilmez, güncel stoğu veritabanından okuyup burada doğruluyoruz.
    for (const urun of sepet) {
      const adet = Number(urun.quantity) || 1;
      const [satirlar] = await db.query(
        "SELECT p_name, p_stock FROM products WHERE p_id = ?",
        [urun.id]
      );

      if (satirlar.length === 0) {
        return res.status(404).json({ error: `"${urun.name}" artık satışta değil.` });
      }

      if (satirlar[0].p_stock < adet) {
        return res.status(409).json({
          error: `"${satirlar[0].p_name}" için yeterli stok yok (kalan: ${satirlar[0].p_stock}).`,
        });
      }
    }

    // sipariş numarası: mevcut en büyük numaranın bir fazlası
    const [[enBuyuk]] = await db.query("SELECT MAX(o_no) AS maxNo FROM orders");
    const o_no = (enBuyuk.maxNo || 10000) + 1;

    // o_created_at yazılmıyor; DEFAULT CURRENT_TIMESTAMP sayesinde tarihi MySQL koyuyor
    const [sonuc] = await db.query(
      "INSERT INTO orders (o_no, o_products, o_pids, o_person, o_address, o_amount, o_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        o_no,
        products.join(","),
        pids.join(","),
        order.firstName + " " + order.lastName,
        order.address + " " + order.state + "/" + order.country,
        amount,
        "Hazırlanıyor",
      ]
    );

    // Sipariş kaydedildi, satılan adetler stoktan düşülüyor.
    // GREATEST(...,0): eş zamanlı iki sipariş gelse bile stok eksiye inmesin.
    for (const urun of sepet) {
      await db.query(
        "UPDATE products SET p_stock = GREATEST(p_stock - ?, 0) WHERE p_id = ?",
        [Number(urun.quantity) || 1, urun.id]
      );
    }

    const [rows] = await db.query("SELECT * FROM orders WHERE o_id = ?", [
      sonuc.insertId,
    ]);
    res.status(201).json(siparisiBicimlendir(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? ORDER GÜNCELLE - PUT - Sql sorgu: Update set
//? Admin panelinde sadece sipariş durumu değişir, sipariş içeriği değişmez.
app.put("/api/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
    if (!status) return res.status(400).json({ error: "Hatalı veri geldi" });

    const [sonuc] = await db.query(
      "UPDATE orders SET o_status = ? WHERE o_id = ?",
      [status, id]
    );

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek sipariş bulunamadı." });
    }

    res.status(200).json("Sipariş durumu güncellendi");
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//? ORDER SİL - DELETE - Sql sorgu: Delete
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const [sonuc] = await db.query("DELETE FROM orders WHERE o_id = ?", [
      Number(req.params.id),
    ]);

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Silinecek sipariş bulunamadı." });
    }

    res.status(200).json("Sipariş silindi.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! MESSAGES (İLETİŞİM) KISMI
//? Mesajlar da ürünler gibi sütun adlarıyla (m_id, m_firstName ...) dönüyor.
//? m_status: 0 = Yanıtlanmadı, 1 = Yanıtlandı

//? MESSAGE LİSTELE - GET - SQL sorgu: Select
app.get("/api/messages", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM messages ORDER BY m_id DESC");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//? CONTACT MESSAGE - POST - SQL sorgu: Insert Into
//? İletişim formundan gelen mesajı messages tablosuna yazar.
//? Zorunlu alanlar: ad, soyad, email, mesaj. Ülke kodu/telefon/konu isteğe bağlı.
async function mesajEkle(req, res) {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "Hatalı veri geldi" });
    }

    // m_status = 0 -> "Yanıtlanmadı" olarak başlar
    await db.query(
      "INSERT INTO messages (m_firstName, m_lastName, m_email, m_code, m_phone, m_subject, m_message, m_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        req.body.code ?? null,
        req.body.tel ?? null,
        req.body.subject ?? null,
        message.trim(),
        0,
      ]
    );

    res.status(201).json("Mesaj gönderildi");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//? İletişim sayfası /api/contact adresini kullanır.
app.post("/api/contact", mesajEkle);
//? Aynı işi yapan eski adres de çalışmaya devam ediyor.
app.post("/api/messages", mesajEkle);

//? MESSAGE GÜNCELLE - PUT - Sql sorgu: Update set
//? Sadece yanıt durumu değişir; mesajın kendisi admin tarafından düzenlenmez.
app.put("/api/messages/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { m_status } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });

    // 0 da geçerli bir değer olduğu için "!m_status" ile kontrol edilemez
    if (m_status === undefined || m_status === null) {
      return res.status(400).json({ error: "Hatalı veri geldi" });
    }

    const [sonuc] = await db.query(
      "UPDATE messages SET m_status = ? WHERE m_id = ?",
      [Number(m_status), id]
    );

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Güncellenecek mesaj bulunamadı." });
    }

    const [rows] = await db.query("SELECT * FROM messages WHERE m_id = ?", [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

//? MESSAGE SİL - DELETE - Sql sorgu: Delete
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const [sonuc] = await db.query("DELETE FROM messages WHERE m_id = ?", [
      Number(req.params.id),
    ]);

    if (sonuc.affectedRows === 0) {
      return res.status(404).json({ error: "Silinecek mesaj bulunamadı." });
    }

    res.status(200).json({ message: "Mesaj silindi." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//! Port da .env dosyasından geliyor. Orada yoksa 3001 kullanılır.
const PORT = process.env.PORT || 3001;
//? GÖRSEL YÜKLE - POST
//? Admin panelinden seçilen dosya base64 olarak gelir, frontend/public altına
//? yazılır ve site içi yolu ("/img/urunler/...") geri döner. Böylece görselin
//? yolunu elle yazmak gerekmez. multer gibi ek paket kullanmadık; express.json
//? zaten 10mb gövdeye izin veriyor.
const GORSEL_KLASORU = path.join(
  __dirname,
  "..",
  "frontend",
  "public",
  "img",
  "urunler"
);

// Yalnızca bu türler kabul edilir. SVG dahil, çünkü görseller <img> ile
// gösteriliyor ve tarayıcı <img> içindeki SVG'de script çalıştırmaz.
const IZINLI_GORSEL_TURLERI = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const EN_BUYUK_GORSEL = 3 * 1024 * 1024; // 3 MB

// Türkçe harfler dosya adında kaybolmasın: "Gölge Protokolü" -> "golge-protokolu"
const TURKCE_HARFLER = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
};

// "Mario Kart World (Kapak).PNG" -> "mario-kart-world-kapak"
function dosyaAdiniTemizle(ad) {
  const govde = path.basename(ad || "", path.extname(ad || ""));
  const temiz = govde
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (h) => TURKCE_HARFLER[h])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return temiz || "gorsel";
}

app.post("/api/upload", async (req, res) => {
  try {
    const { dosyaAdi, tur, veri } = req.body;

    if (!veri || !tur) return res.status(400).json({ error: "Dosya gelmedi" });

    const uzanti = IZINLI_GORSEL_TURLERI[tur];
    if (!uzanti) {
      return res
        .status(415)
        .json({ error: "Yalnızca PNG, JPG, WEBP, GIF ve SVG yüklenebilir" });
    }

    const icerik = Buffer.from(veri, "base64");
    if (icerik.length === 0) {
      return res.status(400).json({ error: "Dosya boş" });
    }
    if (icerik.length > EN_BUYUK_GORSEL) {
      return res.status(413).json({ error: "Dosya 3 MB'den büyük olamaz" });
    }

    // Aynı isimli dosya birbirini ezmesin diye sonuna zaman damgası ekliyoruz
    const ad = `${dosyaAdiniTemizle(dosyaAdi)}-${Date.now()}${uzanti}`;

    await fs.promises.mkdir(GORSEL_KLASORU, { recursive: true });
    await fs.promises.writeFile(path.join(GORSEL_KLASORU, ad), icerik);

    res.status(201).json({ yol: `/img/urunler/${ad}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));
