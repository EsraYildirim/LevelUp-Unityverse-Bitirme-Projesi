<template>
  <section class="test-example">
    <h2 class="test-example__title">Soru 2 — Kullanıcı Listesi + Filtreleme</h2>
    <p>Sadece active === true olan öğrencileri listeleyen bir v-for yapısı (computed ile).</p>
    <!-- Filtrelenmiş öğrencileri computed'da hesaplayıp v-for'a yerleştirdik -->
    <ul class="test-example__list">
      <li v-for="ogrenci in filtreliOgrenciler" :key="ogrenci.name">{{ ogrenci.name }}</li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

// Soru 2: öğrenci listesi + computed ile filtreleme
const ogrenciler = ref([
  { name: 'Ali', active: true },
  { name: 'Ayşe', active: false },
  { name: 'Mehmet', active: true },
])
const filtreliOgrenciler = computed(() =>
  ogrenciler.value.filter((ogrenci) => ogrenci.active === true)
)
</script>
