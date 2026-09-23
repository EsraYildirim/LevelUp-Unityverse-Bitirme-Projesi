<template>
  <section class="test-example">
    <h2 class="test-example__title">v-on Örneği</h2>
    <!-- v-on = @ - Kullanıcı bir etkileşime giriyorsa kullanılır. Örn. buttona @click -->
    <button type="button" class="btn btn-primary" @click="uyari('Buttona tıklandı')">
      Tıkla
    </button>

    <br /><br />

    <!-- v-model: inputları değişkenlere bağlamak için kullanılır -->
    <div class="test-example__search">
      <input
        v-model="searchMetin"
        type="text"
        class="form-control"
        placeholder="Ara..."
        @keyup.enter="search"
      />
      <button type="button" class="btn btn-primary" @click="search">Search</button>
    </div>

    <br />

    <!-- @click.self: sadece elementin kendisine tıklanınca çalışır, alt elemanlarına tıklanınca çalışmaz -->
    <p class="test-example__clickable" @click.self="uyari('p tagine tıklandı')">
      Normalde p tag'ına tıklayamazsın.
    </p>

    <img
      src="/favicon.svg"
      alt="Logo"
      height="50"
      width="50"
      class="test-example__click-img"
      @click.self="uyari('resime tıklandı')"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-on örneği: bir etkileşime girildiğinde çalışacak fonksiyon
function uyari(mesaj) {
  alert(mesaj)
  console.log(mesaj)
}

// v-model + @keyup.enter arama örneği
const searchMetin = ref('')
function search() {
  uyari(`Arama yapıldı: ${searchMetin.value}`)
}
</script>

<style scoped>
.test-example__search {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
}

.test-example__clickable {
  display: inline-block;
  padding: 1rem;
  /* Koyu temada açık gri zemin yazıyı yutuyordu; panel rengi + kenarlık kullanılıyor */
  background-color: var(--zemin);
  border: var(--kenar);
  color: var(--metin);
  cursor: pointer;
}

.test-example__click-img {
  cursor: pointer;
  border: var(--kenar);
  background-color: var(--zemin);
  padding: 0.5rem;
}
</style>
