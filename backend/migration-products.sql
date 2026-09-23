-- ============================================================
-- MİGRASYON 2: products tablosunu genişletme
--
-- Hocanın derste kurduğu yapı:
--   id  ->  p_id       (birincil anahtar da önekli olsun)
--   +   p_active       ürün yayında mı? (1 = evet, 0 = hayır)
--   +   p_disc         indirimli fiyat
--   +   p_desc         ürün açıklaması
--   p_created_at       ON UPDATE ile son değişiklik anını da tutar
--
-- phpMyAdmin > levelup > SQL sekmesine yapıştırıp çalıştırın.
-- ============================================================

USE levelup;

ALTER TABLE products
  -- Birincil anahtarı da önekli yap
  CHANGE id p_id INT AUTO_INCREMENT,

  -- Ürün yayında mı? Varsayılan olarak yayında (1)
  ADD p_active TINYINT(1) NOT NULL DEFAULT 1 AFTER p_name,

  -- İndirimli fiyat. İndirim yoksa normal fiyata eşittir.
  ADD p_disc DECIMAL(10, 2) NULL AFTER p_price,

  -- Ürün açıklaması
  ADD p_desc TEXT NULL AFTER p_disc,

  -- Kayıt güncellendiğinde tarih de otomatik tazelensin
  CHANGE p_created_at p_created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Mevcut ürünlerde indirim yok: indirimli fiyat = normal fiyat
UPDATE products
SET p_disc = p_price
WHERE p_disc IS NULL;

-- Mevcut ürünlere birer açıklama yazalım
UPDATE products SET p_desc = 'Günlük kullanım için hafif spor ayakkabı.' WHERE p_name = 'Nike';
UPDATE products SET p_desc = 'Nefes alan kumaşıyla rahat spor ayakkabı.' WHERE p_name = 'Adidas';
UPDATE products SET p_desc = 'Dayanıklı tabanıyla uzun ömürlü spor ayakkabı.' WHERE p_name = 'Hummel';
