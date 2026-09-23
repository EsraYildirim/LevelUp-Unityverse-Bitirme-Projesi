<template>
  <section class="test-example">
    <h2 class="test-example__title">Provide / Inject Örneği (Sepet ile)</h2>
    <p class="test-example__subtitle">
      Bu üst bileşen <code>provide</code> ile "products" ve "sepet" verilerini sağlar; alt
      bileşenler (ürün listesi, sepet ve ödeme sayfası) bu verileri <code>inject</code> ile
      props geçmeden kullanır. "Sepete Ekle" butonuna basınca ürün sepette anında görünür;
      "Ödeme Sayfasına Geç" ise aynı sepet verisiyle bir sipariş özeti açar.
    </p>
    <ProvideInjectCart @odeme-sayfasina-git="showCheckout = true" />
    <ProvideInjectChild />
    <ProvideInjectCheckout v-if="showCheckout" @kapat="showCheckout = false" />
  </section>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'
import ProvideInjectChild from './ProvideInjectChild.vue'
import ProvideInjectCart from './ProvideInjectCart.vue'
import ProvideInjectCheckout from './ProvideInjectCheckout.vue'

// Provide/Inject örneği: hoca'nın App.vue'de reactive() ile tanımlayıp
// provide() içinde döndürdüğü "products" ve "sepet" verilerinin karşılığı
const products = reactive([
  { name: 'Klavye', price: 450, stock: 12, icon: '⌨️' },
  { name: 'Mouse', price: 250, stock: 30, icon: '🖱️' },
  { name: 'Kulaklık', price: 600, stock: 8, icon: '🎧' },
])

const sepet = reactive([])
const showCheckout = ref(false)

provide('products', products)
provide('sepet', sepet)
</script>
