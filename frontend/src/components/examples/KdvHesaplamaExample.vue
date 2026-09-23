<template>
  <section class="test-example">
    <h2 class="test-example__title">Soru 6 — Ürün Fiyatı ve KDV Hesaplama</h2>
    <p>Kullanıcı fiyatı yazdıkça ekranda KDV dahil fiyat = price * 1.20 gösterilir.</p>
    <input
      v-model.number="price"
      type="number"
      class="form-control test-example__input"
      placeholder="Fiyat girin"
    />
    <p class="mt-2">KDV dahil fiyat: {{ (price * 1.2).toFixed(2) }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Soru 6: fiyat + KDV hesaplama
const price = ref(0)
</script>
