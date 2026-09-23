<template>
  <div class="row g-3">
    <div class="col-12 col-sm-6 col-lg-4" v-for="(product, index) in products" :key="index">
      <div class="card h-100">
        <div class="card-body">
          <div class="pi-child__icon">{{ product.icon }}</div>
          <h5 class="card-title">{{ product.name }}</h5>
          <h6 class="card-subtitle text-muted mb-2">{{ product.price }} TL</h6>
          <p class="card-text">Stok: {{ product.stock }}</p>
          <button type="button" class="btn btn-primary" @click="sepeteEkle(index)">
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// inject: üst bileşenin (ProvideInjectExample) provide ettiği "products" ve "sepet"
// verilerini hiçbir props geçmeden doğrudan burada kullanabiliyoruz
const products = inject('products')
const sepet = inject('sepet')

// Ürün zaten sepette varsa adedini artırır, yoksa sepete yeni ekler
function sepeteEkle(index) {
  const urun = products[index]
  const mevcut = sepet.find((item) => item.name === urun.name)
  if (mevcut) {
    mevcut.quantity++
  } else {
    sepet.push({ name: urun.name, price: urun.price, icon: urun.icon, quantity: 1 })
  }
}
</script>

<style scoped>
.pi-child__icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>
