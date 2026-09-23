<template>
  <section class="test-example">
    <h2 class="test-example__title">Admin Panel (Ödev)</h2>
    <p>Butonlara tıklayınca "secim" değişkeni değişir ve ilgili bölüm gösterilir.</p>

    <div class="admin-panel__menu">
      <button type="button" class="btn btn-primary m-1" @click="secim = 'products'">Ürünler</button>
      <button type="button" class="btn btn-primary m-1" @click="secim = 'users'">Kullanıcılar</button>
      <button type="button" class="btn btn-primary m-1" @click="secim = 'orders'">Siparişler</button>
    </div>
    <p class="admin-panel__current">Seçili: {{ secim }}</p>

    <!-- Ürünler: satır içi düzenlenebilir tablo (v-model doğrudan diziye bağlı) -->
    <div v-if="secim === 'products'" class="table-responsive">
      <h3 class="test-example__subtitle">
        Ürünlerimiz
        <button
          type="button"
          class="btn btn-sm btn-outline-success float-end"
          data-bs-toggle="modal"
          data-bs-target="#test-add-product-modal"
        >
          Ürün Ekle
        </button>
      </h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Ad</th>
            <th scope="col">Stok</th>
            <th scope="col">Fiyat</th>
            <th scope="col">KDV'li Fiyat</th>
            <th scope="col">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(urun, index) in urunler" :key="urun.id">
            <th scope="row">{{ index + 1 }}</th>
            <td><input class="form-control" type="text" v-model="urun.ad" /></td>
            <td><input class="form-control" type="number" min="0" v-model.number="urun.stok" /></td>
            <td><input class="form-control" type="number" min="0" v-model.number="urun.fiyat" /></td>
            <td>{{ (urun.fiyat * 1.2).toFixed(2) }}</td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-1"
                @click="urunGuncelle(urun)"
              >
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

    <!-- Kullanıcılar -->
    <div v-else-if="secim === 'users'" class="table-responsive">
      <h3 class="test-example__subtitle">
        Kullanıcılarımız
        <button
          type="button"
          class="btn btn-sm btn-outline-success float-end"
          data-bs-toggle="modal"
          data-bs-target="#test-add-user-modal"
        >
          Kullanıcı Ekle
        </button>
      </h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Ad</th>
            <th scope="col">Soyad</th>
            <th scope="col">E-mail</th>
            <th scope="col">Telefon</th>
            <th scope="col">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.email">
            <td>{{ user.ad }}</td>
            <td>{{ user.soyad }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.telefon || '-' }}</td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-1"
                @click="kullaniciGuncelle(user)"
              >
                Güncelle
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="kullaniciSil(index)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Siparişler: satır içi düzenlenebilir tablo -->
    <div v-else class="table-responsive">
      <h3 class="test-example__subtitle">Siparişlerimiz</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Sipariş No</th>
            <th scope="col">Ürün Adı</th>
            <th scope="col">Teslim Alacak Kişi</th>
            <th scope="col">Adres</th>
            <th scope="col">Toplam Tutar (₺)</th>
            <th scope="col">Verilen Tarihi</th>
            <th scope="col">Sipariş Durumu</th>
            <th scope="col">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(siparis, index) in siparisler" :key="siparis.no">
            <td><input class="form-control" type="text" v-model="siparis.no" /></td>
            <td><input class="form-control" type="text" v-model="siparis.urunAdi" /></td>
            <td><input class="form-control" type="text" v-model="siparis.teslimAlacak" /></td>
            <td><input class="form-control" type="text" v-model="siparis.adres" /></td>
            <td><input class="form-control" type="number" min="0" v-model.number="siparis.tutar" /></td>
            <td><input class="form-control" type="date" v-model="siparis.tarih" /></td>
            <td>
              <select class="form-select" v-model="siparis.durum">
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-1"
                @click="siparisGuncelle(siparis)"
              >
                Güncelle
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="siparisSil(index)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modallar body'ye teleport edilir: .fade-in animasyonundaki transform,
         içindeki position:fixed elemanlar için yeni bir containing block oluşturup
         modalın viewport yerine o konteynere göre konumlanmasına (ve ekran dışına
         taşmasına) yol açtığı için Teleport ile bu sorunun önüne geçilir. -->
    <Teleport to="body">
      <!-- Ürün Ekle Modal -->
      <div class="modal fade" id="test-add-product-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Ürün Ekle</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <form @submit.prevent="yeniUrunEkle">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label">Ürün Adı:</label>
                    <input type="text" class="form-control" v-model="yeniUrun.ad" required />
                  </div>
                  <div class="col-6">
                    <label class="form-label">Stok:</label>
                    <input type="number" class="form-control" min="0" v-model.number="yeniUrun.stok" required />
                  </div>
                  <div class="col-6">
                    <label class="form-label">Fiyat:</label>
                    <input type="number" class="form-control" min="0" v-model.number="yeniUrun.fiyat" required />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-success" type="submit" data-bs-dismiss="modal">Ürün Ekle</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Kullanıcı Ekle Modal -->
      <div class="modal fade" id="test-add-user-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">Kullanıcı Ekle</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <form @submit.prevent="yeniKullaniciEkle">
              <div class="modal-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Ad*</label>
                    <input type="text" class="form-control" v-model="yeniKullanici.ad" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Soyad*</label>
                    <input type="text" class="form-control" v-model="yeniKullanici.soyad" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email*</label>
                    <input
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': isYeniKullaniciEmailInvalid }"
                      v-model="yeniKullanici.email"
                      placeholder="ornek@mail.com"
                      required
                    />
                    <!-- Email formatı uyarısı -->
                    <div v-if="isYeniKullaniciEmailInvalid" class="invalid-feedback d-block">
                      Geçerli bir email adresi girin (örn. ornek@mail.com).
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Telefon*</label>
                    <input
                      :value="yeniKullanici.telefon"
                      @input="onYeniKullaniciTelefonInput"
                      type="tel"
                      inputmode="numeric"
                      class="form-control"
                      :class="{ 'is-invalid': isYeniKullaniciTelefonInvalid }"
                      placeholder="5xxxxxxxxx"
                      required
                    />
                    <!-- Telefon uzunluğu uyarısı: sadece rakam kabul edilir -->
                    <div v-if="isYeniKullaniciTelefonInvalid" class="invalid-feedback d-block">
                      Telefon numarası 10-11 haneli olmalıdır.
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Parola*</label>
                    <input type="password" class="form-control" v-model="yeniKullanici.parola" required />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  class="btn btn-success"
                  type="submit"
                  data-bs-dismiss="modal"
                  :disabled="!isYeniKullaniciFormValid"
                >
                  Kullanıcı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// localStorage'dan veri okur, yoksa/parse edilemezse varsayılan değeri döner
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// Admin Panel ödevi: seçime göre bölüm gösterme
const secim = ref('products')

// Düzenlendiğinde localStorage'a kaydedilir
const urunler = ref(
  loadFromStorage('test_admin_products', [
    { id: 1, ad: 'nike', stok: 0, fiyat: 100 },
    { id: 2, ad: 'adidas', stok: 200, fiyat: 1000 },
  ])
)
watch(urunler, (val) => localStorage.setItem('test_admin_products', JSON.stringify(val)), { deep: true })

const users = ref(
  loadFromStorage('test_admin_users', [
    { ad: 'Mark', soyad: 'Otto', email: '@mdo', telefon: '-', parola: '••••••' },
    { ad: 'Jacob', soyad: 'Thornton', email: '@fat', telefon: '-', parola: '••••••' },
    { ad: 'John', soyad: 'Doe', email: '@social', telefon: '-', parola: '••••••' },
  ])
)
watch(users, (val) => localStorage.setItem('test_admin_users', JSON.stringify(val)), { deep: true })

const siparisler = ref(
  loadFromStorage('test_admin_orders', [
    {
      no: '243565',
      urunAdi: 'nike,adidas,samsung',
      teslimAlacak: 'Ahmet Çınar',
      adres: 'İstanbul',
      tutar: 550,
      tarih: '',
      durum: 'Kargoya Verildi',
    },
    {
      no: '123421',
      urunAdi: 'apple,hp,xiaomi',
      teslimAlacak: 'Kerem Atlıhan',
      adres: 'Çanakkale',
      tutar: 2000,
      tarih: '',
      durum: 'Kargoya Verildi',
    },
  ])
)
watch(siparisler, (val) => localStorage.setItem('test_admin_orders', JSON.stringify(val)), {
  deep: true,
})

// Satırlar zaten v-model ile canlı düzenlendiği ve localStorage'a otomatik
// kaydedildiği için Güncelle butonu kullanıcıya kaydın alındığını onaylar.
function urunGuncelle(urun) {
  alert(`Ürün güncellendi: ${urun.ad}`)
}

function urunSil(id) {
  urunler.value = urunler.value.filter((u) => u.id !== id)
}

function kullaniciGuncelle(user) {
  alert(`Kullanıcı güncellendi: ${user.ad} ${user.soyad}`)
}

function kullaniciSil(index) {
  users.value.splice(index, 1)
}

function siparisGuncelle(siparis) {
  alert(`Sipariş güncellendi: ${siparis.no}`)
}

function siparisSil(index) {
  siparisler.value.splice(index, 1)
}

// Modal ile ürün ekleme
const yeniUrun = ref({ ad: '', stok: 0, fiyat: 0 })
function yeniUrunEkle() {
  const yeniId = urunler.value.length ? Math.max(...urunler.value.map((u) => u.id)) + 1 : 1
  urunler.value.push({
    id: yeniId,
    ad: yeniUrun.value.ad,
    stok: yeniUrun.value.stok,
    fiyat: yeniUrun.value.fiyat,
  })
  yeniUrun.value = { ad: '', stok: 0, fiyat: 0 }
}

// Modal ile kullanıcı ekleme
const yeniKullanici = ref({ ad: '', soyad: '', email: '', telefon: '', parola: '' })

// Email formatını kontrol eder (örn. ornek@mail.com)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isYeniKullaniciEmailInvalid = computed(
  () => yeniKullanici.value.email.length > 0 && !emailPattern.test(yeniKullanici.value.email)
)

// Telefon alanına yalnızca rakam girilmesine izin verir, harfleri anında filtreler
function onYeniKullaniciTelefonInput(event) {
  const filtered = event.target.value.replace(/\D/g, '').slice(0, 11)
  yeniKullanici.value.telefon = filtered
  // Vue, ref değeri değişmediğinde DOM'u yeniden yazmayabilir; native değeri elle eşitliyoruz.
  event.target.value = filtered
}
const isYeniKullaniciTelefonInvalid = computed(
  () => yeniKullanici.value.telefon.length > 0 && yeniKullanici.value.telefon.length < 10
)

// Tüm alanlar dolu ve geçerli olmadan kullanıcı eklenemez
const isYeniKullaniciFormValid = computed(() => {
  const k = yeniKullanici.value
  return (
    k.ad.trim() &&
    k.soyad.trim() &&
    k.email.length > 0 &&
    !isYeniKullaniciEmailInvalid.value &&
    k.telefon.length >= 10 &&
    !isYeniKullaniciTelefonInvalid.value &&
    k.parola.length > 0
  )
})

function yeniKullaniciEkle() {
  if (!isYeniKullaniciFormValid.value) return

  users.value.push({
    ad: yeniKullanici.value.ad,
    soyad: yeniKullanici.value.soyad,
    email: yeniKullanici.value.email,
    telefon: yeniKullanici.value.telefon,
    parola: '••••••',
  })
  yeniKullanici.value = { ad: '', soyad: '', email: '', telefon: '', parola: '' }
}
</script>

<style scoped>
.admin-panel__menu {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.admin-panel__current {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0.5rem 0 1.5rem;
}
</style>
