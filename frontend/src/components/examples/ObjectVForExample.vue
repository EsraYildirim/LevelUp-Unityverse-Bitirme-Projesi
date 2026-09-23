<template>
  <section class="test-example">
    <h2 class="test-example__title">Obje Dizisi ile v-for Örneği</h2>
    <!-- :key="student.id" - Vue'nun listedeki elemanları izleyebilmesi için benzersiz anahtar gerekir -->
    <ul class="test-example__list">
      <li v-for="student in students" :key="student.id">
        {{ student.id }} - {{ student.name }} ({{ student.grade }})
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Obje dizisi ile v-for örneği için öğrenci listesi
const students = ref([
  { id: 1, name: 'Ayşe', grade: 90 },
  { id: 2, name: 'Ali', grade: 75 },
  { id: 3, name: 'Zeynep', grade: 60 },
])
</script>
