<template>
  <button
    type="button"
    class="btn btn-outline-primary pi-cart__trigger"
    data-bs-toggle="offcanvas"
    data-bs-target="#piSepetSidebar"
    aria-controls="piSepetSidebar"
  >
    🛒 Sepet ({{ toplamAdet }})
  </button>

  <!-- .fade-in atasındaki transform, position:fixed offcanvas'ı sayfa dışına
       taşıdığı için Teleport ile doğrudan body'ye render ediyoruz -->
  <Teleport to="body">
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1"
      id="piSepetSidebar"
      aria-labelledby="piSepetSidebarLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="piSepetSidebarLabel">Sepetim</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Kapat"></button>
      </div>
      <div class="offcanvas-body">
        <p v-if="!sepet.length" class="text-muted">Sepetiniz boş.</p>

        <template v-else>
          <div class="row fw-bold mb-2">
            <div class="col-6">Ürün Adı</div>
            <div class="col-3">Adet</div>
            <div class="col-3">Fiyat</div>
          </div>
          <div class="row align-items-center mb-2" v-for="(item, index) in sepet" :key="index">
            <div class="col-6">{{ item.icon }} {{ item.name }}</div>
            <div class="col-3">{{ item.quantity }}</div>
            <div class="col-3">{{ item.price * item.quantity }} TL</div>
          </div>
          <hr />
          <div class="row fw-bold">
            <div class="col-6">Toplam Tutar:</div>
            <div class="col-6">{{ toplamTutar }} TL</div>
          </div>
          <button
            type="button"
            class="btn btn-success w-100 mt-3"
            data-bs-dismiss="offcanvas"
            @click="$emit('odeme-sayfasina-git')"
          >
            Ödeme Sayfasına Geç
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { inject, computed } from 'vue'

defineEmits(['odeme-sayfasina-git'])

// inject: üst bileşenin provide ettiği "sepet" verisini burada okuyoruz
const sepet = inject('sepet')

const toplamTutar = computed(() =>
  sepet.reduce((toplam, item) => toplam + item.price * item.quantity, 0)
)

const toplamAdet = computed(() =>
  sepet.reduce((toplam, item) => toplam + item.quantity, 0)
)
</script>

<style scoped>
.pi-cart__trigger {
  margin-bottom: 1.25rem;
}
</style>
