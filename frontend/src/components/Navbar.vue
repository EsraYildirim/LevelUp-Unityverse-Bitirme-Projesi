<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top navbar-custom">
    <div class="container">
      <!-- Logo: tipografik işaret. "Level" düz yazı, "Up" kırmızı pixel kutuda,
           sonunda "yukarı çık" anlamını veren pixel ok. -->
      <router-link to="/" class="navbar-brand marka" aria-label="LevelUp anasayfa">
        <span class="marka__level">Level</span><span class="marka__up">Up</span>
        <svg class="marka__ok" viewBox="0 0 7 7" aria-hidden="true">
          <rect x="3" y="0" width="1" height="1" />
          <rect x="2" y="1" width="3" height="1" />
          <rect x="1" y="2" width="5" height="1" />
          <rect x="0" y="3" width="7" height="1" />
          <rect x="3" y="4" width="1" height="3" />
        </svg>
      </router-link>

      <!-- Mobil menü butonu -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Menüyü aç/kapat"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menü öğeleri -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item">
            <router-link to="/" class="nav-link navbar-custom__link" exact-active-class="navbar-custom__link--active">
              Anasayfa
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/hakkimizda" class="nav-link navbar-custom__link" active-class="navbar-custom__link--active">
              Hakkımızda
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/urunler" class="nav-link navbar-custom__link" active-class="navbar-custom__link--active">
              Ürünler
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/iletisim" class="nav-link navbar-custom__link" active-class="navbar-custom__link--active">
              İletişim
            </router-link>
          </li>
          <!-- Admin linki yalnızca yönetici hesabında görünür -->
          <li v-if="oturum.rol === ROL_ADMIN" class="nav-item">
            <router-link to="/admin" class="nav-link navbar-custom__link" active-class="navbar-custom__link--active">
              Admin
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/odeme" class="nav-link navbar-custom__link navbar-custom__cart" active-class="navbar-custom__link--active">
              🛒 Sepet
              <span v-if="toplamAdet" class="badge rounded-pill navbar-custom__cart-badge">
                {{ toplamAdet }}
              </span>
            </router-link>
          </li>
          <!-- Giriş yapılmadıysa tek buton: Giriş / Kayıt -->
          <li v-if="!oturum.girisYapildi" class="nav-item ms-lg-2">
            <router-link
              to="/giris"
              class="btn btn-primary navbar-custom__cta"
              :class="{ 'navbar-custom__cta--active': hesapSayfasinda }"
            >
              Giriş / Kayıt
            </router-link>
          </li>

          <!-- Giriş yapıldıysa: panel kısayolu (role göre) ve çıkış -->
          <template v-else>
            <li class="nav-item ms-lg-2">
              <router-link :to="panelYolu()" class="btn btn-primary navbar-custom__cta">
                👤 {{ oturum.isim || 'Panelim' }}
              </router-link>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="btn btn-outline-primary navbar-custom__cta"
                @click="cikis"
              >
                Çıkış
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Üst menü bileşeni: logo, sayfa yönlendirme linkleri ve sepet göstergesi
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { oturum, cikisYap, panelYolu, ROL_ADMIN } from '../utils/oturum.js'

// Sepet App.vue'dan inject ile gelir
const sepet = inject('sepet')

// Giriş/Kayıt butonu her iki rotada da aktif görünsün
const route = useRoute()
const router = useRouter()
const hesapSayfasinda = computed(() => route.path === '/giris' || route.path === '/kayit')

function cikis() {
  cikisYap()
  router.push('/giris')
}

const toplamAdet = computed(() =>
  sepet.reduce((toplam, item) => toplam + item.quantity, 0)
)
</script>

<style scoped>
/* ===== Header ===== */
.navbar-custom {
  padding: 12px 0;
  background-color: var(--panel);
  border-bottom: var(--kenar);
}

.navbar-custom a {
  text-decoration: none !important;
}

/* Sepet sayısını gösteren küçük kare rozet */
.navbar-custom__cart-badge {
  background-color: var(--kirmizi);
  color: #fff;
  font-family: var(--font-baslik);
  font-size: 9px;
  padding: 4px 6px;
  border: 2px solid var(--cerceve);
  vertical-align: middle;
}

.navbar-custom__link {
  font-family: var(--font-baslik);
  font-size: 9px;
  /* Press Start 2P geniş bir font, menü isimleri satır kırmasın */
  white-space: nowrap;
  color: var(--metin-soluk);
  padding: 10px 8px !important;
  border: 3px solid transparent;
  transition: color 0.1s ease, background-color 0.1s ease;
}

.navbar-custom__link:hover {
  color: var(--metin);
  background-color: var(--zemin);
}

/* Aktif sayfa: kırmızı kutu */
.navbar-custom__link--active {
  color: #fff !important;
  background-color: var(--kirmizi);
  border: var(--kenar);
}

.navbar-custom__cta {
  font-size: 9px;
  padding: 10px 12px;
  white-space: nowrap;
}

.navbar-custom__cta--active {
  background-color: var(--sari);
  color: var(--cerceve);
}

.navbar-toggler {
  border: var(--kenar);
  background-color: var(--kirmizi);
  padding: 8px 10px;
}

/* Tablet ve altı: menü hamburger'a dönüşür */
@media (max-width: 991.98px) {
  .navbar-custom .navbar-collapse {
    margin-top: 12px;
    padding: 12px;
    background-color: var(--zemin);
    border: var(--kenar);
  }

  .navbar-custom__cta {
    margin-top: 8px;
    display: inline-block;
    width: fit-content;
  }
}
</style>
