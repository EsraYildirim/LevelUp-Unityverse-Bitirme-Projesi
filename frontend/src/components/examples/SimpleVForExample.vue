<template>
  <section class="test-example">
    <h2 class="test-example__title">Basit v-for Örneği</h2>
    <ul class="test-example__list">
      <li v-for="fruit in fruits" :key="fruit">{{ fruit }}</li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Basit v-for örneği için meyve listesi
const fruits = ref(['Elma', 'Armut', 'Çilek', 'Muz'])
</script>
