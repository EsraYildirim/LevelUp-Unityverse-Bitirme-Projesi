<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model.number Örneği</h2>
    <p>v-model.number değeri sayısal alır.</p>
    <input
      v-model.number="sayi"
      type="text"
      class="form-control test-example__input"
      placeholder="1. sayıyı girin"
    />
    <p class="mt-2">{{ sayi * 20 }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model.number ile çarpma örneği için sayı
const sayi = ref(0)
</script>
