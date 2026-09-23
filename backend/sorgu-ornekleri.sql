-- ============================================================
-- SQL ALIŞTIRMALARI  (Veri Tabanı dersi)
--
-- ############################################################
-- !!! BU DOSYAYI TOPTAN ÇALIŞTIRMAYIN !!!
--
-- Aşağıdaki sorgular phpMyAdmin'in SQL sekmesine TEK TEK
-- yapıştırılıp denenmek için hazırlanmıştır. Dosyanın tamamını
-- birden çalıştırırsanız INSERT / UPDATE / DELETE komutları da
-- işler ve sitedeki veriler değişir.
--
-- Veriyi bozarsanız geri almak kolay: veritabanını silip
-- database.sql dosyasını yeniden çalıştırın.
-- ############################################################
-- ============================================================

USE levelup;

-- ------------------------------------------------------------
-- SELECT  (VERİ OKUMA)
-- * bütün sütunları getirir; istersek sütunları tek tek yazarız.
-- ------------------------------------------------------------
SELECT * FROM products;

SELECT p_name, p_category, p_stock, p_price FROM products;

-- ------------------------------------------------------------
-- ORDER BY  (SIRALAMA)
-- DESC = büyükten küçüğe / yeniden eskiye
-- ASC  = küçükten büyüğe (varsayılan)
-- ------------------------------------------------------------
SELECT p_name, p_price
FROM products
ORDER BY p_price DESC;

SELECT p_name, p_stock
FROM products
ORDER BY p_stock ASC;

-- ------------------------------------------------------------
-- WHERE  (ŞART / FİLTRELEME)
-- AND -> iki şart da doğru olmalı
-- OR  -> şartlardan biri doğru olması yeter
-- ------------------------------------------------------------
-- Tek bir kategori
SELECT p_name, p_price FROM products
WHERE p_category = 'Oyun';

-- İki şart birden: stoğu olan ve 3000 TL'den ucuz ürünler
SELECT p_name, p_stock, p_price FROM products
WHERE p_stock > 0 AND p_price < 3000;

-- Şartlardan biri yeterli
SELECT p_name, p_category FROM products
WHERE p_category = 'Konsol' OR p_category = 'Aksesuar';

-- Belirli bir kullanıcıyı bul
SELECT u_firstName, u_lastName, u_email, u_role FROM users
WHERE u_email = 'admin@example.com';

-- Stoğu azalan ürünler (sipariş vermek gerekebilir)
SELECT p_name, p_stock
FROM products
WHERE p_stock < 10
ORDER BY p_stock ASC;

-- LIKE: içinde geçen kelimeye göre arama (% = herhangi bir karakter dizisi)
SELECT p_name, p_price FROM products
WHERE p_name LIKE '%Switch 2%';

-- ------------------------------------------------------------
-- COUNT / SUM / AVG  (TOPLU HESAPLAR)
-- GROUP BY ile gruplara ayırıp her grup için hesap yapılır.
-- ------------------------------------------------------------
SELECT COUNT(*) AS toplam_urun FROM products;

SELECT p_category, COUNT(*) AS adet, AVG(p_price) AS ortalama_fiyat
FROM products
GROUP BY p_category;

SELECT SUM(o_amount) AS toplam_ciro FROM orders;

-- Sipariş durumlarının dağılımı
SELECT o_status, COUNT(*) AS adet
FROM orders
GROUP BY o_status;

-- ------------------------------------------------------------
-- INSERT INTO  (VERİ EKLEME)
-- Kalıp:  INSERT INTO tablo_adi (sutun1, sutun2, ...)
--         VALUES (deger1, deger2, ...);
-- Tek seferde birden fazla satır eklemek için VALUES listelerini
-- virgülle ayırırız.
--
-- NOT: Denemek için çalıştırırsanız eklediğiniz satırı en alttaki
-- DELETE örneğiyle geri silebilirsiniz.
-- ------------------------------------------------------------
INSERT INTO users (u_firstName, u_lastName, u_email, u_tel, u_pass, u_birthdate)
VALUES ('Deneme', 'Kullanıcı', 'deneme@example.com', '5330000000', '1234', '1999-05-10');

INSERT INTO messages (m_firstName, m_lastName, m_email, m_code, m_phone, m_subject, m_message)
VALUES ('Deneme', 'Kullanıcı', 'deneme@example.com', '+90', '5330000000', 'Genel',
        'Hediye paketi seçeneği ekler misiniz?');

-- ------------------------------------------------------------
-- UPDATE  (VERİ GÜNCELLEME)
-- DİKKAT: WHERE yazmazsan tablodaki BÜTÜN satırlar güncellenir!
-- ------------------------------------------------------------
-- Tek bir ürüne indirim uygula (p_disc, p_price'tan küçükse
-- sitede eski fiyat üstü çizili görünür)
UPDATE products
SET p_disc = 2200.00
WHERE p_name = 'Star Fox';

-- Bir ürünün stoğunu değiştir
UPDATE products
SET p_stock = 25
WHERE p_name = 'Splatoon Raiders';

-- Bir siparişin durumunu değiştir
UPDATE orders
SET o_status = 'Teslim Edildi'
WHERE o_no = 10005;

-- Yukarıdakileri geri almak için:
UPDATE products SET p_disc = 2441.36 WHERE p_name = 'Star Fox';
UPDATE products SET p_stock = 22     WHERE p_name = 'Splatoon Raiders';
UPDATE orders   SET o_status = 'Hazırlanıyor' WHERE o_no = 10005;

-- ------------------------------------------------------------
-- DELETE  (VERİ SİLME)
-- DİKKAT: WHERE yazmazsan tablodaki BÜTÜN satırlar silinir!
-- ------------------------------------------------------------
-- Yukarıdaki INSERT örnekleriyle eklenen satırları siler
DELETE FROM messages
WHERE m_email = 'deneme@example.com';

DELETE FROM users
WHERE u_email = 'deneme@example.com';
