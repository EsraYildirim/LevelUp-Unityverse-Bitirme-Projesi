<template>
  <section class="test-example">
    <h2 class="test-example__title">Ürün Yönetimi (CRUD) Örneği</h2>

    <h3 class="test-example__subtitle">Ürün Ekle</h3>
    <div class="urun-yonetimi__form">
      <div class="mb-2">
        <label class="form-label">Ürün Adı:</label>
        <input v-model="urunAdi" type="text" class="form-control" />
      </div>
      <div class="mb-2">
        <label class="form-label">Stok:</label>
        <input v-model.number="urunStok" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Fiyat:</label>
        <input v-model.number="urunFiyat" type="number" class="form-control" />
      </div>
      <button type="button" class="btn btn-primary" @click="urunKaydet">
        {{ editingId ? 'Ürünü Güncelle' : 'Ürün Ekle' }}
      </button>
    </div>

    <h3 class="test-example__subtitle mt-4">Ürünlerimiz</h3>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Ad</th>
            <th scope="col">Stok</th>
            <th scope="col">Fiyat</th>
            <th scope="col">KDV'li Fiyat</th>
            <th scope="col">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="urun in urunler" :key="urun.id">
            <td>{{ urun.id }}</td>
            <td>{{ urun.ad }}</td>
            <td>{{ urun.stok }}</td>
            <td>{{ urun.fiyat }}</td>
            <td>{{ (urun.fiyat * 1.2).toFixed(2) }}</td>
            <td>
              <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="urunDuzenle(urun)">
                Güncelle
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="urunSil(urun.id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Ürün yönetimi (CRUD) örneği
const urunAdi = ref('')
const urunStok = ref(0)
const urunFiyat = ref(0)
const editingId = ref(null)
const urunler = ref([
  { id: 1, ad: 'nike', stok: 0, fiyat: 100 },
  { id: 2, ad: 'adidas', stok: 200, fiyat: 1000 },
])

function urunFormuTemizle() {
  urunAdi.value = ''
  urunStok.value = 0
  urunFiyat.value = 0
  editingId.value = null
}

function urunKaydet() {
  if (!urunAdi.value.trim()) return

  if (editingId.value) {
    const urun = urunler.value.find((u) => u.id === editingId.value)
    if (urun) {
      urun.ad = urunAdi.value
      urun.stok = urunStok.value
      urun.fiyat = urunFiyat.value
    }
  } else {
    const yeniId = urunler.value.length ? Math.max(...urunler.value.map((u) => u.id)) + 1 : 1
    urunler.value.push({ id: yeniId, ad: urunAdi.value, stok: urunStok.value, fiyat: urunFiyat.value })
  }

  urunFormuTemizle()
}

function urunDuzenle(urun) {
  editingId.value = urun.id
  urunAdi.value = urun.ad
  urunStok.value = urun.stok
  urunFiyat.value = urun.fiyat
}

function urunSil(id) {
  urunler.value = urunler.value.filter((u) => u.id !== id)
  if (editingId.value === id) urunFormuTemizle()
}
</script>

<style scoped>
.urun-yonetimi__form {
  max-width: 320px;
  margin: 0 auto;
  text-align: left;
}
</style>
