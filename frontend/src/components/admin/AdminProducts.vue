<template>
  <div class="admin-panel">
    <div class="admin-panel__header">
      <h2 class="admin-panel__title">{{ adminMi ? 'Ürünler' : 'Ürünlerim' }}</h2>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#adminAddProductModal"
        @click="resetAddForm"
      >
        Ürün Ekle
      </button>
    </div>

    <p v-if="error" class="admin-panel__error">{{ error }}</p>

    <!-- Ürünler tablo yerine kart listesi: 9 düzenlenebilir sütun hiçbir ekran
         genişliğine sığmıyordu, alanlar yarım görünüyordu. Kartta her alan
         kendi etiketiyle tam genişlikte duruyor, yatay kaydırma yok. -->
    <div class="urun-listesi">
      <article v-for="(product, index) in products" :key="product.p_id" class="urun-kart">
        <div class="urun-kart__ust">
          <img
            v-if="product.p_image"
            :src="gorselKaynagi(product)"
            :alt="product.p_name"
            class="urun-kart__gorsel"
          />
          <div v-else class="urun-kart__gorsel urun-kart__gorsel--bos">Görsel yok</div>

          <div class="urun-kart__ad">
            <label :for="`urun-ad-${product.p_id}`" class="form-label">Ürün Adı</label>
            <input
              :id="`urun-ad-${product.p_id}`"
              type="text"
              class="form-control"
              v-model="product.p_name"
            />
          </div>

          <span class="urun-kart__sira">#{{ index + 1 }}</span>
        </div>

        <div class="urun-kart__satir">
          <div class="urun-kart__alan">
            <label :for="`urun-kategori-${product.p_id}`" class="form-label">Kategori</label>
            <Secim :id="`urun-kategori-${product.p_id}`" v-model="product.p_category" :secenekler="kategoriler" />
          </div>

          <div class="urun-kart__alan">
            <label :for="`urun-stok-${product.p_id}`" class="form-label">Stok</label>
            <input
              :id="`urun-stok-${product.p_id}`"
              type="number"
              min="0"
              class="form-control"
              v-model.number="product.p_stock"
            />
          </div>

          <div class="urun-kart__alan">
            <label :for="`urun-fiyat-${product.p_id}`" class="form-label">Fiyat (₺)</label>
            <!-- Binlik noktaları yazarken otomatik konur: "100000" -> "100.000" -->
            <input
              :id="`urun-fiyat-${product.p_id}`"
              type="text"
              inputmode="decimal"
              class="form-control"
              :value="fiyatGoster(product)"
              @input="fiyatGir($event, product)"
              @blur="fiyatBitti(product)"
            />
            <!-- KDV'li fiyat hesaplanır, düzenlenmez -->
            <small class="urun-kart__kdv">KDV'li: {{ sayiYaz(kdvliFiyat(product.p_price)) }} ₺</small>
          </div>

          <div class="urun-kart__alan">
            <label :for="`urun-indirim-${product.p_id}`" class="form-label">İndirim (₺)</label>
            <!-- Fiyattan düşükse sitede eski fiyat üstü çizili görünür.
                 Boş bırakılırsa ya da fiyata eşitse indirim yok sayılır. -->
            <input
              :id="`urun-indirim-${product.p_id}`"
              type="text"
              inputmode="decimal"
              class="form-control"
              :value="indirimGoster(product)"
              @input="indirimGir($event, product)"
              @blur="indirimBitti(product)"
            />
            <small class="urun-kart__kdv">
              {{ indirimVarMi(product) ? 'Satış fiyatı' : 'İndirim yok' }}
            </small>
          </div>
        </div>

        <div class="urun-kart__alan">
          <label :for="`urun-aciklama-${product.p_id}`" class="form-label">Açıklama</label>
          <textarea
            :id="`urun-aciklama-${product.p_id}`"
            class="form-control urun-kart__aciklama"
            rows="3"
            v-model="product.p_desc"
          ></textarea>
        </div>

        <div class="urun-kart__alt">
          <div class="urun-kart__alan urun-kart__dosya">
            <label :for="`urun-gorsel-${product.p_id}`" class="form-label">Görsel</label>
            <!-- Bilgisayardan dosya seçilir, backend kaydedip yolunu döner -->
            <input
              :id="`urun-gorsel-${product.p_id}`"
              type="file"
              class="form-control"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              :disabled="yukleniyor"
              @change="gorselSec($event, product)"
            />
            <small v-if="product.p_image" class="urun-kart__yol">
              {{ dosyaAdi(product.p_image) }}
              <button type="button" class="admin-panel__kaldir" @click="gorseliKaldir(product)">
                kaldır
              </button>
            </small>
          </div>

          <div class="urun-kart__butonlar">
            <button type="button" class="btn btn-primary" @click="updateProduct(product)">
              Güncelle
            </button>
            <button type="button" class="btn btn-outline-danger" @click="deleteProduct(product.p_id)">
              Sil
            </button>
          </div>
        </div>
      </article>
    </div>

    <p v-if="!products.length && !error" class="admin-panel__bos">
      {{ adminMi ? 'Henüz ürün yok.' : 'Henüz ürün eklemediniz. "Ürün Ekle" ile başlayın.' }}
    </p>

    <!-- .fade-in atasındaki transform, position:fixed modal'ı sayfa dışına
         taşıdığı için Teleport ile doğrudan body'ye render ediyoruz -->
    <Teleport to="body">
      <div class="modal fade" tabindex="-1" id="adminAddProductModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Ürün Ekle</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addProduct">
                <div class="mb-2">
                  <label class="form-label">Ürün Adı</label>
                  <input v-model="newProduct.p_name" type="text" class="form-control" required />
                </div>
                <div class="mb-2">
                  <label class="form-label">Kategori</label>
                  <Secim v-model="newProduct.p_category" :secenekler="kategoriler" />
                </div>
                <div class="mb-2">
                  <label class="form-label">Stok</label>
                  <input v-model.number="newProduct.p_stock" type="number" min="0" class="form-control" required />
                </div>
                <div class="mb-2">
                  <label for="yeni-fiyat" class="form-label">Fiyat (₺)</label>
                  <!-- Binlik noktaları yazarken otomatik konur -->
                  <input
                    id="yeni-fiyat"
                    :value="yeniFiyatYazim"
                    @input="yeniFiyatGir"
                    type="text"
                    inputmode="decimal"
                    class="form-control"
                    placeholder="örn. 49.999,90"
                    required
                  />
                  <small class="admin-panel__ipucu">
                    KDV'li: {{ paraYaz(kdvliFiyat(newProduct.p_price)) }}
                  </small>
                </div>
                <div class="mb-2">
                  <label for="yeni-indirim" class="form-label">İndirimli Fiyat (₺)</label>
                  <input
                    id="yeni-indirim"
                    :value="yeniIndirimYazim"
                    @input="yeniIndirimGir"
                    type="text"
                    inputmode="decimal"
                    class="form-control"
                    placeholder="indirim yoksa boş bırakın"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Açıklama</label>
                  <textarea
                    v-model="newProduct.p_desc"
                    class="form-control"
                    placeholder="ürünü anlatın"
                    required
                  ></textarea>
                </div>
                <div class="mb-2">
                  <label for="yeni-gorsel" class="form-label">Görsel (isteğe bağlı)</label>
                  <input
                    id="yeni-gorsel"
                    type="file"
                    class="form-control"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    :disabled="yukleniyor"
                    @change="gorselSec($event, newProduct)"
                  />
                  <small class="admin-panel__ipucu">
                    PNG, JPG, WEBP, GIF veya SVG — en fazla 3 MB.
                  </small>
                  <div v-if="newProduct.p_image" class="admin-panel__onizleme">
                    <img :src="gorselKaynagi(newProduct)" alt="Seçilen görsel" class="admin-panel__gorsel" />
                    <button type="button" class="admin-panel__kaldir" @click="gorseliKaldir(newProduct)">
                      Görseli kaldır
                    </button>
                  </div>
                </div>
                <p v-if="addMessage" class="admin-panel__success">{{ addMessage }}</p>
                <div class="modal-footer px-0 pb-0">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                  <button type="submit" class="btn btn-primary">Ekle</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { oturum, ROL_ADMIN } from '../../utils/oturum.js'
import { basari, hata } from '../../utils/bildirim.js'
import { paraYaz, sayiYaz, paraGiris, paraBicimle, paraOku } from '../../utils/para.js'
import Secim from '../Secim.vue'

const baseUrl = 'http://localhost:3001'
const KDV_ORANI = 1.2

const products = ref([])
const error = ref('')
const addMessage = ref('')

// Ürün kategorileri (veritabanındaki p_category değerleri)
const kategoriler = ['Konsol', 'Oyun', 'Aksesuar']

const bosUrun = () => ({ p_name: '', p_category: 'Oyun', p_stock: 0, p_price: 0, p_disc: '', p_desc: '', p_image: '' })
const newProduct = ref(bosUrun())

// Fiyata KDV ekler. Ondalık hatası olmasın diye 2 haneye yuvarlıyoruz.
function kdvliFiyat(fiyat) {
  return Math.round(Number(fiyat) * KDV_ORANI * 100) / 100
}

// ===== Fiyat alanları =====
// Kullanıcı yazarken binlik noktalarını biz koyuyoruz. Yazım sırasında
// "1.234," gibi yarım bir değer modelden yeniden üretilemediği için,
// o anki metni ürün id'sine göre ayrıca tutuyoruz; alandan çıkınca siliyoruz.
const fiyatYazim = ref({})

function fiyatGoster(urun) {
  return fiyatYazim.value[urun.p_id] ?? paraGiris(urun.p_price)
}

function fiyatGir(event, urun) {
  const bicimli = paraBicimle(event.target.value)
  event.target.value = bicimli
  fiyatYazim.value[urun.p_id] = bicimli
  urun.p_price = paraOku(bicimli)
}

function fiyatBitti(urun) {
  delete fiyatYazim.value[urun.p_id]
}

// ===== İndirimli fiyat =====
// p_disc normal fiyattan düşükse sitede indirim görünür. Eşit ya da boşsa
// indirim yoktur; bu yüzden fiyata eşit olan değeri kutuda göstermiyoruz.
const indirimYazim = ref({})

function indirimVarMi(urun) {
  return urun.p_disc != null && Number(urun.p_disc) > 0 && Number(urun.p_disc) < Number(urun.p_price)
}

function indirimGoster(urun) {
  if (indirimYazim.value[urun.p_id] !== undefined) return indirimYazim.value[urun.p_id]
  return indirimVarMi(urun) ? paraGiris(urun.p_disc) : ''
}

function indirimGir(event, urun) {
  const bicimli = paraBicimle(event.target.value)
  event.target.value = bicimli
  indirimYazim.value[urun.p_id] = bicimli
  // Boş bırakıldıysa "indirim yok" demektir: sunucu p_disc = p_price yapar
  urun.p_disc = bicimli === '' ? null : paraOku(bicimli)
}

function indirimBitti(urun) {
  delete indirimYazim.value[urun.p_id]
}

// Modaldaki yeni ürün fiyatı için aynısının tek alanlık hali
const yeniFiyatYazim = ref('')
const yeniIndirimYazim = ref('')

function yeniIndirimGir(event) {
  const bicimli = paraBicimle(event.target.value)
  event.target.value = bicimli
  yeniIndirimYazim.value = bicimli
  newProduct.value.p_disc = bicimli === '' ? null : paraOku(bicimli)
}

function yeniFiyatGir(event) {
  const bicimli = paraBicimle(event.target.value)
  event.target.value = bicimli
  yeniFiyatYazim.value = bicimli
  newProduct.value.p_price = paraOku(bicimli)
}

// ===== Görsel yükleme =====
const yukleniyor = ref(false)

// Yeni yüklenen dosyanın önizlemesi doğrudan kullanıcının seçtiği dosyadan
// (blob adresi) gösterilir. Sunucudan tekrar indirmeyi beklemediğimiz için
// önizleme anında çıkar; kaydedilen değer yine sunucunun döndüğü yoldur.
const yerelOnizlemeler = ref({})

function gorselKaynagi(hedef) {
  return yerelOnizlemeler.value[hedef.p_image] || hedef.p_image
}

// "/img/urunler/star-fox.jpg" -> "star-fox.jpg"
function dosyaAdi(yol) {
  return String(yol).split('/').pop()
}

// Dosyayı base64'e çevirir (data URI'nin virgülden sonraki kısmı)
function dosyayiOku(dosya) {
  return new Promise((coz, reddet) => {
    const okuyucu = new FileReader()
    okuyucu.onload = () => coz(String(okuyucu.result).split(',')[1])
    okuyucu.onerror = () => reddet(new Error('Dosya okunamadı.'))
    okuyucu.readAsDataURL(dosya)
  })
}

// Seçilen dosyayı backend'e yollar, dönen yolu ürüne yazar.
// hedef: tablodaki bir ürün ya da modaldaki newProduct
async function gorselSec(event, hedef) {
  const dosya = event.target.files?.[0]
  if (!dosya) return

  yukleniyor.value = true
  try {
    const veri = await dosyayiOku(dosya)
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dosyaAdi: dosya.name, tur: dosya.type, veri }),
    })
    const cevap = await res.json()
    if (!res.ok) throw new Error(cevap.error || 'Görsel yüklenemedi.')

    yerelOnizlemeler.value[cevap.yol] = URL.createObjectURL(dosya)
    hedef.p_image = cevap.yol
    basari(`Görsel yüklendi: ${dosyaAdi(cevap.yol)}`)
  } catch (e) {
    hata(e.message)
  } finally {
    yukleniyor.value = false
    // Aynı dosya tekrar seçilebilsin diye alanı boşaltıyoruz
    event.target.value = ''
  }
}

function gorseliKaldir(hedef) {
  hedef.p_image = ''
}

// Admin tüm ürünleri, normal kullanıcı yalnızca kendi eklediklerini görür.
// Bu ayrımı backend yapıyor; biz sadece kimin istediğini adrese koyuyoruz.
const adminMi = computed(() => oturum.rol === ROL_ADMIN)

async function getProducts() {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/products/${oturum.kullaniciId}`)
    if (!res.ok) throw new Error('Ürünler alınamadı.')
    products.value = await res.json()
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

async function updateProduct(product) {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/products/${product.p_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_name: product.p_name,
        p_stock: product.p_stock,
        p_price: product.p_price,
        p_disc: product.p_disc,
        p_desc: product.p_desc,
        p_category: product.p_category,
        p_image: product.p_image,
        u_id: oturum.kullaniciId,
      }),
    })
    if (!res.ok) throw new Error('Ürün güncellenemedi.')
    await getProducts()
    basari(`"${product.p_name}" güncellendi. Stok: ${product.p_stock}, fiyat: ${paraYaz(product.p_price)}`)
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

async function deleteProduct(id) {
  if (!confirm('Bu ürün silinsin mi? Bu işlem geri alınamaz.')) return
  error.value = ''
  try {
    // u_id sorgu dizisinde gider: backend sahiplik kontrolü yapar
    const res = await fetch(`${baseUrl}/api/products/${id}?u_id=${oturum.kullaniciId}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Ürün silinemedi.')
    await getProducts()
    basari('Ürün silindi.')
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

function resetAddForm() {
  addMessage.value = ''
  newProduct.value = bosUrun()
  yeniFiyatYazim.value = ''
  yeniIndirimYazim.value = ''
}

async function addProduct() {
  addMessage.value = ''
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newProduct.value, u_id: oturum.kullaniciId }),
    })
    if (!res.ok) throw new Error('Ürün eklenemedi.')
    addMessage.value = 'Ürün başarıyla eklendi.'
    basari(`"${newProduct.value.p_name}" eklendi (${paraYaz(newProduct.value.p_price)}).`)
    await getProducts()
  } catch (e) {
    error.value = e.message
    hata(e.message)
  }
}

onMounted(() => {
  getProducts()
})

// Blob adresleri tarayıcı belleğinde kalmasın
onUnmounted(() => {
  Object.values(yerelOnizlemeler.value).forEach((adres) => URL.revokeObjectURL(adres))
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

/* ===== Ürün kartları =====
   Kartlar sığdıkça yan yana dizilir. min(520px, 100%) sayesinde dar
   ekranda kart kutudan taşmaz, tek sütuna düşer. */
.urun-listesi {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(520px, 100%), 1fr));
  gap: var(--bosluk);
}

.urun-kart {
  display: flex;
  flex-direction: column;
  gap: var(--bosluk);
  padding: var(--bosluk);
  background-color: var(--zemin);
  border: var(--kenar);
  box-shadow: var(--golge);
}

.urun-kart__ust {
  display: flex;
  align-items: flex-start;
  gap: var(--bosluk);
  /* Ad alanına 300px kalmıyorsa kendi satırına iner; uzun ürün adları
     görselle sıra numarası arasında sıkışıp yarım görünmesin diye. */
  flex-wrap: wrap;
}

.urun-kart__gorsel {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  object-fit: contain;
  background: var(--cerceve);
  border: var(--kenar-form);
  image-rendering: auto;
}

/* Görseli olmayan üründe aynı ölçüde yazılı kutu */
.urun-kart__gorsel--bos {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: var(--metin-soluk);
  font-size: 11px;
  text-align: center;
}

.urun-kart__ad {
  flex: 1 1 300px;
  min-width: 0;
}

.urun-kart__sira {
  flex-shrink: 0;
  font-family: var(--font-baslik);
  font-size: 10px;
  color: var(--metin-soluk);
}

/* Kategori / Stok / Fiyat yan yana; dar kartta alt alta iner */
.urun-kart__satir {
  display: grid;
  /* Kategori / Stok / Fiyat / İndirim — dar kartta kendiliğinden alt alta iner */
  grid-template-columns: minmax(130px, 1.2fr) 80px minmax(110px, 1fr) minmax(110px, 1fr);
  gap: var(--bosluk-kucuk);
}

.urun-kart__alan {
  min-width: 0;
}

.urun-kart__kdv {
  display: block;
  margin-top: 4px;
  color: var(--metin-soluk);
  font-size: 12px;
  white-space: nowrap;
}

.urun-kart__aciklama {
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

.urun-kart__alt {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--bosluk);
  flex-wrap: wrap;
}

.urun-kart__dosya {
  flex: 1 1 260px;
}

.urun-kart__yol {
  display: block;
  margin-top: 4px;
  color: var(--metin-soluk);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.urun-kart__butonlar {
  display: flex;
  gap: var(--bosluk-kucuk);
  flex-shrink: 0;
}

/* Modaldaki önizleme hâlâ küçük kutu kullanıyor */
.admin-panel__gorsel {
  display: block;
  width: 64px;
  height: 48px;
  object-fit: contain;
  background: var(--zemin);
  border: 2px solid var(--cerceve);
  image-rendering: auto;
}

@media (max-width: 575.98px) {
  /* Telefonda kart iç boşluğu daralsın, alanlara daha çok yer kalsın */
  .urun-kart {
    padding: var(--bosluk-kucuk);
  }

  .admin-panel__header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  /* Çok dar ekranda üç alan da tam genişlik */
  .urun-kart__satir {
    grid-template-columns: 1fr;
  }

  .urun-kart__butonlar {
    width: 100%;
  }

  .urun-kart__butonlar .btn {
    flex: 1;
  }
}
.admin-panel__bos {
  color: var(--metin-soluk);
  padding: var(--bosluk) 0;
}

/* Dosya seçme alanı tabloda fazla yer kaplamasın */
.admin-panel__dosya {
  min-width: 150px;
  font-size: 12px;
}

.admin-panel__yol {
  display: block;
  margin-top: 4px;
  color: var(--metin-soluk);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.admin-panel__kaldir {
  padding: 0;
  color: var(--kirmizi);
  font-size: 11px;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}

.admin-panel__ipucu {
  display: block;
  margin-top: 4px;
  color: var(--metin-soluk);
  font-size: 12px;
}

.admin-panel__onizleme {
  display: flex;
  align-items: center;
  gap: var(--bosluk-kucuk);
  margin-top: var(--bosluk-kucuk);
}
</style>
