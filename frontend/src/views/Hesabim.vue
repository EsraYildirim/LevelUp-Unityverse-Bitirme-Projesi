<template>
  <div class="hesabim">
    <header class="page-header fade-in">
      <h1 class="page-header__title">Hesabım</h1>
      <p class="page-header__subtitle">Ürünlerini yönet, siparişlerini takip et, bilgilerini güncelle.</p>
    </header>

    <div class="panel-sayfa fade-in">
      <div class="panel-duzen">
        <PanelKenar v-model="secim" baslik="Hesabım" :sekmeler="sekmeler" />

        <div class="panel-icerik">
          <p v-if="hata" class="panel-hata">{{ hata }}</p>
          <p v-if="basariMesaji" class="panel-basari">{{ basariMesaji }}</p>

          <!-- ÜRÜNLERİM: kullanıcı kendi eklediği ürünleri yönetir (satıcı paneli) -->
          <AdminProducts v-if="secim === 'urunler'" />

          <!-- SİPARİŞLERİM: kullanıcının adına kayıtlı siparişler, salt okunur -->
          <section v-else-if="secim === 'siparisler'">
            <h2 class="panel-baslik">Siparişlerim</h2>

            <div v-if="siparislerim.length" class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sipariş No</th>
                    <th>Ürünler</th>
                    <th>Tutar</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(siparis, index) in siparislerim" :key="siparis.o_id">
                    <th>{{ index + 1 }}</th>
                    <td>{{ siparis.o_no }}</td>
                    <td>{{ urunleriYaz(siparis.o_products) }}</td>
                    <td>{{ paraYaz(siparis.o_amount) }}</td>
                    <td>{{ tarihYaz(siparis.o_created_at) }}</td>
                    <td>{{ siparis.o_status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-else class="panel-bos">
              Henüz siparişin yok. <router-link to="/urunler">Ürünlere göz at →</router-link>
            </p>
          </section>

          <!-- BİLGİLERİM: kendi hesabını düzenler (rolünü değiştiremez) -->
          <section v-else-if="secim === 'bilgiler'">
            <h2 class="panel-baslik">Bilgilerim</h2>

            <form class="row g-3" @submit.prevent="bilgileriKaydet">
              <div class="col-12 col-md-6">
                <label for="hesap-ad" class="form-label">Ad</label>
                <input id="hesap-ad" v-model="kullanici.firstName" type="text" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="hesap-soyad" class="form-label">Soyad</label>
                <input id="hesap-soyad" v-model="kullanici.lastName" type="text" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="hesap-email" class="form-label">Email</label>
                <input id="hesap-email" v-model="kullanici.email" type="email" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="hesap-tel" class="form-label">Telefon</label>
                <input
                  id="hesap-tel"
                  :value="kullanici.tel"
                  @input="onTelInput"
                  type="tel"
                  inputmode="numeric"
                  class="form-control"
                />
              </div>
              <div class="col-12 col-md-6">
                <label for="hesap-dogum" class="form-label">Doğum Tarihi</label>
                <input id="hesap-dogum" v-model="kullanici.birthdate" type="date" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label for="hesap-sifre" class="form-label">Şifre</label>
                <input
                  id="hesap-sifre"
                  v-model="kullanici.pass"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': sifreKisa }"
                  required
                />
                <div v-if="sifreKisa" class="invalid-feedback d-block">
                  Şifre en az 8 karakter olmalıdır.
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary" :disabled="sifreKisa">Kaydet</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Kullanıcı paneli: admin olmayan kullanıcılar buraya yönlendirilir.
// Admin bileşenleri burada kullanılmaz; kullanıcı yalnızca kendi verisini görür.
import { ref, computed, onMounted } from 'vue'
import PanelKenar from '../components/PanelKenar.vue'
import AdminProducts from '../components/admin/AdminProducts.vue'
import { oturum, kullaniciAdiniGetir } from '../utils/oturum.js'
import { isValidPassword, onPhoneInput } from '../utils/validators.js'
import { paraYaz } from '../utils/para.js'
import { tarihYaz } from '../utils/tarih.js'

const baseUrl = 'http://localhost:3001'

const sekmeler = [
  { ad: 'Ürünlerim', deger: 'urunler' },
  { ad: 'Siparişlerim', deger: 'siparisler' },
  { ad: 'Bilgilerim', deger: 'bilgiler' },
]

const secim = ref('urunler')
const hata = ref('')
const basariMesaji = ref('')

const siparisler = ref([])
const kullanici = ref({
  firstName: '',
  lastName: '',
  email: '',
  tel: '',
  pass: '',
  birthdate: '',
})

const sifreKisa = computed(
  () => kullanici.value.pass.length > 0 && !isValidPassword(kullanici.value.pass)
)

function onTelInput(event) {
  onPhoneInput(event, (filtrelenmis) => (kullanici.value.tel = filtrelenmis))
}

function urunleriYaz(urunler) {
  return Array.isArray(urunler) ? urunler.join(', ') : urunler
}

// Siparişlerde kullanıcı kimliği tutulmuyor, sipariş veren adı ile eşleştiriyoruz
const siparislerim = computed(() => {
  const adSoyad = `${kullanici.value.firstName} ${kullanici.value.lastName}`.trim().toLowerCase()
  if (!adSoyad) return []
  return siparisler.value.filter((s) => String(s.o_person).trim().toLowerCase() === adSoyad)
})

async function bilgileriGetir() {
  hata.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users/${oturum.kullaniciId}`)
    if (!res.ok) throw new Error('Bilgiler alınamadı.')
    const u = await res.json()
    kullanici.value = {
      firstName: u.u_firstName,
      lastName: u.u_lastName,
      email: u.u_email,
      tel: u.u_tel ?? '',
      pass: u.u_pass,
      birthdate: u.u_birthdate,
    }
  } catch (e) {
    hata.value = e.message
  }
}

async function siparisleriGetir() {
  try {
    const res = await fetch(`${baseUrl}/api/orders`)
    if (!res.ok) throw new Error('Siparişler alınamadı.')
    siparisler.value = await res.json()
  } catch (e) {
    hata.value = e.message
  }
}

async function bilgileriKaydet() {
  hata.value = ''
  basariMesaji.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users/${oturum.kullaniciId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // rol gönderilmiyor: kullanıcı kendini admin yapamaz
      body: JSON.stringify({
        firstName: kullanici.value.firstName,
        lastName: kullanici.value.lastName,
        email: kullanici.value.email,
        tel: kullanici.value.tel,
        pass: kullanici.value.pass,
        birthdate: kullanici.value.birthdate,
      }),
    })
    if (!res.ok) throw new Error('Bilgiler güncellenemedi.')
    basariMesaji.value = await res.json()
    await kullaniciAdiniGetir() // menüdeki ad da güncellensin
  } catch (e) {
    hata.value = e.message
  }
}

onMounted(async () => {
  await bilgileriGetir()
  await siparisleriGetir()
})
</script>

<style scoped>
/* Panel sayfaları site genelindeki .container'dan (1140px) daha geniş:
   tablolarda çok sütun var, dar alanda hepsi sıkışıyordu. */
.panel-sayfa {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--bosluk);
}

.panel-duzen {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--bosluk);
  align-items: start;
  margin-bottom: 3rem;
}

.panel-icerik {
  background: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge);
  padding: var(--bosluk-buyuk) var(--bosluk);
  min-width: 0;
}

.panel-baslik {
  font-size: 14px;
  margin-bottom: var(--bosluk);
}

.panel-hata {
  color: var(--kirmizi);
}

.panel-basari {
  color: var(--turkuaz);
}

.panel-bos {
  color: var(--metin-soluk);
}

.table-responsive {
  overflow-x: auto;
}

@media (max-width: 767.98px) {
  .panel-duzen {
    grid-template-columns: 1fr;
  }
}
</style>
