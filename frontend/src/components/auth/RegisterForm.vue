<template>
  <!-- Kayıt Formu: Auth sayfasındaki "Kayıt Ol" sekmesi -->
  <form class="auth-form" @submit.prevent="handleSubmit">
    <!-- Kayıt sonucu mesajları -->
    <div v-if="registerError" class="alert alert-danger py-2 mb-3">{{ registerError }}</div>
    <div v-if="registerSuccess" class="alert alert-success py-2 mb-3">
      Kayıt başarılı! Giriş sekmesine yönlendiriliyorsunuz...
    </div>

    <div class="mb-3">
      <label for="register-firstname" class="form-label">Ad</label>
      <!-- Rakam ve özel karakterler yazılırken süzülür -->
      <input
        id="register-firstname"
        :value="firstName"
        @input="onNameInput($event, (v) => (firstName = v))"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': isAdInvalid }"
        placeholder="Ad"
        required
      />
      <div v-if="isAdInvalid" class="invalid-feedback d-block">
        Ad en az 2 harf olmalı, rakam içeremez.
      </div>
    </div>

    <div class="mb-3">
      <label for="register-lastname" class="form-label">Soyad</label>
      <input
        id="register-lastname"
        :value="lastName"
        @input="onNameInput($event, (v) => (lastName = v))"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': isSoyadInvalid }"
        placeholder="Soyad"
        required
      />
      <div v-if="isSoyadInvalid" class="invalid-feedback d-block">
        Soyad en az 2 harf olmalı, rakam içeremez.
      </div>
    </div>

    <div class="mb-3">
      <label for="register-email" class="form-label">Email</label>
      <input
        id="register-email"
        v-model="email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': isEmailInvalid }"
        placeholder="ornek@mail.com"
        required
      />
      <!-- Email formatı uyarısı -->
      <div v-if="isEmailInvalid" class="invalid-feedback d-block">
        Geçerli bir email adresi girin (örn. ornek@mail.com).
      </div>
    </div>

    <div class="mb-3">
      <label for="register-telefon" class="form-label">Telefon</label>
      <input
        id="register-telefon"
        :value="telefon"
        @input="onTelefonInput"
        type="tel"
        inputmode="numeric"
        class="form-control"
        :class="{ 'is-invalid': isTelefonInvalid }"
        placeholder="5xxxxxxxxx"
        required
      />
      <!-- Telefon uzunluğu uyarısı: sadece rakam kabul edilir, harfler otomatik filtrelenir -->
      <div v-if="isTelefonInvalid" class="invalid-feedback d-block">
        Telefon numarası 10-11 haneli olmalıdır.
      </div>
    </div>

    <div class="mb-3">
      <label for="register-password" class="form-label">Şifre</label>
      <input
        id="register-password"
        v-model="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': isPasswordInvalid }"
        placeholder="••••••••"
        required
      />
      <!-- Şifre uzunluğu uyarısı: giriş sayfasındaki kuralla aynı -->
      <div v-if="isPasswordInvalid" class="invalid-feedback d-block">
        Şifre en az 8 karakter olmalıdır.
      </div>
    </div>

    <div class="mb-2">
      <label for="register-confirm-password" class="form-label">Şifreyi Doğrula</label>
      <input
        id="register-confirm-password"
        v-model="confirmPassword"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': passwordsDoNotMatch }"
        placeholder="••••••••"
        required
      />
      <!-- Şifre doğrulama uyarısı -->
      <div v-if="passwordsDoNotMatch" class="invalid-feedback d-block">
        Şifreler eşleşmiyor.
      </div>
    </div>

    <div class="mb-3">
      <label for="register-birthdate" class="form-label">Doğum Tarihi</label>
      <input
        id="register-birthdate"
        v-model="birthdate"
        type="date"
        class="form-control"
        required
      />
    </div>

    <div class="form-check mb-3">
      <input
        id="register-terms"
        v-model="acceptedTerms"
        type="checkbox"
        class="form-check-input"
        required
      />
      <label for="register-terms" class="form-check-label">
        <!-- Metinler sayfadan ayrılmadan, açılır kutuda gösteriliyor -->
        <button type="button" class="auth__link" @click="metniAc('sartlar')">Hizmet Şartları</button> ve
        <button type="button" class="auth__link" @click="metniAc('gizlilik')">Gizlilik Politikası</button>'nı
        kabul ediyorum
      </label>
    </div>

    <!-- Bilgilendirme kutusu: tıklanan metnin özeti -->
    <div v-if="acikMetin" class="bilgi">
      <div class="bilgi__ust">
        <h3 class="bilgi__baslik">{{ metinler[acikMetin].baslik }}</h3>
        <button type="button" class="bilgi__kapat" aria-label="Kapat" @click="acikMetin = ''">
          ✕
        </button>
      </div>
      <ul class="bilgi__liste">
        <li v-for="madde in metinler[acikMetin].maddeler" :key="madde">{{ madde }}</li>
      </ul>
      <p class="bilgi__not">{{ metinler[acikMetin].not }}</p>
    </div>

    <button
      type="submit"
      class="btn btn-primary w-100 auth-form__submit"
      :disabled="isSubmitDisabled"
    >
      Kayıt Ol
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  onPhoneInput,
  passwordsMatch,
  isValidName,
  onNameInput,
} from '../../utils/validators.js'

const baseUrl = 'http://localhost:3001'
const router = useRouter()

// Form alanları
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const telefon = ref('')
const password = ref('')
const confirmPassword = ref('')
const birthdate = ref('')
const acceptedTerms = ref(false)

// Kayıt sonucu mesajları
const registerError = ref('')

// Hizmet Şartları / Gizlilik Politikası kısa bilgilendirme metinleri
const metinler = {
  sartlar: {
    baslik: 'Hizmet Şartları',
    maddeler: [
      'LevelUp hesabı açmak için 13 yaşından büyük olmalısın.',
      'Hesap bilgilerinin güvenliğinden sen sorumlusun; şifreni kimseyle paylaşma.',
      'Satın aldığın dijital oyun anahtarları tek kullanımlıktır, kullanıldıktan sonra iade edilemez.',
      'Siteye ürün ekliyorsan, ürün bilgilerinin doğruluğundan sen sorumlusun.',
      'Kuralları ihlal eden hesaplar uyarı yapılmadan kapatılabilir.',
    ],
    not: 'Bu bir öğrenci projesidir; metin örnek amaçlıdır, hukuki bağlayıcılığı yoktur.',
  },
  gizlilik: {
    baslik: 'Gizlilik Politikası',
    maddeler: [
      'Ad, soyad, e-posta, telefon ve doğum tarihini yalnızca hesabını oluşturmak için saklarız.',
      'Bilgilerin kendi veritabanımızda tutulur, üçüncü kişilerle paylaşılmaz veya satılmaz.',
      'Sepet bilgin yalnızca kendi tarayıcında (localStorage) tutulur.',
      'Oturum bilgin sekmeyi kapattığında silinir.',
      'Hesabının silinmesini istersen iletişim formundan talep edebilirsin.',
    ],
    not: 'Bu bir öğrenci projesidir; gerçek ödeme veya kart bilgisi saklanmaz.',
  },
}

const acikMetin = ref('')

function metniAc(anahtar) {
  // Aynı bağlantıya tekrar tıklanırsa kutu kapanır
  acikMetin.value = acikMetin.value === anahtar ? '' : anahtar
}
const registerSuccess = ref(false)

// Email ve telefon doğrulaması: paylaşılan validators.js modülünden
const isEmailInvalid = computed(() => email.value.length > 0 && !isValidEmail(email.value))

// Telefon alanına yalnızca rakam girilmesine izin verir, harfleri anında filtreler
function onTelefonInput(event) {
  onPhoneInput(event, (filtered) => (telefon.value = filtered))
}
const isTelefonInvalid = computed(() => telefon.value.length > 0 && !isValidPhone(telefon.value))

// Şifre en az 8 karakter mi kontrolü
const isPasswordInvalid = computed(
  () => password.value.length > 0 && !isValidPassword(password.value)
)

// Şifreler eşleşmiyor mu kontrolü
const passwordsDoNotMatch = computed(() => {
  return confirmPassword.value.length > 0 && !passwordsMatch(password.value, confirmPassword.value)
})

// Şifreler eşleşmediğinde, geçersiz alan olduğunda veya şartlar kabul edilmediğinde buton devre dışı
const isAdInvalid = computed(() => firstName.value.length > 0 && !isValidName(firstName.value))
const isSoyadInvalid = computed(() => lastName.value.length > 0 && !isValidName(lastName.value))

const isSubmitDisabled = computed(() => {
  return (
    !isValidName(firstName.value) ||
    !isValidName(lastName.value) ||
    passwordsDoNotMatch.value ||
    isEmailInvalid.value ||
    isTelefonInvalid.value ||
    isPasswordInvalid.value ||
    !password.value ||
    !confirmPassword.value ||
    !telefon.value ||
    !birthdate.value ||
    !acceptedTerms.value ||
    registerSuccess.value
  )
})

// Gönderim öncesi son kontrol: parolalar eşleşiyor mu ve şartlar kabul edildi mi?
function validation() {
  if (
    isValidPassword(password.value) &&
    passwordsMatch(password.value, confirmPassword.value) &&
    acceptedTerms.value
  ) {
    return true
  } else {
    return false
  }
}

// Form gönderimi: kullanıcıyı /api/register ucuna POST eder (veritabanına yazılır)
async function handleSubmit() {
  registerError.value = ''

  if (!validation()) {
    registerError.value = 'Parolalar eşleşmiyor veya şartlar kabul edilmedi.'
    return
  }

  try {
    const res = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        tel: telefon.value,
        pass: password.value,
        birthdate: birthdate.value,
      }),
    })

    if (!res.ok) {
      // Sunucunun mesajını olduğu gibi gösteriyoruz: "Bu e-posta adresiyle
      // zaten bir hesap var." gibi asıl sebep kullanıcıya ulaşsın.
      const cevap = await res.json().catch(() => null)
      throw new Error(cevap?.error || 'Kayıt yapılamadı. Lütfen bilgileri kontrol edin.')
    }

    registerSuccess.value = true
    // Kayıt bitince Giriş Yap sekmesine geçilir
    setTimeout(() => {
      router.push('/giris')
    }, 1200)
  } catch (e) {
    registerError.value = e.message
  }
}
</script>

<style scoped>
.auth-form__submit {
  padding: 0.75rem;
  margin-top: 0.5rem;
}

.auth-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth__link {
  color: var(--turkuaz);
  font-weight: 600;
  text-decoration: none;
  /* Buton olarak duruyor ama bağlantı gibi görünmeli */
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
}

.auth__link:hover {
  text-decoration: underline;
}

/* Bilgilendirme kutusu */
.bilgi {
  background: var(--zemin);
  border: var(--kenar);
  box-shadow: var(--golge);
  padding: var(--bosluk);
  margin-bottom: var(--bosluk);
}

.bilgi__ust {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bosluk-kucuk);
  margin-bottom: var(--bosluk-kucuk);
}

.bilgi__baslik {
  font-size: 11px;
  color: var(--sari);
  margin: 0;
}

.bilgi__kapat {
  background: none;
  border: none;
  color: var(--metin-soluk);
  font-size: 1rem;
  line-height: 1;
  padding: 2px 6px;
  cursor: pointer;
}

.bilgi__kapat:hover {
  color: var(--kirmizi);
}

.bilgi__liste {
  color: var(--metin-soluk);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 var(--bosluk-kucuk);
  padding-left: 1.2rem;
}

.bilgi__not {
  color: var(--turkuaz);
  font-size: 0.8rem;
  margin: 0;
}
</style>
