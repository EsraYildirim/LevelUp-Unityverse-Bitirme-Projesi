<template>
  <section class="test-example">
    <h2 class="test-example__title">Vue + Node.js Basit Örnek</h2>
    <p class="test-example__subtitle">
      Butonlara tıklanınca <code>fetch</code> ile gerçek bir Express (Node.js) sunucusuna
      (backend/server.js, http://localhost:3001) istek atılır.
    </p>

    <div class="node-api__buttons">
      <button type="button" class="btn btn-primary me-2" @click="getHello">Hello çağır</button>
      <button type="button" class="btn btn-outline-primary me-2" @click="getStudents">Öğrencileri çek</button>
      <button type="button" class="btn btn-outline-primary" @click="getProducts">Ürünleri çek</button>
    </div>

    <p v-if="hello" class="node-api__result">
      <b>Backend mesajı:</b> {{ hello.message }}<br />
      <b>Zaman:</b> {{ hello.time }}
    </p>

    <h3 class="test-example__subtitle mt-4">Öğrenciler</h3>
    <ul class="test-example__list">
      <li v-for="s in students" :key="s.id">
        {{ s.id }} - {{ s.name }} (Not: {{ s.grade }})
      </li>
    </ul>

    <h3 class="test-example__subtitle mt-4">Ürünler (Güncelle / Sil)</h3>
    <div class="table-responsive">
      <table class="table table-striped node-api__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Stok</th>
            <th>Fiyat</th>
            <th>KDV'li Fiyat</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.p_id">
            <td>{{ p.p_id }}</td>
            <td><input type="text" class="form-control" v-model="p.p_name" /></td>
            <td><input type="number" min="0" class="form-control" v-model.number="p.p_stock" /></td>
            <td><input type="number" min="0" step="0.01" class="form-control" v-model.number="p.p_price" /></td>
            <td>{{ (p.p_price * 1.2).toFixed(2) }}</td>
            <td>
              <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="updateProduct(p)">
                Güncelle
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteProduct(p.p_id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="test-example__subtitle mt-4">Ürün Ekle (POST)</h3>
    <form class="node-api__form" @submit.prevent="addProduct">
      <div class="row mb-2 align-items-center">
        <label class="col-4 col-form-label">Ürün Adı:</label>
        <div class="col-8">
          <input v-model="newProduct.p_name" type="text" class="form-control" required />
        </div>
      </div>
      <div class="row mb-2 align-items-center">
        <label class="col-4 col-form-label">Stok:</label>
        <div class="col-8">
          <input v-model.number="newProduct.p_stock" type="number" class="form-control" min="0" required />
        </div>
      </div>
      <div class="row mb-3 align-items-center">
        <label class="col-4 col-form-label">Fiyat:</label>
        <div class="col-8">
          <input v-model.number="newProduct.p_price" type="number" class="form-control" min="0" step="0.01" required />
        </div>
      </div>
      <div class="row mb-3 align-items-center">
        <label class="col-4 col-form-label">Açıklama:</label>
        <div class="col-8">
          <textarea v-model="newProduct.p_desc" class="form-control" placeholder="ürünü anlatın" required></textarea>
        </div>
      </div>
      <button type="submit" class="btn btn-success w-100">Ürün Ekle</button>
      <p v-if="productMessage" class="node-api__success">{{ productMessage }}</p>
    </form>

    <p v-if="error" class="node-api__error"><b>Hata:</b> {{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Vue + Node.js örneği: gerçek bir Express sunucusundan fetch ile veri çekiyoruz
const baseUrl = 'http://localhost:3001'
const hello = ref(null)
const students = ref([])
const products = ref([])
const error = ref(null)
const newProduct = ref({ p_name: '', p_stock: 0, p_price: 0, p_desc: '' })
const productMessage = ref(null)

async function getHello() {
  error.value = null
  try {
    const res = await fetch(`${baseUrl}/api/hello`)
    if (!res.ok) throw new Error('Hello endpoint hatası')
    hello.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
}

async function getStudents() {
  error.value = null
  try {
    const res = await fetch(`${baseUrl}/api/students`)
    if (!res.ok) throw new Error('Students endpoint hatası')
    students.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
}

async function getProducts() {
  error.value = null
  try {
    const res = await fetch(`${baseUrl}/api/products`)
    if (!res.ok) throw new Error('Products endpoint hatası')
    products.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
}

// POST: yeni ürünü backend'e ekler, başarılıysa listeyi tazeler
async function addProduct() {
  error.value = null
  productMessage.value = null
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct.value),
    })
    if (!res.ok) throw new Error('addProduct endpoint hatası')
    await res.json()
    productMessage.value = 'Ürün başarıyla eklendi.'
    newProduct.value = { p_name: '', p_stock: 0, p_price: 0, p_desc: '' }
    await getProducts()
  } catch (e) {
    error.value = e.message
  }
}

// PUT: satırdaki inputlarla düzenlenen ürünü backend'e günceller
async function updateProduct(p) {
  error.value = null
  productMessage.value = null
  try {
    const res = await fetch(`${baseUrl}/api/products/${p.p_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_name: p.p_name, p_stock: p.p_stock, p_price: p.p_price, p_desc: p.p_desc }),
    })
    if (!res.ok) throw new Error('updateProduct endpoint hatası')
    productMessage.value = 'Ürün güncellendi.'
    await getProducts()
  } catch (e) {
    error.value = e.message
  }
}

// DELETE: ürünü backend'den siler
async function deleteProduct(id) {
  error.value = null
  productMessage.value = null
  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('deleteProduct endpoint hatası')
    productMessage.value = 'Ürün silindi.'
    await getProducts()
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.node-api__buttons {
  margin-bottom: 1rem;
}

.node-api__result {
  text-align: left;
  max-width: 420px;
  margin: 1rem auto 0;
}

.node-api__error {
  color: #dc3545;
}

.node-api__form {
  max-width: 380px;
  margin: 0 auto;
  text-align: left;
}

.node-api__success {
  color: #198754;
  margin-top: 0.5rem;
  margin-bottom: 0;
}
</style>
