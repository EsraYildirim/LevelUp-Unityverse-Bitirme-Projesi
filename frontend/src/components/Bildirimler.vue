<template>
  <!-- Ekranın sağ üstünde biriken bildirimler. App.vue'da bir kez yerleştirilir,
       her sayfa utils/bildirim.js üzerinden buraya mesaj yollar. -->
  <div class="bildirimler" role="status" aria-live="polite">
    <TransitionGroup name="bildirim">
      <div
        v-for="bildirim in bildirimler"
        :key="bildirim.id"
        class="bildirim"
        :class="`bildirim--${bildirim.tur}`"
      >
        <span class="bildirim__ikon" aria-hidden="true">{{ ikonlar[bildirim.tur] }}</span>
        <p class="bildirim__metin">{{ bildirim.metin }}</p>
        <button
          type="button"
          class="bildirim__kapat"
          aria-label="Bildirimi kapat"
          @click="bildirimiKapat(bildirim.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { bildirimler, bildirimiKapat } from '../utils/bildirim.js'

const ikonlar = {
  basari: '✓',
  uyari: '!',
  hata: '✕',
}
</script>

<style scoped>
.bildirimler {
  position: fixed;
  top: calc(var(--navbar-yukseklik) + var(--bosluk));
  right: var(--bosluk);
  z-index: 1080; /* Bootstrap modal (1055) üstünde kalsın */
  display: flex;
  flex-direction: column;
  gap: var(--bosluk-kucuk);
  width: min(360px, calc(100vw - var(--bosluk) * 2));
  /* Kutu boşken altındaki sayfaya tıklanabilsin */
  pointer-events: none;
}

.bildirim {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: var(--bosluk-kucuk);
  padding: 12px;
  /* Panel moru üzerinde bildirimler seçilmiyordu; artık her tür kendi
     canlı rengini zemin olarak kullanıyor ve yazı koyu renk. */
  border: var(--kenar);
  box-shadow: var(--golge-buyuk);
}

.bildirim--basari {
  background-color: var(--turkuaz);
  color: var(--cerceve);
}

.bildirim--uyari {
  background-color: var(--sari);
  color: var(--cerceve);
}

.bildirim--hata {
  background-color: var(--kirmizi);
  color: #fff;
}

.bildirim__ikon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-baslik);
  font-size: 11px;
  /* Zemin canlı renk olduğu için ikon tersine dönüyor: koyu kutu, açık yazı */
  color: var(--turkuaz);
  background-color: var(--cerceve);
}

.bildirim--uyari .bildirim__ikon {
  color: var(--sari);
}

.bildirim--hata .bildirim__ikon {
  color: #fff;
}

.bildirim__metin {
  flex: 1;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: inherit;
  overflow-wrap: anywhere;
}

.bildirim__kapat {
  flex-shrink: 0;
  padding: 0 4px;
  font-size: 15px;
  line-height: 1;
  color: inherit;
  opacity: 0.65;
  background: none;
  border: none;
  cursor: pointer;
}

.bildirim__kapat:hover {
  opacity: 1;
}

/* Sağdan kayarak girer, solurken küçülür */
.bildirim-enter-active,
.bildirim-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.bildirim-enter-from,
.bildirim-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (prefers-reduced-motion: reduce) {
  .bildirim-enter-active,
  .bildirim-leave-active {
    transition: none;
  }
}
</style>
