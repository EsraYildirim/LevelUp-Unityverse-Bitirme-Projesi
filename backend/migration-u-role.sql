-- ============================================================
-- users tablosuna rol sütunu ekler
-- u_role : 0 = Kullanıcı, 1 = Admin
-- Kayıt formundan gelen herkes 0 (Kullanıcı) olarak başlar;
-- admin paneli üzerinden rol değiştirilebilir.
-- Var olan veritabanına uygulanır; sıfırdan kurulumda database.sql yeterlidir.
-- ============================================================
USE levelup;

ALTER TABLE users
  ADD COLUMN u_role TINYINT(1) NOT NULL DEFAULT 0 AFTER u_birthdate;

-- Seed'deki ilk kullanıcıyı admin yapalım ki panel girişi test edilebilsin
UPDATE users SET u_role = 1 WHERE u_id = 1;
