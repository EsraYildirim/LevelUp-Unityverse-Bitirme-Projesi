<template>
  <section class="test-example">
    <h2 class="test-example__title">v-show Örneği</h2>
    <!-- v-show: elementi DOM'da tutar, sadece display:none / display:block ile gizler-gösterir -->
    <button type="button" class="btn btn-primary mb-3" @click="durum = !durum">
      Göster/Gizle
    </button>
    <br />
    <img v-show="durum" src="/favicon.svg" alt="Logo görünür" class="test-example__img" />
    <img v-show="!durum" src="/favicon.svg" alt="Logo gizli" class="test-example__img test-example__img--faded" />
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-show örneği için görünürlük durumu
const durum = ref(true)
</script>

<style scoped>
.test-example__img--faded {
  opacity: 0.3;
}
</style>
