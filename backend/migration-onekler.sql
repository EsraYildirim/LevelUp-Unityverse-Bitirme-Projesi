-- ============================================================
-- MİGRASYON: Sütun adlarına önek (prefix) ekleme
--
-- Hocanın derste kurduğu düzen: her tablonun sütunları o tablonun
-- baş harfiyle başlar (u_ , p_ , o_ , m_). Böylece sorgularda
-- hangi sütunun hangi tabloya ait olduğu bir bakışta anlaşılır ve
-- JOIN yaparken isim çakışması olmaz.
--
-- Ayrıca kayıt tarihini tutan *_created_at sütunları eklendi.
--
-- Bu dosya MEVCUT veritabanını dönüştürmek içindir.
-- Sıfırdan kurulum için database.sql kullanın.
-- phpMyAdmin > levelup > SQL sekmesine yapıştırıp çalıştırın.
-- ============================================================

USE levelup;

-- ------------------------------------------------------------
-- 1) KULLANICILAR -> users  (tablo adı da hocadaki gibi)
-- ------------------------------------------------------------
RENAME TABLE kullanicilar TO users;

ALTER TABLE users
  CHANGE firstName  u_firstName  VARCHAR(20) NOT NULL,
  CHANGE lastName   u_lastName   VARCHAR(20) NOT NULL,
  CHANGE email      u_email      VARCHAR(50) NOT NULL,
  CHANGE tel        u_tel        VARCHAR(11) NULL,
  CHANGE pass       u_pass       VARCHAR(50) NOT NULL,
  CHANGE birthdate  u_birthdate  DATE        NULL,
  CHANGE created_at u_created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP;

-- ------------------------------------------------------------
-- 2) PRODUCTS
-- ------------------------------------------------------------
ALTER TABLE products
  CHANGE name  p_name  VARCHAR(50)    NOT NULL,
  CHANGE stock p_stock INT            NOT NULL DEFAULT 0,
  CHANGE price p_price DECIMAL(10, 2) NOT NULL,
  ADD    p_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ------------------------------------------------------------
-- 3) ORDERS
-- Metin olarak tutulan o_date yerine gerçek zaman damgası.
-- Eski tarihleri kaybetmemek için önce yeni sütunu doldurup
-- sonra eskisini siliyoruz.
-- ------------------------------------------------------------
ALTER TABLE orders
  ADD o_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

UPDATE orders
SET o_created_at = STR_TO_DATE(o_date, '%d.%m.%Y')
WHERE STR_TO_DATE(o_date, '%d.%m.%Y') IS NOT NULL;

ALTER TABLE orders
  DROP COLUMN o_date;

-- ------------------------------------------------------------
-- 4) MESSAGES  -> zaten m_ önekliydi, değişiklik yok
-- ------------------------------------------------------------
