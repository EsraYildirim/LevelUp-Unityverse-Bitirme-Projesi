-- ============================================================
-- MİGRASYON 8: Veri tutarlılığı düzeltmeleri
--
-- Site büyüdükçe ortaya çıkan üç sorunu kapatır. Var olan
-- veritabanına uygulanır; sıfırdan kurulumda database.sql yeterlidir.
-- phpMyAdmin > levelup > SQL sekmesine yapıştırıp çalıştırın.
-- ============================================================

USE levelup;

-- ------------------------------------------------------------
-- 1) p_name 50 karakterden 120'ye çıkıyor
--
-- Gerçek ürün adları 50 karaktere sığmıyor. Nintendo ürünleri
-- eklenirken "The Legend of Zelda 40th Anniversary Edition" adı
-- ERROR 1406 (Data too long) verdiği için kısaltmak zorunda
-- kalmıştık. Artık kısaltmaya gerek yok.
-- ------------------------------------------------------------
ALTER TABLE products
  MODIFY p_name VARCHAR(120) NOT NULL;

-- ------------------------------------------------------------
-- 2) p_created_at artık ürün düzenlenince değişmiyor
--
-- Sütunda "ON UPDATE CURRENT_TIMESTAMP" vardı: stok ya da fiyat
-- her güncellendiğinde eklenme tarihi bugüne kayıyordu. Adı
-- "created_at" olan bir sütun eklenme anını tutmalı.
-- ------------------------------------------------------------
ALTER TABLE products
  MODIFY p_created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

-- ------------------------------------------------------------
-- 3) Aynı e-posta ile ikinci hesap açılamaz
--
-- Kayıt formu e-postayı kontrol etmiyordu; aynı adresle birden
-- fazla kullanıcı oluşabiliyor ve giriş yaparken hangi hesaba
-- girildiği belirsiz kalıyordu. Sunucu artık bu hatayı yakalayıp
-- "Bu e-posta adresiyle zaten bir hesap var." mesajı döndürüyor.
--
-- NOT: Tabloda zaten tekrar eden e-posta varsa bu komut hata verir.
-- Önce aşağıdaki sorguyla kontrol edin, varsa tekrarları silin:
--   SELECT u_email, COUNT(*) FROM users GROUP BY u_email HAVING COUNT(*) > 1;
-- ------------------------------------------------------------
ALTER TABLE users
  ADD UNIQUE KEY uk_users_email (u_email);
