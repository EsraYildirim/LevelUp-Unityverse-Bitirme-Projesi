<template>
  <section class="test-example">
    <h2 class="test-example__title">Soru 4 — Parola Gücü Değerlendirme</h2>
    <p>Parola 8 karakterden uzunsa "Güçlü parola", değilse "Zayıf parola" mesajı gösterilir.</p>
    <input
      v-model="password"
      type="text"
      class="form-control test-example__input"
      placeholder="Parola girin"
    />
    <p v-if="password.length > 8" class="mt-2 text-success">Güçlü parola</p>
    <p v-else class="mt-2 text-danger">Zayıf parola</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Soru 4: parola gücü değerlendirme
const password = ref('')
</script>
