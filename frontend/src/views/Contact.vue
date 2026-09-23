<template>
  <div class="contact">
    <header class="page-header fade-in">
      <h1 class="page-header__title">İletişim</h1>
      <p class="page-header__subtitle">Bize mesaj gönderin, en kısa sürede size dönüş yapalım.</p>
    </header>

    <div class="container">
      <div class="row g-4 justify-content-center contact__duzen">
        <!-- Sol sütun: iletişim bilgileri ve harita -->
        <div class="col-12 col-lg-5 fade-in">
          <div class="contact__card contact__card--bilgi">
            <h2 class="contact__baslik">Bize Ulaşın</h2>

            <ul class="contact__liste">
              <li v-for="bilgi in iletisimBilgileri" :key="bilgi.baslik" class="contact__satir">
                <span class="contact__ikon" aria-hidden="true">{{ bilgi.ikon }}</span>
                <div>
                  <h3 class="contact__satir-baslik">{{ bilgi.baslik }}</h3>
                  <!-- Telefon ve e-posta tıklanabilir olsun, adres düz metin -->
                  <a v-if="bilgi.link" :href="bilgi.link" class="contact__deger">{{ bilgi.deger }}</a>
                  <p v-else class="contact__deger">{{ bilgi.deger }}</p>
                  <small v-if="bilgi.not" class="contact__not">{{ bilgi.not }}</small>
                </div>
              </li>
            </ul>

            <h3 class="contact__harita-baslik">Ofisimiz</h3>
            <!-- Piksel çerçeve sarmalayıcıda; iframe kenarlıksız olarak kutuyu
                 tam doldurur, böylece kenarda boşluk şeridi kalmaz. -->
            <div ref="haritaKutusu" class="contact__harita-kutu">
              <!-- OpenStreetMap gömülü harita: API anahtarı gerektirmez -->
              <iframe
                class="contact__harita"
                :src="haritaAdresi"
                title="LevelUp ofisinin haritadaki konumu"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a class="contact__harita-link" :href="haritaBuyukAdres" target="_blank" rel="noopener">
              Haritada aç →
            </a>
          </div>
        </div>

        <!-- Sağ sütun: mesaj formu -->
        <div class="col-12 col-lg-7 fade-in">
          <div class="contact__card">
            <h2 class="contact__baslik">Mesaj Gönderin</h2>
            <form @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show py-2 mb-3">
            {{ errorMessage }}
            <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Kapat"></button>
          </div>
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show py-2 mb-3">
            {{ successMessage }}
            <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Kapat"></button>
          </div>

          <div class="row">
            <div class="col-12 col-sm-6 mb-3">
              <label class="form-label">Ad*</label>
              <!-- Rakam ve özel karakterler yazılırken süzülür -->
              <input
                :value="form.firstName"
                @input="onNameInput($event, (v) => (form.firstName = v))"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="col-12 col-sm-6 mb-3">
              <label class="form-label">Soyad*</label>
              <input
                :value="form.lastName"
                @input="onNameInput($event, (v) => (form.lastName = v))"
                type="text"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Email*</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': isEmailInvalid }"
              placeholder="example@hotmail.com"
              required
            />
            <div v-if="isEmailInvalid" class="invalid-feedback d-block">
              Geçerli bir email adresi girin (örn. ornek@mail.com).
            </div>
          </div>

          <div class="row">
            <div class="col-5 col-sm-4 mb-3">
              <label class="form-label">Ülke</label>
              <!-- Ödeme sayfasıyla aynı ülke listesi (utils/teslimat.js) -->
              <Secim v-model="form.code" :secenekler="ulkeKodlari" />
            </div>
            <div class="col-7 col-sm-8 mb-3">
              <label class="form-label">Telefon*</label>
              <input
                :value="form.tel"
                @input="onTelInput"
                type="tel"
                inputmode="numeric"
                class="form-control"
                :class="{ 'is-invalid': isTelInvalid }"
                required
              />
              <div v-if="isTelInvalid" class="invalid-feedback d-block">
                Telefon numarası 10-11 haneli olmalıdır.
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Konu*</label>
            <Secim v-model="form.subject" :secenekler="konular" placeholder="Seçiniz" />
          </div>

          <div class="mb-3">
            <label class="form-label">Mesaj*</label>
            <textarea v-model="form.message" class="form-control" rows="4" required></textarea>
          </div>

          <div class="form-check mb-3">
            <input id="contact-check" v-model="form.check" type="checkbox" class="form-check-input" required />
            <label for="contact-check" class="form-check-label">
              Bilgilerimin doğruluğunu onaylıyorum.
            </label>
          </div>

              <button type="submit" class="btn btn-primary w-100 contact__submit" :disabled="!isFormValid">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isValidEmail, isValidPhone, onPhoneInput, isValidName, onNameInput } from '../utils/validators.js'
import { ULKELER } from '../utils/teslimat.js'
import { ILETISIM_LISTESI } from '../utils/iletisim.js'
import Secim from '../components/Secim.vue'

const baseUrl = 'http://localhost:3001'

// Telefon alan kodları ödeme sayfasıyla aynı listeden gelir: "Türkiye (+90)"
const ulkeKodlari = ULKELER.map((u) => ({ ad: `${u.ad} (${u.telKodu})`, deger: u.telKodu }))

const konular = ['Genel', 'Şikayet', 'Öneri', 'Teşekkür']

// Ofis konumu: Teknopark İstanbul (Pendik). Koordinatlar hem haritada
// hem de "Haritada aç" bağlantısında kullanılıyor.
const ENLEM = 40.9188
const BOYLAM = 29.3117

// Haritada gösterilecek yatay alan (metre). Yükseklik, kutunun en-boy
// oranından hesaplanır; böylece harita çerçeveyi her genişlikte tam doldurur
// ve kenarda boş (koyu) şerit kalmaz.
const GORUNEN_GENISLIK_METRE = 900
const METRE_PER_DERECE_ENLEM = 110540
const metrePerDereceBoylam = 111320 * Math.cos((ENLEM * Math.PI) / 180)

const haritaKutusu = ref(null)
// Kutu ölçülemezse makul bir varsayılan oran kullanılır
const haritaOrani = ref(220 / 365)

// OpenStreetMap gömme adresi API anahtarı istemez; bbox harita çerçevesini,
// marker ise iğnenin yerini belirler.
const haritaAdresi = computed(() => {
  const boylamAcikligi = GORUNEN_GENISLIK_METRE / metrePerDereceBoylam
  const enlemAcikligi =
    (GORUNEN_GENISLIK_METRE * haritaOrani.value) / METRE_PER_DERECE_ENLEM
  const kutu = [
    BOYLAM - boylamAcikligi / 2,
    ENLEM - enlemAcikligi / 2,
    BOYLAM + boylamAcikligi / 2,
    ENLEM + enlemAcikligi / 2,
  ]
    .map((n) => n.toFixed(6))
    .join('%2C')
  return (
    'https://www.openstreetmap.org/export/embed.html' +
    `?bbox=${kutu}&layer=mapnik&marker=${ENLEM}%2C${BOYLAM}`
  )
})

// Kutu boyutu değişince oranı güncelle. src değişimi haritayı yeniden
// yüklediği için sadece gözle görülür değişimde (>%2) tetikliyoruz.
let olcer = null
onMounted(() => {
  if (!haritaKutusu.value || typeof ResizeObserver === 'undefined') return
  olcer = new ResizeObserver(([kayit]) => {
    const { width, height } = kayit.contentRect
    if (!width || !height) return
    const yeniOran = height / width
    if (Math.abs(yeniOran - haritaOrani.value) / haritaOrani.value > 0.02) {
      haritaOrani.value = yeniOran
    }
  })
  olcer.observe(haritaKutusu.value)
})

onUnmounted(() => olcer?.disconnect())

const haritaBuyukAdres = `https://www.openstreetmap.org/?mlat=${ENLEM}&mlon=${BOYLAM}#map=16/${ENLEM}/${BOYLAM}`

// Örnek iletişim bilgileri. E-posta adresleri ".example" uzantılı:
// bu uzantı belgelerde kullanılmak üzere ayrılmıştır, gerçek bir adrese gitmez.
const iletisimBilgileri = ILETISIM_LISTESI

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  code: '+90',
  tel: '',
  subject: '',
  message: '',
  check: false,
})

const errorMessage = ref('')
const successMessage = ref('')

// Email ve telefon doğrulaması: paylaşılan validators.js modülünden
const isEmailInvalid = computed(() => form.value.email.length > 0 && !isValidEmail(form.value.email))
const isTelInvalid = computed(() => form.value.tel.length > 0 && !isValidPhone(form.value.tel))

function onTelInput(event) {
  onPhoneInput(event, (filtered) => (form.value.tel = filtered))
}

const isFormValid = computed(() => {
  return (
    isValidName(form.value.firstName) &&
    isValidName(form.value.lastName) &&
    form.value.email &&
    !isEmailInvalid.value &&
    form.value.tel &&
    !isTelInvalid.value &&
    form.value.subject &&
    form.value.message &&
    form.value.check
  )
})

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error('Mesaj gönderilemedi.')

    successMessage.value = 'Mesajınız başarıyla gönderildi.'
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      code: '+90',
      tel: '',
      subject: '',
      message: '',
      check: false,
    }
  } catch (e) {
    errorMessage.value = e.message
  }
}
</script>

<style scoped>
.contact__duzen {
  margin-bottom: 3rem;
}

.contact__card {
  background: var(--panel);
  border: var(--kenar);
  padding: 2.5rem;
  height: 100%;
  box-shadow: var(--golge);
}

.contact__baslik {
  font-size: 14px;
  color: var(--sari);
  margin-bottom: var(--bosluk-buyuk);
}

/* ===== İletişim bilgileri ===== */
.contact__liste {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--bosluk-buyuk);
}

.contact__satir {
  display: flex;
  gap: var(--bosluk);
  padding: var(--bosluk) 0;
  border-bottom: 2px solid var(--zemin);
}

.contact__satir:last-child {
  border-bottom: none;
}

.contact__ikon {
  flex-shrink: 0;
  font-size: 22px;
  line-height: 1.2;
}

.contact__satir-baslik {
  font-family: var(--font-baslik);
  font-size: 9px;
  color: var(--turkuaz);
  margin: 0 0 6px;
}

.contact__deger {
  display: block;
  color: var(--metin);
  margin: 0;
  /* Uzun adres satırı kutuyu taşırmasın */
  overflow-wrap: anywhere;
}

a.contact__deger:hover {
  color: var(--sari);
}

.contact__not {
  display: block;
  margin-top: 4px;
  color: var(--metin-soluk);
  font-size: 13px;
}

/* ===== Harita ===== */
.contact__harita-baslik {
  font-family: var(--font-baslik);
  font-size: 9px;
  color: var(--turkuaz);
  margin-bottom: var(--bosluk-kucuk);
}

/* Çerçeve ve arka plan sarmalayıcıda durur. Arka plan koyu değil, OSM'in
   kara rengine yakın açık bir ton: harita yüklenene kadar (veya bir kenarda
   birkaç piksel açık kalırsa) siyah bir şerit gibi görünmez. */
.contact__harita-kutu {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  border: var(--kenar);
  background-color: #e8e0d8;
}

.contact__harita {
  display: block;
  /* Kutuyu piksel piksel doldur: kenarda boşluk kalmasın */
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.contact__harita-link {
  display: inline-block;
  margin-top: var(--bosluk-kucuk);
  font-family: var(--font-baslik);
  font-size: 9px;
  color: var(--turkuaz);
}

.contact__harita-link:hover {
  color: var(--sari);
}

.contact__submit {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  padding: 0.65rem;
  margin-top: 0.5rem;
}

.contact__submit:hover {
  filter: brightness(1.1);
}
</style>
