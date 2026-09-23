<template>
  <section class="test-example">
    <h2 class="test-example__title">v-bind Örneği</h2>
    <div :class="vueClass" class="test-example__box">
      Bu kutunun sınıfı v-bind:class ile "{{ vueClass }}" olarak bağlandı.
    </div>
    <button type="button" class="btn btn-primary mt-3" @click="toggleClass">
      Sınıfı Değiştir
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-bind:class örneği için reaktif sınıf verisi
const vueClass = ref('pinkBG')

// pinkBG ile blueBG arasında geçiş yapar
function toggleClass() {
  vueClass.value = vueClass.value === 'pinkBG' ? 'blueBG' : 'pinkBG'
}
</script>

<style scoped>
.test-example__box {
  padding: 2rem;
  transition: background-color 0.3s ease;
}

/* Açık renkli zeminlerde yazı koyu olmalı, yoksa okunmuyor */
.pinkBG {
  background-color: lightpink;
  color: var(--cerceve);
}

.blueBG {
  background-color: lightblue;
  color: var(--cerceve);
}
</style>
