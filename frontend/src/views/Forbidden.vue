<template>
  <!-- 403: Yetkisiz erişim. Router guard, yetkisi olmayan kullanıcıyı buraya gönderir. -->
  <div class="hata">
    <div class="hata__kutu fade-in">
      <p class="hata__kod">403</p>
      <h1 class="hata__baslik">Erişim Engellendi</h1>
      <p class="hata__metin">
        Bu sayfayı görüntüleme yetkin yok. Yanlış hesapla giriş yapmış olabilirsin.
      </p>

      <div class="hata__butonlar">
        <router-link to="/" class="btn btn-primary">Anasayfa</router-link>
        <router-link v-if="!oturum.girisYapildi" to="/giris" class="btn btn-outline-primary">
          Giriş Yap
        </router-link>
        <router-link v-else :to="panelYolu()" class="btn btn-outline-primary">
          Panelim
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { oturum, panelYolu } from '../utils/oturum.js'
</script>

<style scoped>
.hata {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

.hata__kutu {
  background: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge-buyuk);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 560px;
  width: 100%;
}

.hata__kod {
  font-family: var(--font-baslik);
  font-size: 48px;
  color: var(--kirmizi);
  margin-bottom: var(--bosluk);
}

.hata__baslik {
  font-size: 20px;
  color: var(--metin);
  margin-bottom: var(--bosluk);
}

.hata__metin {
  color: var(--metin-soluk);
  margin-bottom: var(--bosluk-buyuk);
}

.hata__butonlar {
  display: flex;
  gap: var(--bosluk-kucuk);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .hata__kod {
    font-size: 32px;
  }

  .hata__kutu {
    padding: 2rem 1rem;
  }
}
</style>
