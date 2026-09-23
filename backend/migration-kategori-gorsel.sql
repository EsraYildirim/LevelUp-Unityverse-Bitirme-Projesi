-- ============================================================
-- products tablosuna kategori ve görsel sütunu ekler
-- p_category : 'Konsol' | 'Oyun' | 'Aksesuar'  (varsayılan Oyun)
-- p_image    : görsel yolu, örn. /img/urunler/star-fox.jpg (frontend/public altında)
-- Var olan veritabanına uygulanır; sıfırdan kurulumda database.sql yeterlidir.
-- ============================================================
USE levelup;

ALTER TABLE products
  ADD COLUMN p_category VARCHAR(20)  NOT NULL DEFAULT 'Oyun' AFTER p_name,
  ADD COLUMN p_image    VARCHAR(255) NULL AFTER p_desc;
