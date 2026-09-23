<template>
  <div class="checkout">
    <header class="page-header fade-in">
      <h1 class="page-header__title">Ödeme Sayfası</h1>
      <p class="page-header__subtitle">Sepetini kontrol et ve siparişini tamamla.</p>
    </header>

    <div class="container fade-in">
      <!-- g-5'in negatif kenar boşluğu (-24px) container dolgusundan (12px) büyük;
           576px altında sayfayı yatay kaydırıyordu. Küçük ekranda g-4 kullanılıyor. -->
      <div class="row g-4 g-sm-5">
        <!-- Sepet Kısmı -->
        <div class="col-12 col-md-5 col-lg-4 order-md-last">
          <h4 class="checkout__cart-title">
            <span>Sepet</span>
            <span class="text-body-secondary">{{ sepet.length }} ürün mevcut</span>
          </h4>

          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between checkout__cart-head">
              <span>Ürün</span>
              <span>Tutar(₺)</span>
            </li>

            <li v-for="item in sepet" :key="item.id" class="list-group-item checkout__satir">
              <!-- Her zaman ürünün kendi görseli; ikon kullanılmaz -->
              <img
                class="checkout__gorsel"
                :src="urunGorseli(item)"
                :alt="item.name"
                loading="lazy"
              />

              <div class="checkout__bilgi">
                <h6 class="checkout__ad">{{ item.name }}</h6>
                <small class="text-body-secondary">{{ fiyatYaz(item.price) }} / adet</small>

                <!-- Adet artır / azalt -->
                <div class="checkout__adet">
                  <button
                    type="button"
                    class="checkout__adet-btn"
                    :disabled="item.quantity <= 1"
                    :aria-label="`${item.name} adedini azalt`"
                    @click="adetAzalt(item)"
                  >
                    −
                  </button>
                  <span class="checkout__adet-sayi" aria-live="polite">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="checkout__adet-btn"
                    :disabled="item.quantity >= stokSiniri(item)"
                    :aria-label="`${item.name} adedini artır`"
                    @click="adetArtir(item)"
                  >
                    +
                  </button>
                </div>
                <small v-if="item.quantity >= stokSiniri(item)" class="checkout__stok-uyari">
                  Stoktaki son {{ stokSiniri(item) }} adet.
                </small>
              </div>

              <div class="checkout__sag">
                <span class="checkout__tutar">{{ fiyatYaz(item.price * item.quantity) }}</span>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger checkout__sil"
                  title="Ürünü sepetten çıkar"
                  aria-label="Ürünü sepetten çıkar"
                  @click="urunuCikar(item.id)"
                >
                  <!-- Emoji yerine SVG: her işletim sisteminde aynı ve net görünür -->
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                  Sil
                </button>
              </div>
            </li>

            <li v-if="!sepet.length" class="list-group-item text-center text-muted">
              Sepetiniz boş.
            </li>

            <template v-else>
              <li class="list-group-item d-flex justify-content-between">
                <span>Ara Toplam:</span>
                <span>{{ fiyatYaz(araToplam) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>KDV Tutar:</span>
                <span>{{ fiyatYaz(kdvTutar) }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <strong>Toplam Tutar:</strong>
                <strong>{{ fiyatYaz(toplamTutar) }}</strong>
              </li>
            </template>
          </ul>
        </div>

        <!-- Form Kısmı -->
        <div class="col-12 col-md-7 col-lg-8">
          <h4 class="mb-3">Sipariş Bilgileri</h4>

          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
            {{ successMessage }}
            <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Kapat"></button>
          </div>
          <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
            {{ errorMessage }}
            <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Kapat"></button>
          </div>

          <form class="checkout__form" @submit.prevent="checkOut">
            <div class="row g-3">
              <div class="col-sm-12">
                <label for="checkout-tc" class="form-label">T.C. Kimlik No*</label>
                <input
                  id="checkout-tc"
                  :value="order.tc"
                  @input="onTcInput"
                  type="text"
                  inputmode="numeric"
                  class="form-control"
                  :class="{ 'is-invalid': isTcInvalid }"
                  required
                />
                <div v-if="isTcInvalid" class="invalid-feedback d-block">
                  T.C. Kimlik No 11 haneli olmalıdır.
                </div>
              </div>

              <div class="col-sm-6">
                <label for="checkout-firstname" class="form-label">Ad*</label>
                <!-- Rakam ve özel karakterler yazılırken süzülür -->
                <input
                  id="checkout-firstname"
                  :value="order.firstName"
                  @input="onNameInput($event, (v) => (order.firstName = v))"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': isAdInvalid }"
                  required
                />
                <div v-if="isAdInvalid" class="invalid-feedback d-block">
                  Ad en az 2 harf olmalıdır.
                </div>
              </div>

              <div class="col-sm-6">
                <label for="checkout-lastname" class="form-label">Soyad*</label>
                <input
                  id="checkout-lastname"
                  :value="order.lastName"
                  @input="onNameInput($event, (v) => (order.lastName = v))"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': isSoyadInvalid }"
                  required
                />
                <div v-if="isSoyadInvalid" class="invalid-feedback d-block">
                  Soyad en az 2 harf olmalıdır.
                </div>
              </div>

              <div class="col-12">
                <label for="checkout-email" class="form-label">Email*</label>
                <input
                  id="checkout-email"
                  v-model="order.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': isEmailInvalid }"
                  placeholder="ornek@example.com"
                  required
                />
                <div v-if="isEmailInvalid" class="invalid-feedback d-block">
                  Geçerli bir email adresi girin.
                </div>
              </div>

              <div class="col-12">
                <label for="checkout-phone" class="form-label">Telefon*</label>
                <!-- Alan kodu seçili ülkeden gelir; kullanıcı sadece numarayı yazar -->
                <div class="input-group">
                  <span class="input-group-text checkout__tel-kodu">{{ seciliUlke.telKodu }}</span>
                  <input
                    id="checkout-phone"
                    :value="order.phone"
                    @input="onPhoneFieldInput"
                    type="tel"
                    inputmode="numeric"
                    class="form-control"
                    :class="{ 'is-invalid': isPhoneInvalid }"
                    :placeholder="telOrnegi"
                    required
                  />
                </div>
                <div v-if="isPhoneInvalid" class="invalid-feedback d-block">
                  {{ seciliUlke.ad }} için telefon numarası {{ telHaneMetni }} haneli olmalıdır.
                </div>
              </div>

              <div class="col-12">
                <label for="checkout-address" class="form-label">Adres*</label>
                <textarea
                  id="checkout-address"
                  v-model="order.address"
                  class="form-control"
                  rows="3"
                  placeholder="Mahalle, sokak, apartman bilgileri"
                  required
                ></textarea>
              </div>

              <div class="col-12 col-md-4">
                <label for="checkout-country" class="form-label">Ülke*</label>
                <Secim id="checkout-country" v-model="order.country" :secenekler="ulkeSecenekleri" />
              </div>

              <div class="col-12 col-md-5">
                <label for="checkout-state" class="form-label">Şehir*</label>
                <!-- Şehir listesi seçili ülkeye göre değişir -->
                <Secim id="checkout-state" v-model="order.state" :secenekler="sehirler" placeholder="Seçiniz" />
              </div>

              <div class="col-12 col-md-3">
                <label for="checkout-zip" class="form-label">Posta Kodu*</label>
                <input
                  id="checkout-zip"
                  :value="order.zip"
                  @input="onZipInput"
                  type="text"
                  inputmode="numeric"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <hr class="my-4" />

            <div class="form-check">
              <input id="checkout-same-address" v-model="sameAddress" type="checkbox" class="form-check-input" />
              <label for="checkout-same-address" class="form-check-label">
                Sipariş adresim ile fatura adresim aynı
              </label>
            </div>
            <div class="form-check">
              <input id="checkout-save-info" v-model="saveInfo" type="checkbox" class="form-check-input" />
              <label for="checkout-save-info" class="form-check-label">
                Bilgilerimi sonraki siparişlerim için kaydet
              </label>
            </div>

            <hr class="my-4" />

            <!-- Kart Bilgileri -->
            <h4 class="mb-3">Ödeme Bilgileri</h4>
            <div class="row gy-3">
              <div class="col-md-6">
                <label for="checkout-cardname" class="form-label">Kart Sahibi*</label>
                <input
                  id="checkout-cardname"
                  :value="payment.name"
                  @input="onNameInput($event, (v) => (payment.name = v))"
                  type="text"
                  class="form-control"
                  required
                />
                <small class="text-body-secondary">Kartın üzerindeki ismi eksiksiz girin.</small>
              </div>

              <div class="col-md-6">
                <label for="checkout-cardnumber" class="form-label">Kart Numarası*</label>
                <input
                  id="checkout-cardnumber"
                  :value="payment.number"
                  @input="onCardNumberInput"
                  type="text"
                  inputmode="numeric"
                  class="form-control"
                  :class="{ 'is-invalid': isCardInvalid }"
                  required
                />
                <div v-if="isCardInvalid" class="invalid-feedback d-block">
                  Kart numarası 16 haneli olmalıdır.
                </div>
              </div>

              <div class="col-6 col-md-4">
                <label for="checkout-expiry" class="form-label">Son Kullanma Tarihi*</label>
                <!-- Kartın üzerindeki gibi AA/YY: yazarken "/" otomatik eklenir -->
                <input
                  id="checkout-expiry"
                  :value="payment.expiration"
                  @input="onExpiryInput"
                  type="text"
                  inputmode="numeric"
                  maxlength="5"
                  placeholder="AA/YY"
                  class="form-control"
                  :class="{ 'is-invalid': isExpiryInvalid }"
                  required
                />
                <div v-if="isExpiryInvalid" class="invalid-feedback d-block">
                  AA/YY biçiminde ve geçerli bir tarih girin (örn. 02/31).
                </div>
              </div>

              <div class="col-6 col-md-3">
                <label for="checkout-cvv" class="form-label">CVV*</label>
                <input
                  id="checkout-cvv"
                  :value="payment.cvv"
                  @input="onCvvInput"
                  type="text"
                  inputmode="numeric"
                  class="form-control"
                  :class="{ 'is-invalid': isCvvInvalid }"
                  required
                />
                <div v-if="isCvvInvalid" class="invalid-feedback d-block">
                  CVV 3 haneli olmalıdır.
                </div>
              </div>
            </div>

            <hr class="my-4" />

            <button type="submit" class="w-100 btn btn-primary btn-lg checkout__submit" :disabled="!isFormValid">
              Siparişi Tamamla
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import { ULKELER, ulkeyiBul } from '../utils/teslimat.js'
import Secim from '../components/Secim.vue'
import { paraYaz as fiyatYaz } from '../utils/para.js'
import {
  isValidEmail,
  isValidPhoneRange,
  isValidTC,
  isValidCardNumber,
  isValidCvv,
  onDigitsInput,
  onPhoneInput,
  isValidExpiry,
  formatExpiry,
  isValidName,
  onNameInput,
} from '../utils/validators.js'

const baseUrl = 'http://localhost:3001'
const KDV_ORANI = 0.2

// Sepet App.vue'dan inject ile gelir
const sepet = inject('sepet')

const order = ref({
  tc: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  country: 'Türkiye',
  state: '',
  zip: '',
})

const payment = ref({ name: '', number: '', expiration: '', cvv: '' })

// Teslimat seçenekleri: ülke, şehir ve telefon kodu tek kaynaktan (teslimat.js)
const ulkeSecenekleri = ULKELER.map((u) => ({ ad: u.ad, deger: u.ad }))
const seciliUlke = computed(() => ulkeyiBul(order.value.country))
const sehirler = computed(() => seciliUlke.value.sehirler)

// Ülke değişince eski şehir artık listede olmayabilir; seçimi sıfırlıyoruz
watch(
  () => order.value.country,
  () => {
    order.value.state = ''
  }
)

// "10" ya da "10-11" gibi okunur bir hane bilgisi
const telHaneMetni = computed(() => {
  const [enAz, enCok] = seciliUlke.value.telHane
  return enAz === enCok ? String(enAz) : `${enAz}-${enCok}`
})

// Placeholder: beklenen hane kadar 5 ile dolu örnek (örn. 5xxxxxxxxx)
const telOrnegi = computed(() => 'x'.repeat(seciliUlke.value.telHane[0]))

const sameAddress = ref(false)
const saveInfo = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

// Tutarlar: ara toplam, KDV ve KDV dahil toplam
const araToplam = computed(() =>
  sepet.reduce((toplam, item) => toplam + item.price * item.quantity, 0)
)
const kdvTutar = computed(() => Math.round(araToplam.value * KDV_ORANI * 100) / 100)
const toplamTutar = computed(() => Math.round((araToplam.value + kdvTutar.value) * 100) / 100)

// Doğrulamalar: paylaşılan validators.js modülünden
const isAdInvalid = computed(
  () => order.value.firstName.length > 0 && !isValidName(order.value.firstName)
)
const isSoyadInvalid = computed(
  () => order.value.lastName.length > 0 && !isValidName(order.value.lastName)
)
const isTcInvalid = computed(() => order.value.tc.length > 0 && !isValidTC(order.value.tc))
const isEmailInvalid = computed(
  () => order.value.email.length > 0 && !isValidEmail(order.value.email)
)
// Telefon uzunluğu ülkeye göre değişir (TR 10, Hollanda 9, Almanya 10-11 ...)
const telefonGecerli = computed(() =>
  isValidPhoneRange(order.value.phone, ...seciliUlke.value.telHane)
)
const isPhoneInvalid = computed(() => order.value.phone.length > 0 && !telefonGecerli.value)
const isCardInvalid = computed(
  () => payment.value.number.length > 0 && !isValidCardNumber(payment.value.number)
)
// Son kullanma tarihi: yazarken "/" otomatik eklenir, sonra biçim doğrulanır
function onExpiryInput(event) {
  const bicimli = formatExpiry(event.target.value)
  payment.value.expiration = bicimli
  event.target.value = bicimli
}
const isExpiryInvalid = computed(
  () => payment.value.expiration.length > 0 && !isValidExpiry(payment.value.expiration)
)

const isCvvInvalid = computed(() => payment.value.cvv.length > 0 && !isValidCvv(payment.value.cvv))

function onTcInput(event) {
  onDigitsInput(event, 11, (filtered) => (order.value.tc = filtered))
}
function onPhoneFieldInput(event) {
  onPhoneInput(event, (filtered) => (order.value.phone = filtered))
}
function onZipInput(event) {
  onDigitsInput(event, 5, (filtered) => (order.value.zip = filtered))
}
function onCardNumberInput(event) {
  onDigitsInput(event, 16, (filtered) => (payment.value.number = filtered))
}
function onCvvInput(event) {
  onDigitsInput(event, 3, (filtered) => (payment.value.cvv = filtered))
}

const isFormValid = computed(() => {
  return (
    sepet.length > 0 &&
    isValidTC(order.value.tc) &&
    isValidName(order.value.firstName) &&
    isValidName(order.value.lastName) &&
    isValidEmail(order.value.email) &&
    telefonGecerli.value &&
    order.value.address &&
    order.value.country &&
    order.value.state &&
    order.value.zip &&
    isValidName(payment.value.name) &&
    isValidCardNumber(payment.value.number) &&
    isValidExpiry(payment.value.expiration) &&
    isValidCvv(payment.value.cvv)
  )
})

function urunuCikar(id) {
  const index = sepet.findIndex((item) => item.id === id)
  if (index !== -1) sepet.splice(index, 1)
}

// Sepete eklendiği andaki stok; eski sepet kayıtlarında stock olmayabilir
function stokSiniri(item) {
  return item.stock ?? Infinity
}

// Sepet satırının görseli. Ürün sepete eklenirken kopyalanır; sepet localStorage'da
// eski bir sürümden kalmışsa (image alanı yokken) ürün listesinden id ile bulunur.
const urunGorselleri = ref({})

function urunGorseli(item) {
  return item.image || urunGorselleri.value[item.id] || VARSAYILAN_GORSEL
}

// Yönetici görsel girmeden ürün eklerse boş kare yerine bu pixel kutu görünür
const VARSAYILAN_GORSEL = '/img/urunler/gorsel-yok.svg'

// Eski sepet kayıtlarındaki eksik görselleri bir kez tamamlar
async function gorselleriTamamla() {
  if (!sepet.some((item) => !item.image)) return
  try {
    const res = await fetch(`${baseUrl}/api/products`)
    if (!res.ok) return
    const urunler = await res.json()
    const harita = {}
    for (const u of urunler) harita[u.p_id] = u.p_image || ''
    urunGorselleri.value = harita
    // Bulunan görselleri sepete de yazalım, bir daha aranmasın
    for (const item of sepet) {
      if (!item.image && harita[item.id]) item.image = harita[item.id]
    }
  } catch {
    // Görsel tamamlanamazsa varsayılan görsel kullanılır, sayfa çalışmaya devam eder
  }
}

onMounted(gorselleriTamamla)

function adetArtir(item) {
  if (item.quantity < stokSiniri(item)) item.quantity++
}

// 1'in altına inmez; tamamen kaldırmak için Sil butonu var
function adetAzalt(item) {
  if (item.quantity > 1) item.quantity--
}



// Ham sepet + form bilgilerini backend'e yollar; sipariş kaydını server.js oluşturur
async function checkOut() {
  successMessage.value = ''
  errorMessage.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sepet: sepet,
        order: order.value,
        amount: toplamTutar.value,
      }),
    })
    if (!res.ok) {
      // Sunucu stok kontrolü yapıyor; "... için yeterli stok yok (kalan: 2)."
      // gibi mesajlar olduğu gibi gösterilsin ki ne yapacağı anlaşılsın.
      const cevap = await res.json().catch(() => null)
      throw new Error(cevap?.error || 'Sipariş oluşturulamadı.')
    }
    const yeniSiparis = await res.json()

    successMessage.value = `Siparişiniz alındı! Sipariş No: ${yeniSiparis.o_no}`
    sepet.splice(0, sepet.length)
    order.value = {
      tc: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      country: 'Türkiye',
      state: '',
      zip: '',
    }
    payment.value = { name: '', number: '', expiration: '', cvv: '' }
  } catch (e) {
    errorMessage.value = e.message
  }
}
</script>

<style scoped>
.checkout__cart-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.checkout__cart-head {
  font-weight: 600;
  background-color: rgba(102, 126, 234, 0.07);
}

.checkout__form {
  padding-bottom: 3rem;
}

.checkout__submit {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.checkout__submit:hover:not(:disabled) {
  filter: brightness(1.1);
}

.checkout__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.checkout__sil {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  padding: 4px 8px;
  font-size: 10px;
}

/* ===== Sepet satırı: görsel + bilgi + tutar ===== */
.checkout__satir {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkout__gorsel {
  flex: 0 0 auto;
  width: 56px;
  height: 56px;
  object-fit: contain;
  background-color: var(--zemin);
  border: var(--kenar);
  padding: 3px;
}

.checkout__bilgi {
  flex: 1 1 auto;
  min-width: 0;
}

.checkout__ad {
  margin: 0 0 2px;
  font-size: 11px;
  line-height: 1.4;
  /* Uzun ürün adları satır kırsın, kutuyu taşırmasın */
  overflow-wrap: anywhere;
}

/* Adet artır / azalt kutusu */
.checkout__adet {
  display: inline-flex;
  align-items: stretch;
  margin-top: 6px;
  border: var(--kenar);
}

.checkout__adet-btn {
  width: 26px;
  padding: 0;
  font-family: var(--font-baslik);
  font-size: 12px;
  line-height: 1;
  color: var(--metin);
  background-color: var(--panel);
  border: none;
  cursor: pointer;
}

.checkout__adet-btn:hover:not(:disabled) {
  color: #fff;
  background-color: var(--kirmizi);
}

.checkout__adet-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.checkout__adet-sayi {
  min-width: 30px;
  padding: 3px 4px;
  font-family: var(--font-baslik);
  font-size: 10px;
  text-align: center;
  background-color: var(--zemin);
  border-left: var(--kenar);
  border-right: var(--kenar);
}

.checkout__stok-uyari {
  display: block;
  margin-top: 4px;
  color: var(--sari);
  font-size: 11px;
}

.checkout__sag {
  flex: 0 0 auto;
  text-align: right;
}

.checkout__tutar {
  display: block;
  font-family: var(--font-baslik);
  font-size: 10px;
  white-space: nowrap;
}

/* Telefon alan kodu, yanındaki input ile aynı yükseklikte dursun */
.checkout__tel-kodu {
  font-family: var(--font-baslik);
  font-size: 11px;
}
</style>
