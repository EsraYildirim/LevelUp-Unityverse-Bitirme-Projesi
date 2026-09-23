<template>
  <section class="test-example">
    <h2 class="test-example__title">v-bind:src Örneği</h2>

    <!-- Uzun hali -->
    <img v-bind:src="imageUrl" alt="Resim" class="test-example__img" />

    <!-- Kısa hali -->
    <img :src="imageUrl" alt="Resim 2" class="test-example__img" />
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-bind:src örneği için resim adresi
const imageUrl = ref('https://vuejs.org/images/logo.png')
</script>
