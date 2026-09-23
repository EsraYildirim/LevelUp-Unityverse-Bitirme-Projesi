<template>
  <section class="test-example">
    <h2 class="test-example__title">v-if / v-else Örneği</h2>
    <!-- v-if: koşula bağlı olarak elementi DOM'a ekler/kaldırır -->
    <div v-if="loggedIn">Hoş geldin, {{ isim }}</div>
    <div v-else>Giriş yapmadınız.</div>
    <button type="button" class="btn btn-primary mt-2" @click="loggedIn = !loggedIn">
      Durum Değiştir
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-if / v-else örneği için giriş durumu
const loggedIn = ref(false)
const isim = ref('Esra')
</script>
