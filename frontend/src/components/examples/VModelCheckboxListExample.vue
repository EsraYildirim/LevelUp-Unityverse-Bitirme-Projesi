<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model Checkbox Listesi Örneği</h2>
    <p>Checkbox v-model ile listeye bağlandığında tıklayınca value'yu otomatik listeye ekler.</p>
    <div class="test-example__checkboxes">
      <label class="form-check">
        <input v-model="diller" class="form-check-input" type="checkbox" value="VUEJS3" />
        <span class="form-check-label">Vuejs3</span>
      </label>
      <label class="form-check">
        <input v-model="diller" class="form-check-input" type="checkbox" value="JS" />
        <span class="form-check-label">JavaScript</span>
      </label>
      <label class="form-check">
        <input v-model="diller" class="form-check-input" type="checkbox" value="HTML" />
        <span class="form-check-label">HTML</span>
      </label>
    </div>
    <p class="mt-2">{{ diller }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model checkbox listesi örneği için diller
const diller = ref([])
</script>
