<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model.number Örneği (Yaş)</h2>
    <!-- v-model.number: input'tan gelen değeri otomatik olarak sayıya çevirir -->
    <input v-model.number="age" type="number" class="form-control test-example__input" />
    <p class="mt-2">Yaş (type: {{ typeof age }}): {{ age }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model.number örneği için yaş
const age = ref(0)
</script>
