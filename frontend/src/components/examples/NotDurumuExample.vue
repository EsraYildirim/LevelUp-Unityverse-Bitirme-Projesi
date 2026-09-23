<template>
  <section class="test-example">
    <h2 class="test-example__title">Not Durumu</h2>
    <label for="test-score" class="form-label not-durumu__label">Puan: {{ score }}</label>
    <input id="test-score" v-model.number="score" type="range" min="0" max="100" class="form-range not-durumu__range" />
    <p v-if="score >= 90">Harf Notunuz: AA</p>
    <p v-else-if="score >= 80">Harf Notunuz: BB</p>
    <p v-else-if="score >= 50">Harf Notunuz: CC</p>
    <p v-else>Kaldınız 😄</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-if / v-else-if / v-else örneği için not durumu
const score = ref(75)
</script>

<style scoped>
.not-durumu__range,
.not-durumu__label {
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}

.not-durumu__label {
  display: block;
}
</style>
