<template>
  <section class="test-example">
    <h2 class="test-example__title">TO-DO LIST</h2>
    <p>Input'tan alınan değeri Enter'a basınca görevler dizisine ekleyip listeler.</p>
    <input
      v-model="gorev"
      type="text"
      class="form-control test-example__input"
      placeholder="Görev girin ve Enter'a basın"
      @keyup.enter="gorevEkle"
    />
    <ul class="test-example__list mt-3">
      <li v-for="(g, index) in gorevler" :key="index" class="todo-list__task">
        <span>{{ g }}</span>
        <span class="todo-list__delete" @click="gorevSil(index)">❌</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Görev ekleme örneği
const gorev = ref('')
const gorevler = ref([])
function gorevEkle() {
  if (!gorev.value.trim()) return
  gorevler.value.push(`${gorevler.value.length + 1}.${gorev.value}`)
  gorev.value = ''
}
function gorevSil(index) {
  gorevler.value.splice(index, 1)
}
</script>

<style scoped>
.todo-list__task {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todo-list__delete {
  cursor: pointer;
}
</style>
