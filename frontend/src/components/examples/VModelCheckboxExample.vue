<template>
  <section class="test-example">
    <h2 class="test-example__title">v-model Checkbox Örneği</h2>
    <h3 class="test-example__subtitle">Hangi dilleri biliyorsunuz?</h3>
    <div class="test-example__checkboxes">
      <label class="form-check">
        <input v-model="languages" class="form-check-input" type="checkbox" value="JavaScript" />
        <span class="form-check-label">JavaScript</span>
      </label>
      <label class="form-check">
        <input v-model="languages" class="form-check-input" type="checkbox" value="Python" />
        <span class="form-check-label">Python</span>
      </label>
      <label class="form-check">
        <input v-model="languages" class="form-check-input" type="checkbox" value="Java" />
        <span class="form-check-label">Java</span>
      </label>
    </div>
    <p class="mt-2">Seçilenler: {{ languages }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-model checkbox örneği için diller listesi
const languages = ref([])
</script>
