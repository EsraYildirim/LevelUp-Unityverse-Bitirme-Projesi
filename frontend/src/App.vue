<template>
  <div class="app">
    <Navbar />
    <main class="app__main">
      <router-view />
    </main>
    <Footer />
    <!-- Tüm sayfaların paylaştığı bildirim alanı (sağ üst) -->
    <Bildirimler />
  </div>
</template>

<script setup>
import { reactive, provide, watch } from 'vue'
// Ana bileşenler
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Bildirimler from './components/Bildirimler.vue'

// Sepet burada tutulur ve provide ile tüm sayfalara (views) dağıtılır.
// Böylece Ürünler, Navbar ve Ödeme sayfası aynı sepeti paylaşır.
const CART_KEY = 'levelup_cart'

function sepetiYukle() {
  try {
    const kayitli = localStorage.getItem(CART_KEY)
    return kayitli ? JSON.parse(kayitli) : []
  } catch {
    return []
  }
}

const sepet = reactive(sepetiYukle())

provide('sepet', sepet)

// Sepet her değiştiğinde localStorage'a yazılır, sayfa yenilense bile kaybolmaz
watch(
  sepet,
  (val) => {
    localStorage.setItem(CART_KEY, JSON.stringify(val))
  },
  { deep: true }
)
</script>

<style>
/* Global stiller */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-govde);
  font-size: 16px;
  line-height: 1.6;
  background-color: var(--zemin);
  color: var(--metin);
}

#app {
  min-height: 100vh;
}

a {
  text-decoration: none;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__main {
  flex: 1;
}
</style>
