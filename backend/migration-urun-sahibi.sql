-- ============================================================
-- products tablosuna ürünü ekleyen kullanıcı (sahip) sütunu
-- u_id : ürünü kim ekledi (users.u_id)
-- Amaç: satıcı mantığı. Admin tüm ürünleri görür, normal kullanıcı
--       yalnızca kendi eklediği ürünleri görür ve yönetir.
-- Var olan veritabanına uygulanır; sıfırdan kurulumda database.sql yeterlidir.
-- ============================================================
USE levelup;

ALTER TABLE products
  ADD COLUMN u_id INT NULL AFTER p_id;

-- Mevcut ürünlerin sahibi admin (u_id = 1) olsun
UPDATE products SET u_id = 1 WHERE u_id IS NULL;
