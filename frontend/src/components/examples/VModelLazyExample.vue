<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model.lazy Örneği</h2>
    <p>v-model.lazy inputtan çıkınca değişkeni günceller.</p>
    <input v-model.lazy="message" type="text" class="form-control test-example__input" />
    <p class="mt-2">{{ message }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model.lazy örneği için mesaj
const message = ref('')
</script>
