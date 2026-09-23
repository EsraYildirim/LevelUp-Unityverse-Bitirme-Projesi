-- ============================================================
-- MİGRASYON 4: Birincil anahtarlara da önek
--
-- products tablosunda p_id'ye geçmiştik. Şimdi sıra diğerlerinde:
--   users.id  -> u_id
--   orders.id -> o_id
--
-- (messages zaten m_id kullanıyordu.)
-- phpMyAdmin > levelup > SQL sekmesine yapıştırıp çalıştırın.
-- ============================================================

USE levelup;

ALTER TABLE users
  CHANGE id u_id INT AUTO_INCREMENT;

ALTER TABLE orders
  CHANGE id o_id INT AUTO_INCREMENT;
