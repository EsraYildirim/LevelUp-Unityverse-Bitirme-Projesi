<template>
  <div class="admin-panel">
    <div class="admin-panel__header">
      <h2 class="admin-panel__title">Siparişler</h2>
    </div>

    <p v-if="error" class="admin-panel__error">{{ error }}</p>
    <p v-if="basariMesaji" class="admin-panel__success">{{ basariMesaji }}</p>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Sipariş No</th>
            <th scope="col">Sipariş Veren</th>
            <th scope="col">Ürünler</th>
            <th scope="col">Adres</th>
            <th scope="col">Toplam Tutar</th>
            <th scope="col">Sipariş Tarihi</th>
            <th scope="col">Durum</th>
            <th scope="col">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.o_id">
            <!-- Veritabanı id'si yerine satır sırası gösteriliyor -->
            <th>{{ index + 1 }}</th>
            <td>{{ order.o_no }}</td>
            <td>{{ order.o_person }}</td>
            <!-- Sipariş içeriği sonradan değiştirilmez, sadece okunur -->
            <td>{{ urunleriYaz(order.o_products) }}</td>
            <td>{{ order.o_address }}</td>
            <td class="admin-panel__tutar">{{ paraYaz(order.o_amount) }}</td>
            <td>{{ tarihYaz(order.o_created_at) }}</td>
            <td>
              <Secim v-model="order.o_status" :secenekler="durumlar" />
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-1"
                @click="updateOrder(order.o_id, order.o_status)"
              >
                Güncelle
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="deleteOrder(order.o_id)"
              >
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { basari, hata } from '../../utils/bildirim.js'
import Secim from '../Secim.vue'
import { paraYaz } from '../../utils/para.js'
import { tarihYaz } from '../../utils/tarih.js'

const baseUrl = 'http://localhost:3001'
const orders = ref([])
const durumlar = ['Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi']

const error = ref('')
const basariMesaji = ref('')

// o_products backend'de dizi olarak gelir, tabloda okunur şekilde gösterilir
function urunleriYaz(urunler) {
  return Array.isArray(urunler) ? urunler.join(', ') : urunler
}

async function getOrders() {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/orders`)
    if (!res.ok) throw new Error('Siparişler alınamadı.')
    orders.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
}

// Sadece sipariş durumunu (o_status) günceller
async function updateOrder(o_id, status) {
  error.value = ''
  basariMesaji.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/orders/${o_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Sipariş durumu güncellenemedi.')
    basariMesaji.value = await res.json()
    await getOrders()
    basari(`Sipariş durumu "${status}" olarak güncellendi.`)
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

async function deleteOrder(o_id) {
  if (!confirm('Bu sipariş silinsin mi? Bu işlem geri alınamaz.')) return
  error.value = ''
  basariMesaji.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/orders/${o_id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Sipariş silinemedi.')
    await getOrders()
    basari('Sipariş silindi.')
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

onMounted(() => {
  getOrders()
})
</script>

<style scoped>
.admin-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.admin-panel__title {
  font-weight: 700;
  margin: 0;
}

.admin-panel__tutar {
  font-weight: 600;
  white-space: nowrap;
}

.admin-panel__error {
  color: var(--kirmizi);
}

.admin-panel__success {
  color: var(--turkuaz);
}

/* Tablo küçük ekranlarda yatay kaydırılabilir olsun, select sıkışmasın */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.admin-panel table select.form-select {
  min-width: 170px;
}

@media (max-width: 576px) {
  .admin-panel__header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}
</style>
