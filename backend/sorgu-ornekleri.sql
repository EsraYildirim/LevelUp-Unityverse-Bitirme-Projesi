-- ============================================================
-- SQL ALIŞTIRMALARI  (1. hafta - Veri Tabanı dersi)
--
-- Bu dosya uygulama tarafından kullanılmaz; phpMyAdmin'de
-- SQL sekmesine tek tek yapıştırıp denemek için hazırlanmıştır.
-- ============================================================

USE levelup;

-- ------------------------------------------------------------
-- INSERT INTO  (VERİ EKLEME)
-- Kalıp:  INSERT INTO tablo_adi (sutun1, sutun2, ...)
--         VALUES (deger1, deger2, ...);
-- Tek seferde birden fazla satır eklemek için VALUES listelerini
-- virgülle ayırırız.
-- ------------------------------------------------------------
INSERT INTO users (u_firstName, u_lastName, u_email, u_tel, u_pass, u_birthdate)
VALUES ('Zen',   'Aydoğuş', 'z.aydogus@gmail.com', '5338888888', '1234', '1999-05-10'),
       ('Kerem', 'Atlıhan', 'kerem@gmail.com',     '5337777777', '1234', '1998-11-02');

INSERT INTO messages (m_firstName, m_lastName, m_email, m_code, m_phone, m_subject, m_message)
VALUES ('Zen',   'Aydoğuş', 'z.aydogus@gmail.com', '+90', '5338888888', 'Kargo', 'Hediye paketi istiyorum.'),
       ('Ahmet', 'Çınar',   'a.cinar@gmail.com',   '+90', '5337777777', 'Kargo', 'Hediye paketi istiyorum.');

INSERT INTO orders (o_no, o_products, o_pids, o_person, o_address, o_amount)
VALUES (10003, 'Nike,Adidas,Hummel', '1,2,3', 'Zen Aydoğuş', 'Lale Sokak No:6 Manisa', 2000.50),
       (10004, 'Adidas,Nike',        '2,1',   'Kerem Baş',   'Lale Sokak No:6 İzmir',  1000.00);

-- ------------------------------------------------------------
-- SELECT  (VERİ OKUMA)
-- * bütün sütunları getirir; istersek sütunları tek tek yazarız.
-- ------------------------------------------------------------
SELECT * FROM products;

SELECT p_name, p_stock, p_price FROM products;

-- ORDER BY: sıralama.  DESC = büyükten küçüğe / yeniden eskiye
--                      ASC  = küçükten büyüğe (varsayılan)
SELECT p_name, p_stock, p_price
FROM products
ORDER BY p_created_at DESC;

SELECT p_name, p_price
FROM products
ORDER BY p_price ASC;

-- ------------------------------------------------------------
-- WHERE  (ŞART / FİLTRELEME)
-- AND -> iki şart da doğru olmalı
-- OR  -> şartlardan biri doğru olması yeter
-- ------------------------------------------------------------
SELECT * FROM users
WHERE u_email = 'ahmet@example.com' OR u_email = 'ayse@example.com';

SELECT * FROM products
WHERE p_stock > 3 AND p_price < 200;

-- Stoğu bitmek üzere olan ürünler
SELECT p_name, p_stock
FROM products
WHERE p_stock < 5
ORDER BY p_stock ASC;

-- ------------------------------------------------------------
-- UPDATE  (VERİ GÜNCELLEME)
-- DİKKAT: WHERE yazmazsan tablodaki BÜTÜN satırlar güncellenir!
-- ------------------------------------------------------------
-- Adidas'a %20 indirim (200 * 0.80 = 160)
UPDATE products
SET p_price = 200 * 0.80
WHERE p_name = 'Adidas';

SELECT * FROM products;

-- Tüm ürünlere %10 zam (mevcut fiyat üzerinden)
UPDATE products
SET p_price = p_price * 1.10
WHERE p_stock > 0;

-- Bir siparişin durumunu değiştir
UPDATE orders
SET o_status = 'Teslim Edildi'
WHERE o_no = 10001;

-- ------------------------------------------------------------
-- DELETE  (VERİ SİLME)
-- DİKKAT: WHERE yazmazsan tablodaki BÜTÜN satırlar silinir!
-- ------------------------------------------------------------
DELETE FROM messages
WHERE m_email = 'a.cinar@gmail.com';

DELETE FROM users
WHERE u_email = 'kerem@gmail.com';
