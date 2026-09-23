-- ============================================================
-- MİGRASYON 3: messages tablosuna durum sütunu
--
-- m_status : mesaj yanıtlandı mı?
--            0 = Yanıtlanmadı  (varsayılan)
--            1 = Yanıtlandı
--
-- Admin panelinde açılır listeden değiştirilir.
-- phpMyAdmin > levelup > SQL sekmesine yapıştırıp çalıştırın.
-- ============================================================

USE levelup;

ALTER TABLE messages
  ADD m_status TINYINT(1) NOT NULL DEFAULT 0 AFTER m_message;

-- Eskiden gelen mesajların hepsi "Yanıtlanmadı" sayılır (DEFAULT 0 zaten uyguladı)
