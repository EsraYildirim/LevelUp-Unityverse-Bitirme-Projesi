<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model.trim Örneği</h2>
    <p>v-model.trim girilen değerin başındaki ve sonundaki boşlukları otomatik siler.</p>
    <input
      v-model.trim="trimIsim"
      type="text"
      class="form-control test-example__input"
      placeholder="Adınızı girin"
    />
    <p class="mt-2">"{{ trimIsim }}"</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model.trim örneği için isim
const trimIsim = ref('')
</script>
