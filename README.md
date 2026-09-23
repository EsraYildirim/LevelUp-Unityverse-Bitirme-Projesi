# LevelUp — Unityverse Bitirme Projesi

Konsol, oyun ve aksesuar satan bir e-ticaret sitesi. Vue 3 ile yazılmış tek
sayfalık bir arayüz, Node.js/Express ile yazılmış bir API ve MySQL veritabanından
oluşuyor. Ziyaretçi ürünleri gezip sepete ekleyebiliyor ve sipariş verebiliyor;
yönetici ise ürün, kullanıcı, sipariş ve mesajları panelden yönetebiliyor.

## Yönetici girişi

Projeyi kurduktan sonra panele bu bilgilerle girebilirsiniz:

| | |
|---|---|
| **Adres** | `/giris` → giriş yaptıktan sonra `/admin` |
| **E-posta** | `admin@example.com` |
| **Parola** | `admin1234` |

Normal kullanıcı olarak bakmak isterseniz `zeynep.aydin@example.com` / `zeynep2026`
ile girip `/hesabim` sayfasındaki sipariş geçmişini görebilirsiniz.

> Bu bir okul projesidir. Veritabanındaki kullanıcılar, siparişler ve mesajlar
> örnek kayıtlardır; parolalar da bu yüzden düz metin tutuluyor.

## Kullanılan teknolojiler

**Arayüz:** Vue 3 (Composition API, `<script setup>`), Vue Router, Vite, Bootstrap 5
**Sunucu:** Node.js, Express 5, mysql2
**Veritabanı:** MySQL

## Kurulum

Gereken: Node.js 18+ ve MySQL.

**1. Veritabanını oluşturun**

```bash
mysql -u root -p < backend/database.sql
```

Tek dosya; tabloları oluşturup örnek verileri de yükler (9 ürün, 5 kullanıcı,
4 sipariş, 4 mesaj). phpMyAdmin kullanıyorsanız dosyanın içeriğini SQL sekmesine
yapıştırmanız yeterli.

**2. Sunucuyu çalıştırın**

```bash
cd backend
npm install
cp .env.example .env        # içindeki MySQL kullanıcı adı ve parolasını kendinizinkiyle değiştirin
npm start                   # http://localhost:3001
```

**3. Arayüzü çalıştırın**

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Tarayıcıdan `http://localhost:5173` adresini açın.

## Sayfalar

| Sayfa | Adres | Açıklama |
|---|---|---|
| Anasayfa | `/` | Öne çıkan konsollar ve oyunlar, kategori kutuları |
| Ürünler | `/urunler` | Arama ve kategori filtresi, sepete ekleme |
| Ödeme | `/odeme` | Sepet, adres ve kart bilgisi formu, sipariş oluşturma |
| Hakkımızda | `/hakkimizda` | Tanıtım ve ekip |
| İletişim | `/iletisim` | Harita, iletişim bilgileri ve mesaj formu |
| Giriş / Kayıt | `/giris`, `/kayit` | Oturum açma ve yeni hesap |
| Hesabım | `/hesabim` | Kullanıcının kendi siparişleri ve bilgileri |
| Yönetim Paneli | `/admin` | Ürün, kullanıcı, sipariş ve mesaj yönetimi |

## API uçları

Sunucu `http://localhost:3001` adresinde çalışır. `GET` uçları doğrudan tarayıcıdan
açılabilir (örn. <http://localhost:3001/api/products>); diğerleri Postman gibi bir
araçla denenebilir.

| Yöntem | Adres | Ne yapar |
|---|---|---|
| GET | `/api/hello` | Sunucu çalışıyor mu kontrolü |
| GET | `/api/products` | Tüm ürünleri listeler |
| GET | `/api/products/:id` | Kullanıcıya göre ürünler (admin hepsini, kullanıcı kendininkini görür) |
| POST | `/api/products` | Yeni ürün ekler |
| PUT | `/api/products/:id` | Ürünü günceller (sahiplik kontrolü yapar) |
| DELETE | `/api/products/:id` | Ürünü siler (sahiplik kontrolü yapar) |
| POST | `/api/upload` | Görsel yükler, kaydedilen yolu döner |
| GET | `/api/users` | Kullanıcıları listeler |
| GET | `/api/users/:id` | Tek kullanıcıyı getirir |
| POST | `/api/register` | Kayıt olma (aynı e-posta ikinci kez kullanılamaz) |
| POST | `/api/login` | Giriş — e-posta ve parola doğrular |
| POST | `/api/users` | Panelden kullanıcı ekler |
| PUT | `/api/users/:id` | Kullanıcı bilgilerini günceller |
| DELETE | `/api/users/:id` | Kullanıcıyı siler |
| GET | `/api/orders` | Siparişleri listeler (en yeni en üstte) |
| POST | `/api/orders` | Sipariş oluşturur — stok kontrolü yapar, stoktan düşer |
| PUT | `/api/orders/:id` | Sipariş durumunu değiştirir |
| DELETE | `/api/orders/:id` | Siparişi siler |
| GET | `/api/messages` | Mesajları listeler |
| POST | `/api/contact` | İletişim formundan mesaj kaydeder |
| PUT | `/api/messages/:id` | Mesajı yanıtlandı olarak işaretler |
| DELETE | `/api/messages/:id` | Mesajı siler |
| GET | `/api/students` | Ders örneği — basit `SELECT` sorgusu |

Ürün, kullanıcı, sipariş ve mesaj uçları veritabanı sütun adlarını olduğu gibi
döner (`p_name`, `u_email` gibi); gönderilen gövdelerde ise sade adlar kullanılır
(`name`, `email`).

## Öne çıkan özellikler

- **Rol tabanlı yetkilendirme** — yönlendirici koruması (`meta.roller`) ile admin
  sayfalarına yalnızca yöneticiler girebilir, diğerleri 403'e düşer.
- **Stok takibi** — sipariş verilirken sunucu güncel stoğa bakar, yetmiyorsa
  siparişi reddeder; kaydettikten sonra satılan adedi stoktan düşer.
- **Görsel yükleme** — yönetim panelinden dosya seçilir, sunucu kaydedip yolunu döner.
- **Ortak yardımcı dosyalar** — fiyat (`para.js`), tarih (`tarih.js`), teslimat
  ülke/şehir listesi (`teslimat.js`) ve iletişim bilgileri (`iletisim.js`)
  tek kaynaktan gelir, sayfalar arasında tutarsızlık olmaz.
- **Kendi açılır liste bileşeni** (`Secim.vue`) — tarayıcının `<select>` menüsü
  bazı işletim sistemlerinde kutunun üstünde açıldığı için, her zaman altında
  açılan, klavye ve ekran okuyucu destekli bir bileşen yazıldı.
- **Bildirim sistemi** — ekleme, güncelleme ve hata durumlarında sağ üstte
  görünen uyarılar (`bildirim.js` + `Bildirimler.vue`).

## Klasör yapısı

```
backend/
  server.js              API uçları (ürün, kullanıcı, sipariş, mesaj, görsel yükleme)
  db.js                  MySQL bağlantı havuzu
  database.sql           Sıfırdan kurulum: şema + örnek veriler
  migration-*.sql        Veritabanının adım adım gelişimi
  sorgu-ornekleri.sql    Derste işlenen örnek SQL sorguları

frontend/src/
  views/                 Sayfalar
  components/            Ortak bileşenler (navbar, footer, açılır liste, bildirimler)
  components/admin/      Yönetim paneli sekmeleri
  components/auth/       Giriş ve kayıt formları
  components/examples/   Derste işlenen Vue konularının örnekleri (/admin → Ders Notları)
  utils/                 Fiyat, tarih, doğrulama, oturum ve iletişim yardımcıları
```

## Veritabanı

Veritabanı adı: **`levelup`**. `database.sql` çalıştırıldığında tablolar ve
örnek kayıtlar hazır gelir.

| Tablo | Satır | İçerik |
|---|---|---|
| `products` | 9 | Ürünler — ad, kategori, stok, fiyat, indirimli fiyat, açıklama, görsel |
| `users` | 5 | Kullanıcılar — ad soyad, e-posta, telefon, parola, doğum tarihi, rol |
| `orders` | 4 | Siparişler — sipariş no, ürünler, tutar, adres, durum, tarih |
| `messages` | 4 | İletişim formundan gelen mesajlar ve yanıtlanma durumu |
| `students` | 3 | Ders Notları sayfasındaki basit `SELECT` örneği için |

### Veritabanını incelemek için

**phpMyAdmin ile:** Soldaki listeden `levelup` veritabanını seçin. Tabloları
tıklayarak içeriğe bakabilir, üstteki **SQL** sekmesinden sorgu çalıştırabilirsiniz.

**Terminalden:**

```bash
mysql -u root -p levelup

SHOW TABLES;                 -- tabloları listele
DESCRIBE products;           -- bir tablonun sütunlarını gör
SELECT * FROM products;      -- kayıtları gör
```

### Sütun adlandırma kuralı

Her sütun ait olduğu tablonun baş harfiyle başlar: `p_` ürünler, `u_` kullanıcılar,
`o_` siparişler, `m_` mesajlar. Böylece sorgularda hangi sütunun hangi tabloya ait
olduğu bir bakışta anlaşılır ve `JOIN` yaparken isim çakışması olmaz.

```sql
SELECT p_name, p_category, p_stock, p_price FROM products WHERE p_stock > 0;
```

### SQL dosyaları

| Dosya | Ne işe yarar |
|---|---|
| `database.sql` | **Sıfırdan kurulum.** Şema + örnek veriler, tek dosyada. |
| `sorgu-ornekleri.sql` | Ders boyunca işlenen örnek sorgular: `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY`, `INSERT`, `UPDATE`, `DELETE`. **Tek tek** çalıştırılmak üzere hazırlanmıştır. |
| `migration-*.sql` | Veritabanının adım adım gelişimi (aşağıdaki sıraya göre). |

Migrasyonlar, kurulu bir veritabanını güncellemek içindir; sıfırdan kurulumda
`database.sql` yeterlidir. Uygulama sırası:

1. `migration-onekler.sql` — sütun adlarına önek eklenmesi
2. `migration-products.sql` — `products` tablosu
3. `migration-mesaj-durum.sql` — mesajlara yanıt durumu (`m_status`)
4. `migration-id-onekleri.sql` — birincil anahtarlara önek (`u_id`, `o_id`)
5. `migration-u-role.sql` — kullanıcı rolü (`u_role`)
6. `migration-kategori-gorsel.sql` — ürün kategorisi ve görseli
7. `migration-urun-sahibi.sql` — ürünü ekleyen kullanıcı
8. `migration-veri-tutarliligi.sql` — `p_name` genişletme, benzersiz e-posta

## Not

Ürün görselleri Nintendo'nun ürün sayfalarından alınmıştır ve yalnızca bu okul
projesi kapsamında, ilgili ürünü göstermek amacıyla kullanılmıştır.
