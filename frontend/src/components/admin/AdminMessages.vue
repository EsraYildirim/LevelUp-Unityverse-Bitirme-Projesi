<template>
  <div class="admin-panel">
    <div class="admin-panel__header">
      <h2 class="admin-panel__title">Mesajlar</h2>
    </div>

    <p v-if="error" class="admin-panel__error">{{ error }}</p>
    <p v-if="basariMesaji" class="admin-panel__success">{{ basariMesaji }}</p>
    <p v-if="!messages.length && !error" class="text-muted">Henüz gelen mesaj yok.</p>

    <div v-else class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Ad</th>
            <th scope="col">Soyad</th>
            <th scope="col">Email</th>
            <th scope="col">Telefon</th>
            <th scope="col">Konu</th>
            <th scope="col">Mesaj</th>
            <th scope="col">Tarihi</th>
            <th scope="col">Durumu</th>
            <th scope="col">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in messages" :key="message.m_id">
            <th>{{ message.m_id }}</th>
            <td>{{ message.m_firstName }}</td>
            <td>{{ message.m_lastName }}</td>
            <td>{{ message.m_email }}</td>
            <td>{{ message.m_code }} {{ message.m_phone }}</td>
            <td>{{ message.m_subject }}</td>
            <td>{{ message.m_message }}</td>
            <td>{{ tarihYaz(message.m_created_at) }}</td>
            <td>
              <!-- Yanıtlanmamış mesaj kırmızı, yanıtlanmış turkuaz görünsün -->
              <Secim
                v-model="message.m_status"
                :secenekler="durumlar"
                :class="message.m_status === 0 ? 'durum--bekliyor' : 'durum--yanitlandi'"
              />
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-1"
                @click="updateMessage(message.m_id, message.m_status)"
              >
                Güncelle
              </button>
              <a :href="`mailto:${message.m_email}`" class="btn btn-sm btn-outline-success me-1">
                Yanıtla
              </a>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="deleteMessage(message.m_id)"
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
import { tarihYaz } from '../../utils/tarih.js'

const baseUrl = 'http://localhost:3001'
const messages = ref([])
const durumlar = [
  { ad: 'Yanıtlanmadı', deger: 0 },
  { ad: 'Yanıtlandı', deger: 1 },
]

const error = ref('')
const basariMesaji = ref('')

async function getMessages() {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/messages`)
    if (!res.ok) throw new Error('Mesajlar alınamadı.')
    messages.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
}

// Sadece yanıt durumunu (m_status) günceller
async function updateMessage(m_id, m_status) {
  error.value = ''
  basariMesaji.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/messages/${m_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ m_status }),
    })
    if (!res.ok) throw new Error('Mesaj durumu güncellenemedi.')
    basariMesaji.value = 'Mesaj durumu güncellendi.'
    await getMessages()
    basari('Mesaj durumu güncellendi.')
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

async function deleteMessage(m_id) {
  if (!confirm('Bu mesaj silinsin mi? Bu işlem geri alınamaz.')) return
  error.value = ''
  basariMesaji.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/messages/${m_id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Mesaj silinemedi.')
    await getMessages() // silme işleminden sonra tekrar verileri çek
    basari('Mesaj silindi.')
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

onMounted(() => {
  getMessages()
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

/* Bileşenin içindeki butonu boyamak için :deep gerekiyor */
.durum--bekliyor :deep(.secim__buton) {
  color: var(--kirmizi);
}

.durum--yanitlandi :deep(.secim__buton) {
  color: var(--turkuaz);
}

.admin-panel__error {
  color: #dc3545;
}

.admin-panel__success {
  color: #198754;
}

/* Tablo küçük ekranlarda yatay kaydırılabilir olsun; mesaj metni de çok
   uzunsa satır içinde sarılsın diye genişlik sınırı veriyoruz */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.admin-panel table td:last-of-type {
  white-space: nowrap;
}

.admin-panel table select.form-select {
  min-width: 150px;
  font-weight: 600;
}

@media (max-width: 576px) {
  .admin-panel__header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}
</style>
