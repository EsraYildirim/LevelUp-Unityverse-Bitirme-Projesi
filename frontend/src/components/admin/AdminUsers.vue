<template>
  <div class="admin-panel">
    <div class="admin-panel__header">
      <h2 class="admin-panel__title">Kullanıcılar</h2>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#adminAddUserModal"
        @click="resetAddForm"
      >
        Kullanıcı Ekle
      </button>
    </div>

    <p v-if="error" class="admin-panel__error">{{ error }}</p>
    <p v-if="basariMesaji" class="admin-panel__success">{{ basariMesaji }}</p>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Parola</th>
            <th>Doğum Tarihi</th>
            <th>Rol</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, index) in users" :key="u.u_id">
            <th>{{ index + 1 }}</th>
            <td>
              <input
                type="text"
                class="form-control"
                :value="u.u_firstName"
                @input="onNameInput($event, (v) => (u.u_firstName = v))"
              />
            </td>
            <td>
              <input
                type="text"
                class="form-control"
                :value="u.u_lastName"
                @input="onNameInput($event, (v) => (u.u_lastName = v))"
              />
            </td>
            <td><input type="text" class="form-control" v-model="u.u_email" /></td>
            <td><input type="text" class="form-control" v-model="u.u_tel" /></td>
            <td><input type="text" class="form-control" v-model="u.u_pass" /></td>
            <td><input type="date" class="form-control" v-model="u.u_birthdate" /></td>
            <td>
              <!-- 0 = Kullanıcı, 1 = Admin -->
              <Secim v-model="u.u_role" :secenekler="rolSecenekleri" />
            </td>
            <td>
              <button type="button" class="btn btn-sm btn-outline-primary me-1" @click="updateUser(u)">
                Güncelle
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteUser(u.u_id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- .fade-in atasındaki transform, position:fixed modal'ı sayfa dışına
         taşıdığı için Teleport ile doğrudan body'ye render ediyoruz -->
    <Teleport to="body">
      <div class="modal fade" tabindex="-1" id="adminAddUserModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Kullanıcı Ekle</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-body">
              <div class="mb-2">
                <label class="form-label">Ad</label>
                <!-- Rakam ve özel karakterler yazılırken süzülür -->
                <input
                  :value="newUser.firstName"
                  @input="onNameInput($event, (v) => (newUser.firstName = v))"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <label class="form-label">Soyad</label>
                <input
                  :value="newUser.lastName"
                  @input="onNameInput($event, (v) => (newUser.lastName = v))"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <label class="form-label">Email</label>
                <input
                  v-model="newUser.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': isEmailInvalid }"
                />
                <div v-if="isEmailInvalid" class="invalid-feedback d-block">Geçerli bir email girin.</div>
              </div>
              <div class="mb-2">
                <label class="form-label">Telefon</label>
                <input
                  :value="newUser.tel"
                  @input="onTelInput"
                  type="tel"
                  inputmode="numeric"
                  class="form-control"
                  :class="{ 'is-invalid': isTelInvalid }"
                />
                <div v-if="isTelInvalid" class="invalid-feedback d-block">
                  Telefon numarası 10-11 haneli olmalıdır.
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label">Parola</label>
                <input v-model="newUser.pass" type="password" class="form-control" />
              </div>
              <div class="mb-2">
                <label class="form-label">Parola Tekrar</label>
                <input
                  v-model="newUser.repeatPass"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': isPassMismatch }"
                />
                <div v-if="isPassMismatch" class="invalid-feedback d-block">Parolalar eşleşmiyor.</div>
              </div>
              <div class="mb-2">
                <label class="form-label">Doğum Tarihi</label>
                <input v-model="newUser.birthdate" type="date" class="form-control" />
              </div>
              <div class="mb-2">
                <label class="form-label">Rol</label>
                <Secim v-model="newUser.role" :secenekler="rolSecenekleri" />
              </div>
              <p v-if="addMessage" class="admin-panel__success">{{ addMessage }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
              <button type="button" class="btn btn-primary" :disabled="!isFormValid" @click="addUser">
                Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  isValidEmail,
  isValidPhone,
  onPhoneInput,
  passwordsMatch,
  isValidName,
  onNameInput,
} from '../../utils/validators.js'
import { basari, hata } from '../../utils/bildirim.js'
import Secim from '../Secim.vue'

const baseUrl = 'http://localhost:3001'

// 0 = Kullanıcı, 1 = Admin
const rolSecenekleri = [
  { ad: 'Kullanıcı', deger: 0 },
  { ad: 'Admin', deger: 1 },
]
const users = ref([])
const error = ref('')
const addMessage = ref('')
const basariMesaji = ref('')

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  tel: '',
  pass: '',
  repeatPass: '',
  birthdate: '',
  role: 0,
})

// Email ve telefon doğrulaması: paylaşılan validators.js modülünden
const isEmailInvalid = computed(
  () => newUser.value.email.length > 0 && !isValidEmail(newUser.value.email)
)

function onTelInput(event) {
  onPhoneInput(event, (filtered) => (newUser.value.tel = filtered))
}
const isTelInvalid = computed(
  () => newUser.value.tel.length > 0 && !isValidPhone(newUser.value.tel)
)
const isPassMismatch = computed(
  () =>
    newUser.value.repeatPass.length > 0 &&
    !passwordsMatch(newUser.value.pass, newUser.value.repeatPass)
)

const isFormValid = computed(() => {
  return (
    isValidName(newUser.value.firstName) &&
    isValidName(newUser.value.lastName) &&
    newUser.value.email &&
    !isEmailInvalid.value &&
    newUser.value.tel &&
    !isTelInvalid.value &&
    newUser.value.pass &&
    passwordsMatch(newUser.value.pass, newUser.value.repeatPass)
  )
})

async function getUsers() {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users`)
    if (!res.ok) throw new Error('Kullanıcılar alınamadı.')
    users.value = await res.json()
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

async function updateUser(u) {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users/${u.u_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: u.u_firstName,
        lastName: u.u_lastName,
        email: u.u_email,
        tel: u.u_tel,
        pass: u.u_pass,
        birthdate: u.u_birthdate,
        role: u.u_role,
      }),
    })
    if (!res.ok) {
      // E-posta çakışması gibi asıl sebebi sunucu yazıyor
      const cevap = await res.json().catch(() => null)
      throw new Error(cevap?.error || 'Kullanıcı güncellenemedi.')
    }
    basariMesaji.value = await res.json()
    await getUsers()
    basari(`${u.u_firstName} ${u.u_lastName} güncellendi.`)
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

async function deleteUser(id) {
  if (!confirm('Bu kullanıcı silinsin mi? Bu işlem geri alınamaz.')) return
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Kullanıcı silinemedi.')
    await getUsers()
    basari('Kullanıcı silindi.')
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

function resetAddForm() {
  addMessage.value = ''
  newUser.value = {
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    pass: '',
    repeatPass: '',
    birthdate: '',
    role: 0,
  }
}

async function addUser() {
  addMessage.value = ''
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: newUser.value.firstName,
        lastName: newUser.value.lastName,
        email: newUser.value.email,
        tel: newUser.value.tel,
        pass: newUser.value.pass,
        birthdate: newUser.value.birthdate,
        role: newUser.value.role,
      }),
    })
    if (!res.ok) {
      // E-posta çakışması gibi asıl sebebi sunucu yazıyor
      const cevap = await res.json().catch(() => null)
      throw new Error(cevap?.error || 'Kullanıcı eklenemedi.')
    }
    addMessage.value = await res.json() // "... adlı kullanıcı eklendi."
    basari(addMessage.value)
    await getUsers()
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

onMounted(() => {
  getUsers()
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

.admin-panel__error {
  color: #dc3545;
}

.admin-panel__success {
  color: #198754;
}

/* Tablo küçük ekranlarda yatay kaydırılabilir olsun, input'lar sıkışıp
   okunamaz hale gelmesin diye minimum genişlik veriyoruz */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.admin-panel table input.form-control {
  min-width: 110px;
}

.admin-panel table select.form-select {
  min-width: 130px;
}

@media (max-width: 576px) {
  .admin-panel__header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}
</style>
