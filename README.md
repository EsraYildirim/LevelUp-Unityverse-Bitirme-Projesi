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

## Veritabanı hakkında

Her sütun ait olduğu tablonun baş harfiyle başlar (`p_` ürünler, `u_` kullanıcılar,
`o_` siparişler, `m_` mesajlar). Böylece sorgularda hangi sütunun hangi tabloya ait
olduğu bir bakışta anlaşılır ve `JOIN` yaparken isim çakışması olmaz.

`database.sql` sıfırdan kurulum içindir. `migration-*.sql` dosyaları ise
veritabanının ders boyunca nasıl geliştiğini gösterir; kurulu bir veritabanını
güncellemek için sırayla uygulanır.

## Not

Ürün görselleri Nintendo'nun ürün sayfalarından alınmıştır ve yalnızca bu okul
projesi kapsamında, ilgili ürünü göstermek amacıyla kullanılmıştır.
