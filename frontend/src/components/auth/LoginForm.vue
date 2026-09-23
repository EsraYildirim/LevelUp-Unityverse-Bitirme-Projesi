<template>
  <!-- Giriş Formu: Auth sayfasındaki "Giriş Yap" sekmesi -->
  <form class="auth-form" @submit.prevent="handleSubmit">
    <!-- Giriş sonucu mesajları -->
    <div v-if="loginError" class="alert alert-danger py-2 mb-3">{{ loginError }}</div>
    <div v-if="loginSuccess" class="alert alert-success py-2 mb-3">
      Hoş geldin {{ loginSuccess }}! Paneline yönlendiriliyorsun...
    </div>

    <div class="mb-3">
      <label for="login-email" class="form-label">Email</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': isEmailInvalid }"
        placeholder="ornek@mail.com"
        required
      />
      <div v-if="isEmailInvalid" class="invalid-feedback d-block">
        Geçerli bir email adresi girin.
      </div>
    </div>

    <div class="mb-3">
      <label for="login-password" class="form-label">Şifre</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': isPasswordInvalid }"
        placeholder="••••••••"
        required
      />
      <div v-if="isPasswordInvalid" class="invalid-feedback d-block">
        Şifre en az 8 karakter olmalıdır.
      </div>
    </div>

    <div class="form-check mb-2">
      <input
        id="login-robot"
        v-model="notRobot"
        type="checkbox"
        class="form-check-input"
        required
      />
      <label for="login-robot" class="form-check-label">Gerçekten robot değilim</label>
    </div>

    <div class="auth-form__row mb-3">
      <div class="form-check">
        <input
          id="login-remember"
          v-model="rememberMe"
          type="checkbox"
          class="form-check-input"
        />
        <label for="login-remember" class="form-check-label">Beni Hatırla</label>
      </div>
      <a href="#" class="auth-form__forgot">Şifrenizi mi Unuttunuz?</a>
    </div>

    <button
      type="submit"
      class="btn btn-primary w-100 auth-form__submit"
      :disabled="loginSuccess !== ''"
    >
      Giriş Yap
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isValidEmail, isValidPassword } from '../../utils/validators.js'
import { girisYap, panelYolu } from '../../utils/oturum.js'

const baseUrl = 'http://localhost:3001'
const router = useRouter()

// Form alanları
const email = ref('')
const password = ref('')
const notRobot = ref(false)
const rememberMe = ref(false)

// Giriş sonucu mesajları
const loginError = ref('')
const loginSuccess = ref('') // giriş yapan kullanıcının adı

// Email ve şifre doğrulaması: paylaşılan validators.js modülünden
const isEmailInvalid = computed(() => email.value.length > 0 && !isValidEmail(email.value))
const isPasswordInvalid = computed(
  () => password.value.length > 0 && !isValidPassword(password.value)
)

// Gönderim öncesi son kontrol: email/şifre biçimi doğru mu ve robot kutusu işaretli mi?
function loginValidation() {
  if (isValidEmail(email.value) && isValidPassword(password.value)) {
    if (notRobot.value) return true
    else return false
  }
  return false
}

// Form gönderimi: email + şifreyi /api/login ucuna POST eder, veritabanında eşleşme aranır
async function handleSubmit() {
  loginError.value = ''

  if (!loginValidation()) {
    loginError.value = 'Bilgileri kontrol edin ve robot olmadığınızı onaylayın.'
    return
  }

  try {
    const res = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        pass: password.value,
      }),
    })

    // 404 → "Giriş Başarısız" (email/şifre eşleşmedi)
    if (!res.ok) throw new Error('Email veya şifre hatalı.')

    // Backend eşleşen kullanıcıyı dizi olarak döner: [{ u_id, u_role, u_firstName }]
    const data = await res.json()
    const user = data[0]

    // Oturumu aç: id ve rol sessionStorage'a yazılır
    girisYap(user)

    if (rememberMe.value) {
      localStorage.setItem('levelup_current_user', JSON.stringify(user))
    }

    loginSuccess.value = user.u_firstName
    email.value = ''
    password.value = ''
    notRobot.value = false

    // Rolüne göre yönlendir: admin → yönetim paneli, kullanıcı → hesabım
    setTimeout(() => {
      router.push(panelYolu())
    }, 1200)
  } catch (e) {
    loginError.value = e.message
  }
}
</script>

<style scoped>
.auth-form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.auth-form__forgot {
  color: var(--turkuaz);
  font-size: 0.9rem;
  text-decoration: none;
}

.auth-form__forgot:hover {
  text-decoration: underline;
}

.auth-form__submit {
  padding: 0.75rem;
  margin-top: 0.5rem;
}
</style>
