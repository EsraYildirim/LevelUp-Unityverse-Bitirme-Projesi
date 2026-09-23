<template>
  <!-- Panel sol menüsü: Admin ve Hesabım sayfalarının ortak kenar çubuğu -->
  <aside class="panel-kenar">
    <h2 class="panel-kenar__baslik">{{ baslik }}</h2>

    <nav class="panel-kenar__menu">
      <button
        v-for="sekme in sekmeler"
        :key="sekme.deger"
        type="button"
        class="btn w-100 panel-kenar__buton"
        :class="modelValue === sekme.deger ? 'btn-primary' : 'btn-outline-primary'"
        @click="$emit('update:modelValue', sekme.deger)"
      >
        {{ sekme.ad }}
      </button>
    </nav>

    <!-- Alt kısım: giriş yapan kullanıcı ve çıkış -->
    <div class="panel-kenar__alt">
      <p class="panel-kenar__kullanici">{{ oturum.isim || 'Kullanıcı' }}</p>
      <button type="button" class="btn btn-outline-primary panel-kenar__cikis" @click="cikis">
        Çıkış Yap
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { oturum, cikisYap } from '../utils/oturum.js'

defineProps({
  baslik: { type: String, default: 'Panel' },
  // [{ ad: 'Ürünler', deger: 'urunler' }, ...]
  sekmeler: { type: Array, required: true },
  modelValue: { type: String, required: true },
})
defineEmits(['update:modelValue'])

const router = useRouter()

function cikis() {
  cikisYap()
  router.push('/giris')
}
</script>

<style scoped>
.panel-kenar {
  display: flex;
  flex-direction: column;
  background-color: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge);
  padding: var(--bosluk);
  /* Menü sayfayla birlikte uzamaz; ekrana yapışır. Böylece uzun bir sekme
     (Ders Notları gibi) açıkken bile Çıkış Yap için sayfayı kaydırmak gerekmez. */
  position: sticky;
  top: calc(var(--navbar-yukseklik) + var(--bosluk));
  /* Menü ekrandan uzunsa kendi içinde kaysın, sayfayı uzatmasın */
  max-height: calc(100vh - var(--navbar-yukseklik) - var(--bosluk) * 2);
  overflow-y: auto;
}

.panel-kenar__baslik {
  font-size: 12px;
  color: var(--sari);
  margin-bottom: var(--bosluk);
}

.panel-kenar__menu {
  display: flex;
  flex-direction: column;
  gap: var(--bosluk-kucuk);
}

.panel-kenar__buton {
  font-size: 10px;
  text-align: left;
}

/* Kullanıcı bilgisi menünün hemen altında, ince bir çizgiyle ayrılmış */
.panel-kenar__alt {
  margin-top: var(--bosluk-buyuk);
  padding-top: var(--bosluk);
  border-top: 2px solid var(--zemin);
}

.panel-kenar__kullanici {
  font-family: var(--font-baslik);
  font-size: 10px;
  color: var(--turkuaz);
  margin-bottom: var(--bosluk-kucuk);
  overflow-wrap: anywhere;
}

.panel-kenar__cikis {
  font-size: 10px;
  width: 100%;
}

/* Dar ekranda menü içeriğin üstünde normal akışta durur */
@media (max-width: 767.98px) {
  .panel-kenar {
    position: static;
    max-height: none;
    overflow-y: visible;
  }

  .panel-kenar__alt {
    margin-top: var(--bosluk);
  }
}
</style>
