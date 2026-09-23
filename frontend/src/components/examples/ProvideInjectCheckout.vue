<template>
  <div class="pi-checkout mt-4">
    <div class="pi-checkout__header">
      <h3 class="test-example__subtitle mb-0">Ödeme Sayfası</h3>
      <button type="button" class="btn-close" aria-label="Kapat" @click="$emit('kapat')"></button>
    </div>

    <p v-if="!sepet.length" class="text-muted">
      Sepetiniz boş, ödeme sayfasında gösterilecek bir şey yok.
    </p>

    <ul v-else class="list-group pi-checkout__list">
      <li
        class="list-group-item d-flex justify-content-between align-items-center lh-sm"
        v-for="(item, index) in sepet"
        :key="index"
      >
        <div>
          <h6 class="my-0">{{ item.icon }} {{ item.name }}</h6>
          <small class="text-body-secondary">{{ item.quantity }} adet</small>
        </div>
        <span class="text-body-secondary">{{ item.price * item.quantity }} TL</span>
      </li>
      <li class="list-group-item d-flex justify-content-between fw-bold">
        <span>Toplam (TL)</span>
        <span>{{ toplamTutar }} TL</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

// inject: sepet bilgisini burada da props geçmeden okuyoruz
const sepet = inject('sepet')
defineEmits(['kapat'])

const toplamTutar = computed(() =>
  sepet.reduce((toplam, item) => toplam + item.price * item.quantity, 0)
)
</script>

<style scoped>
.pi-checkout {
  text-align: left;
  max-width: 480px;
  margin: 0 auto;
}

.pi-checkout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.pi-checkout__list {
  margin-bottom: 1rem;
}
</style>
