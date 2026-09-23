<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model Select Örneği</h2>
    <p>Select yapısında seçilen option'ın değerini değişkene atar. Select'i v-model ile bağlıyoruz.</p>
    <select v-model="sehir" class="form-select test-example__input">
      <option value="34">İstanbul</option>
      <option value="06">Ankara</option>
      <option value="35">İzmir</option>
    </select>
    <p class="mt-2">{{ sehir }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model select örneği için şehir
const sehir = ref('34')
</script>
