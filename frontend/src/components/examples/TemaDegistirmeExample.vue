<template>
  <section class="test-example">
    <h2 class="test-example__title">Soru 5 — Sayfa Teması Değiştirme</h2>
    <p>Butona basıldığında arka plan rengi isDark true ise siyah, false ise beyaz olacak.</p>
    <!-- v-bind:style ile isDark değerine göre dinamik renk bağlama -->
    <div
      class="tema__box"
      :style="{ backgroundColor: isDark ? '#000000' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }"
    >
      Burası değişiyor
    </div>
    <button type="button" class="btn btn-primary mt-3" @click="isDark = !isDark">
      Açık/Kapalı Tema
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Soru 5: sayfa teması değiştirme
const isDark = ref(false)
</script>

<style scoped>
.tema__box {
  height: 200px;
  width: 200px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
