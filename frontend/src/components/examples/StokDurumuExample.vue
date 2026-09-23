<template>
  <section class="test-example">
    <h2 class="test-example__title">Soru 1 — Ürün Stok Durumu Gösterimi</h2>
    <p>Stok ürün varsa yeşil renkte "Stok var", stok sayısı 0 ise kırmızı renkte "Tükendi" yazılacak.</p>
    <input
      v-model="stok"
      type="text"
      class="form-control test-example__input"
      placeholder="Stok sayısını girin"
    />
    <p class="mt-2" :class="stok > 0 ? 'text-success' : 'text-danger'">
      {{ stok > 0 ? 'Stok var' : 'Tükendi' }}
    </p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Soru 1: stok durumu
const stok = ref('')
</script>
