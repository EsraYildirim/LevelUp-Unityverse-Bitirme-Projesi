-- ============================================================
-- LevelUp veritabanı — SIFIRDAN KURULUM (tek dosya)
--
-- Bu dosya sitenin güncel halini kurar: şema + sitedeki ürünler
-- + kullanıcı, sipariş ve mesaj kayıtları. Çalıştırdıktan sonra
-- başka bir dosya çalıştırmaya gerek yoktur.
--
-- Çalıştırmak için:
--   mysql -u root -p < database.sql
-- ya da phpMyAdmin > SQL sekmesine yapıştırın.
--
-- DİKKAT: Veritabanı ZATEN KURULUYSA bu dosyayı çalıştırmayın —
-- kayıtlar ikinci kez eklenir. Kurulu bir veritabanını güncellemek
-- için migration-*.sql dosyalarını sırayla uygulayın:
--   1. migration-onekler.sql          (sütun adlarına önek)
--   2. migration-products.sql         (products tablosu)
--   3. migration-mesaj-durum.sql      (m_status)
--   4. migration-id-onekleri.sql      (u_id / o_id)
--   5. migration-u-role.sql           (u_role)
--   6. migration-kategori-gorsel.sql  (p_category / p_image)
--   7. migration-urun-sahibi.sql      (products.u_id)
--   8. migration-veri-tutarliligi.sql (p_name 120, benzersiz e-posta)
--
-- Sütun adlandırma kuralı: her sütun ait olduğu tablonun baş
-- harfiyle başlar (u_ , p_ , o_ , m_). Böylece sorgularda hangi
-- sütunun hangi tabloya ait olduğu bir bakışta anlaşılır ve
-- JOIN yaparken isim çakışması olmaz.
-- ============================================================

CREATE DATABASE IF NOT EXISTS levelup
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE levelup;

-- ------------------------------------------------------------
-- ÜRÜNLER
-- u_id       : ürünü ekleyen kullanıcı (satıcı). Admin hepsini görür,
--              normal kullanıcı yalnızca kendi eklediklerini görür.
-- p_category : Konsol | Oyun | Aksesuar
-- p_active   : ürün yayında mı? (1 = evet)
-- p_disc     : indirimli fiyat. İndirim yoksa p_price ile aynıdır;
--              p_disc < p_price olduğunda sitede eski fiyat üstü çizili görünür.
-- p_image    : görsel yolu (frontend/public altında)
-- p_name     : 120 karakter — ürün adları 50'ye sığmıyordu.
-- p_created_at: ÜRÜNÜN EKLENDİĞİ an. "ON UPDATE" yok: stok/fiyat
--              güncellenince bu tarih değişmez.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  p_id         INT AUTO_INCREMENT PRIMARY KEY,
  u_id         INT            NULL,
  p_name       VARCHAR(120)   NOT NULL,
  p_category   VARCHAR(20)    NOT NULL DEFAULT 'Oyun',
  p_active     TINYINT(1)     NOT NULL DEFAULT 1,
  p_stock      INT            NOT NULL DEFAULT 0,
  p_price      DECIMAL(10, 2) NOT NULL,
  p_disc       DECIMAL(10, 2) NULL,
  p_desc       TEXT           NULL,
  p_image      VARCHAR(255)   NULL,
  p_created_at TIMESTAMP      NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- ÖĞRENCİLER (Ders Notları sayfasındaki basit GET örneği için)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(50) NOT NULL,
  grade INT         NOT NULL
);

-- ------------------------------------------------------------
-- KULLANICILAR
-- u_role  : 0 = Kullanıcı, 1 = Admin (kayıt olan herkes 0 başlar)
-- u_email : BENZERSİZ — aynı e-postayla ikinci hesap açılamaz.
--           Sunucu bu hatayı yakalayıp anlaşılır bir mesaj döner.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  u_id         INT AUTO_INCREMENT PRIMARY KEY,
  u_firstName  VARCHAR(20) NOT NULL,
  u_lastName   VARCHAR(20) NOT NULL,
  u_email      VARCHAR(50) NOT NULL,
  u_tel        VARCHAR(11),
  u_pass       VARCHAR(50) NOT NULL,
  u_birthdate  DATE,
  u_role       TINYINT(1)  NOT NULL DEFAULT 0,
  u_created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_email (u_email)
);

-- ------------------------------------------------------------
-- MESAJLAR (İletişim formu)
-- m_code   : ülke telefon kodu (+90, +49 ...) — iletişim formundaki
--            ülke listesi frontend/src/utils/teslimat.js dosyasından gelir
-- m_status : 0 = Yanıtlanmadı, 1 = Yanıtlandı
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  m_id         INT AUTO_INCREMENT PRIMARY KEY,
  m_firstName  VARCHAR(30)  NOT NULL,
  m_lastName   VARCHAR(20)  NOT NULL,
  m_email      VARCHAR(30)  NOT NULL,
  m_code       VARCHAR(5),
  m_phone      VARCHAR(20)  NULL,
  m_subject    VARCHAR(15)  NULL,
  m_message    VARCHAR(300) NOT NULL,
  m_status     TINYINT(1)   NOT NULL DEFAULT 0,
  m_created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- SİPARİŞLER
-- o_products / o_pids : sepetteki ürün adları ve id'leri virgülle saklanır
-- o_person            : sipariş veren ad soyad. Ödeme sayfası girişsiz de
--                       çalıştığı için sipariş kullanıcıya id ile değil,
--                       ad soyad ile bağlanır (Hesabım > Siparişlerim).
-- o_created_at        : sipariş tarihini MySQL kendisi atar
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  o_id         INT AUTO_INCREMENT PRIMARY KEY,
  o_no         INT            NOT NULL,
  o_products   TEXT           NOT NULL,
  o_pids       TEXT           NOT NULL,
  o_person     VARCHAR(50)    NOT NULL,
  o_address    VARCHAR(255)   NOT NULL,
  o_amount     DECIMAL(10, 2) NOT NULL,
  o_status     VARCHAR(20)    NOT NULL DEFAULT 'Hazırlanıyor',
  o_created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BAŞLANGIÇ VERİLERİ
-- ============================================================

-- ------------------------------------------------------------
-- ÖĞRENCİLER
-- ------------------------------------------------------------
INSERT INTO students (id, name, grade) VALUES
  (1, 'Ayşe',   90),
  (2, 'Ali',    75),
  (3, 'Zeynep', 88);

-- ------------------------------------------------------------
-- KULLANICILAR
-- u_role 1 = Admin. Panele girmek için: admin@example.com / admin1234
-- ------------------------------------------------------------
INSERT INTO users (u_id, u_firstName, u_lastName, u_email, u_tel, u_pass, u_birthdate, u_role) VALUES
  (1, 'Admin', 'Admin', 'admin@example.com', '1234567890', 'admin1234', '1995-04-12', 1),
  (2, 'Zeynep', 'Aydın', 'zeynep.aydin@example.com', '5321114455', 'zeynep2026', '1998-03-17', 0),
  (3, 'Burak', 'Şahin', 'burak.sahin@example.com', '5347778899', 'burak1234', '1993-11-02', 0),
  (4, 'Elif', 'Korkmaz', 'elif.korkmaz@example.com', '5059994411', 'elif5678', '2001-06-25', 0),
  (5, 'Mert', 'Doğan', 'mert.dogan@example.com', '5432223366', 'mert9012', '1996-01-09', 0);

-- ------------------------------------------------------------
-- ÜRÜNLER
-- Nintendo Switch 2 ailesi: 3 konsol, 4 oyun, 2 aksesuar.
-- Bilgiler nintendo.com/us/store ürün sayfalarından alındı (23 Eylül 2026).
-- Fiyatlar orada ABD doları; site TL gösterdiği için
--   1 USD = 48.837 TL   (23.09.2026, frankfurter.dev)
-- kuruyla çevrildi.
-- ------------------------------------------------------------
INSERT INTO products (p_id, u_id, p_name, p_category, p_active, p_stock, p_price, p_disc, p_desc, p_image) VALUES
  (1, 1, 'Nintendo Switch 2 + Mario Kart World Bundle', 'Konsol', 1, 9, 28714.69, 26859.86,
   '7.9 inç 1080p ekran, 256 GB dahili depolama (microSD Express ile artırılabilir), dock ile 4K 60 fps çıkış. Kutuda Mario Kart World tam sürüm dijital indirme kodu, 3 aylık Nintendo Switch Online üyeliği, açık mavi/kırmızı Joy-Con 2, dock, Joy-Con 2 tutamağı, 2 adet bileklik, HDMI ve şarj kablosu. TV, masaüstü ve elde olmak üzere üç oyun modu.',
   '/img/urunler/switch2-mario-kart-bundle.jpg'),
  (2, 1, 'Nintendo Switch 2 - Zelda 40. Yıl Özel Sürümü', 'Konsol', 1, 5, 25394.75, 25394.75,
   'Zelda serisinin 40. yılına özel tasarım: Triforce desenli siyah-altın dock ve yeşil-altın Joy-Con 2 kumandalar. 7.9 inç 1080p ekran, 256 GB depolama, dock ile 4K 60 fps. Mıknatısla takılan Joy-Con 2\'lerde fare kontrolü desteği. Kutuda oyun yoktur, sadece konsol ve aksesuarları gelir.',
   '/img/urunler/switch2-zelda-40.jpg'),
  (3, 1, 'Nintendo Switch 2', 'Konsol', 1, 14, 24418.01, 24418.01,
   'Nintendo\'nun bugüne kadarki en güçlü konsolu. 7.9 inç 1080p ekran, 256 GB dahili depolama (microSD Express ile artırılabilir), dock ile 4K 60 fps\'e kadar görüntü. Mıknatısla takılan Joy-Con 2 kumandalar fare gibi de kullanılabiliyor. TV, masaüstü ve elde üç oyun modu; GameChat ile sesli sohbet.',
   '/img/urunler/switch2-sistem.jpg'),
  (4, 1, 'Mario Kart World', 'Oyun', 1, 30, 3906.47, 3906.47,
   'Serinin en büyük evrimi: aynı anda 24 sürücüyle yarış. Dağlar, ormanlar ve şehirlerin birbirine bağlandığı açık dünyada değişen hava koşulları ve gece-gündüz döngüsü var. Serbest Gezinti modunda pistleri kendi hızında keşfet, ray üstünde kayma ve duvar zıplaması gibi yeni tekniklerle rakiplerini geç. Tek sistemde 1-4, yerel 2-8, çevrimiçi 2-24 oyuncu.',
   '/img/urunler/mario-kart-world.jpg'),
  (5, 1, 'Donkey Kong Bananza', 'Oyun', 1, 25, 3418.10, 3418.10,
   'Donkey Kong ve Pauline ile devasa bir yeraltı dünyasını kırıp parçalayarak keşfet. DK\'nın gücü ve Pauline\'in sesiyle duvarları yık, tüneller aç, araziyi şekillendir. Kanyonlar, ormanlar ve tundralardan geçerek kötü Void Company\'den önce Gezegen Çekirdeği\'ne ulaş. Tek sistemde 1-2 oyuncu.',
   '/img/urunler/donkey-kong-bananza.jpg'),
  (6, 1, 'Splatoon Raiders', 'Oyun', 1, 22, 2441.36, 2441.36,
   'Deep Cut üçlüsüyle birlikte gizemli Spirhalite Adaları\'na hazine avına çık. Karakterini özelleştir, mekanik aletler ve mürekkep silahlarıyla donan, Salmonid dalgalarına karşı savaş. Tek oyuncu odaklı, ortak oynanış destekli. Tek sistemde 1, yerel ve çevrimiçi 2-4 oyuncu.',
   '/img/urunler/splatoon-raiders.jpg'),
  (7, 1, 'Star Fox', 'Oyun', 1, 20, 2441.36, 2441.36,
   'Fox McCloud ve Star Fox ekibiyle Lylat Sistemi\'ni Dr. Andross\'a karşı koru. Star Fox 64\'ün sinematik yeniden yorumu: tamamen seslendirilmiş diyaloglar, orkestra müzikleri ve baştan aşağı yenilenmiş görsellerle. Gezegenler ve uzay boşluğunda hızlı tempolu hava muharebesi. Tek sistemde 1-2, çevrimiçi 1-8 oyuncu.',
   '/img/urunler/star-fox.jpg'),
  (8, 1, 'Samsung microSD Express Card 256 GB (Switch 2)', 'Aksesuar', 1, 40, 2929.73, 2929.73,
   'Nintendo Switch 2\'nin kullandığı yeni microSD Express standardında 256 GB hafıza kartı. Normal microSD kartlara göre çok daha hızlı okuma yapar; Switch 2 oyunlarının kartla çalışabilmesi için bu standart gerekir. Resmi Nintendo lisanslı, Super Mario tasarımlı.',
   '/img/urunler/samsung-microsd-256.jpg'),
  (9, 1, 'Piranha Plant Camera (Switch 2)', 'Aksesuar', 1, 18, 2929.73, 2929.73,
   'Saksıda Piranha Plant şeklinde USB kamera. GameChat sırasında yüzünü ve oyun anlarını arkadaşlarınla paylaş. Esnek gövdesi sayesinde istediğin açıya çevrilir. HORI üretimi, resmi Nintendo lisanslı.',
   '/img/urunler/piranha-plant-camera.jpg');

-- ------------------------------------------------------------
-- SİPARİŞLER
-- o_person, users tablosundaki ad soyad ile birebir aynı yazılır;
-- Hesabım > Siparişlerim sayfası siparişi bu isimle eşleştirir.
-- Dördü de farklı durumda olsun diye seçildi.
-- ------------------------------------------------------------
INSERT INTO orders (o_id, o_no, o_products, o_pids, o_person, o_address, o_amount, o_status, o_created_at) VALUES
  (1, 10003, 'Nintendo Switch 2 + Mario Kart World Bundle', '1', 'Zeynep Aydın',
   'Alsancak Mah. 1453 Sk. No:7 D:3 İzmir/Türkiye', 32231.83, 'Teslim Edildi', '2026-09-11 14:22:00'),
  (2, 10004, 'Mario Kart World,Donkey Kong Bananza', '4,5', 'Burak Şahin',
   'Çankaya Mah. Atatürk Blv. No:118 K:4 Ankara/Türkiye', 8789.48, 'Kargoya Verildi', '2026-09-16 09:05:00'),
  (3, 10005, 'Samsung microSD Express Card 256 GB (Switch 2),Piranha Plant Camera (Switch 2)', '8,9', 'Elif Korkmaz',
   'Nilüfer Mah. Üniversite Cd. No:22 Bursa/Türkiye', 7031.35, 'Hazırlanıyor', '2026-09-21 18:47:00'),
  (4, 10006, 'Nintendo Switch 2 - Zelda 40. Yıl Özel Sürümü,Star Fox', '2,7', 'Mert Doğan',
   'Kadıköy Mah. Bahariye Cd. No:56 D:9 İstanbul/Türkiye', 33403.33, 'İptal Edildi', '2026-09-22 11:30:00');

-- ------------------------------------------------------------
-- MESAJLAR
-- m_status 1 = Yanıtlandı. Dördünden ikisi yanıtlanmış durumda.
-- Selin Yılmaz Almanya'dan yazıyor (+49) — ülke kodu listesi için.
-- ------------------------------------------------------------
INSERT INTO messages (m_id, m_firstName, m_lastName, m_email, m_code, m_phone, m_subject, m_message, m_status, m_created_at) VALUES
  (1, 'Zeynep', 'Aydın', 'zeynep.aydin@example.com', '+90', '5321114455', 'Teşekkür',
   'Siparişim iki günde elime ulaştı, kutu tertemizdi. Mario Kart World kodu da sorunsuz çalıştı, teşekkür ederim.', 1, '2026-09-23 20:03:40'),
  (2, 'Burak', 'Şahin', 'burak.sahin@example.com', '+90', '5347778899', 'Genel',
   'Zelda 40. Yıl sürümü ne zaman tekrar stoğa girer? Stok bildirimi alabileceğim bir yer var mı?', 0, '2026-09-23 20:03:40'),
  (3, 'Elif', 'Korkmaz', 'elif.korkmaz@example.com', '+90', '5059994411', 'Şikayet',
   'microSD kartı taktım ama konsol kartı görmüyor. İade mi etmeliyim yoksa bir ayar mı yapmam gerekiyor?', 1, '2026-09-23 20:03:40'),
  (4, 'Selin', 'Yılmaz', 'selin.yilmaz@example.com', '+49', '15123456789', 'Öneri',
   'Siteye ikinci el konsol bölümü eklerseniz çok iyi olur. Bir de kargo takip linkini e-postayla gönderseniz harika olurdu.', 0, '2026-09-23 20:03:40');

-- ============================================================
-- Kurulum özeti — beklenen sonuç:
--   Aksesuar 2 | Konsol 3 | Oyun 4   (toplam 9 ürün)
--   5 kullanıcı, 4 sipariş, 4 mesaj
-- ============================================================
SELECT p_category, COUNT(*) AS adet FROM products GROUP BY p_category ORDER BY p_category;
SELECT (SELECT COUNT(*) FROM users)    AS kullanici,
       (SELECT COUNT(*) FROM orders)   AS siparis,
       (SELECT COUNT(*) FROM messages) AS mesaj;
