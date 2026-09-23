<template>
  <footer class="footer">
    <div class="container footer__grid">
      <!-- Şirket bilgisi -->
      <div class="footer__col">
        <h5 class="footer__title marka marka--footer">
          <span class="marka__level">Level</span><span class="marka__up">Up</span>
        </h5>
        <p class="footer__text">
          Oyun tutkunları için en iyi oyunları, en uygun fiyatlarla bir araya
          getiren platform.
        </p>
      </div>

      <!-- İletişim -->
      <div class="footer__col">
        <h6 class="footer__heading">İletişim</h6>
        <ul class="footer__list">
          <li class="footer__text">
            <span aria-hidden="true">✉️</span>
            <a :href="EPOSTA_LINK" class="footer__link">{{ EPOSTA }}</a>
          </li>
          <li class="footer__text">
            <span aria-hidden="true">📞</span>
            <a :href="TELEFON_LINK" class="footer__link">{{ TELEFON }}</a>
          </li>
          <li class="footer__text"><span aria-hidden="true">📍</span> {{ ADRES_KISA }}</li>
        </ul>
      </div>
    </div>

    <!-- Alt kısım: telif hakkı -->
    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <span class="footer__text">© 2026 LevelUp. Tüm hakları saklıdır.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Alt kısım bileşeni: şirket bilgisi ve iletişim.
// İletişim bilgileri İletişim sayfasıyla aynı kaynaktan gelir.
import {
  ADRES_KISA,
  EPOSTA,
  EPOSTA_LINK,
  TELEFON,
  TELEFON_LINK,
} from '../utils/iletisim.js'
</script>

<style scoped>
/* ===== Footer ===== */
.footer {
  background-color: var(--panel);
  border-top: var(--kenar);
  color: var(--metin-soluk);
  padding-top: var(--bosluk-buyuk);
}

.footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--bosluk-buyuk);
  padding-bottom: var(--bosluk-buyuk);
}

.footer__title {
  font-family: var(--font-baslik);
  font-size: 14px;
  color: var(--sari);
  margin-bottom: var(--bosluk);
}

.footer__heading {
  font-family: var(--font-baslik);
  font-size: 10px;
  color: var(--turkuaz);
  margin-bottom: var(--bosluk);
}

.footer__text {
  color: var(--metin-soluk);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 0;
  max-width: 65ch;
}

.footer__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__list li {
  margin-bottom: var(--bosluk-kucuk);
}

.footer__link {
  color: var(--metin-soluk);
  text-decoration: none !important;
  font-size: 15px;
  transition: color 0.1s ease;
}

.footer__link:hover {
  color: var(--sari);
}

.footer__bottom {
  border-top: var(--kenar);
  padding: var(--bosluk) 0;
}

.footer__bottom-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--bosluk-kucuk);
}

/* Tablet */
@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: var(--bosluk);
    text-align: center;
  }

  .footer__text {
    margin-left: auto;
    margin-right: auto;
  }

  .footer__bottom-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
