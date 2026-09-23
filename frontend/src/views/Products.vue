<template>
  <div class="products">
    <!-- Sayfa Başlığı -->
    <header class="page-header fade-in">
      <h1 class="page-header__title">Ürünler</h1>
      <p class="page-header__subtitle">
        Aradığın ürünü bul ve sepetine ekle.
      </p>
    </header>

    <div class="container">
      <!-- Arama + Kategori Filtresi -->
      <div class="products-filters fade-in">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control products-filters__search"
          placeholder="Ürün ara..."
        />
        <Secim
          v-model="kategori"
          class="products-filters__kategori"
          :secenekler="kategoriSecenekleri"
        />
      </div>

      <p v-if="error" class="products-error">{{ error }}</p>

      <!-- Ürün Listesi -->
      <div v-if="!error && filteredProducts.length" class="row g-4 products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.p_id"
          class="col-12 col-sm-6 col-lg-4"
        >
          <article class="product-card">
            <!-- Görsel alanı: görsel yoksa kategori ikonu -->
            <div class="product-card__gorsel-alan">
              <img
                v-if="product.p_image"
                class="product-card__gorsel"
                :src="product.p_image"
                :alt="product.p_name"
                loading="lazy"
              />
              <div v-else class="product-card__ikon">{{ kategoriIkonu(product.p_category) }}</div>
              <span class="product-card__kategori">{{ product.p_category }}</span>
              <span
                class="product-card__badge"
                :class="{ 'product-card__badge--out': product.p_stock <= 0 }"
              >
                {{ product.p_stock > 0 ? `Stok: ${product.p_stock}` : 'Stokta Yok' }}
              </span>
            </div>

            <div class="product-card__govde">
              <h3 class="product-card__name">{{ product.p_name }}</h3>
              <p v-if="product.p_desc" class="product-card__desc">{{ product.p_desc }}</p>

              <div class="product-card__footer">
                <!-- İndirim varsa eski fiyat üstü çizili gösterilir -->
                <div class="product-card__fiyatlar">
                  <span v-if="indirimli(product)" class="product-card__eski-fiyat">
                    {{ fiyatYaz(product.p_price) }}
                  </span>
                  <span class="product-card__price">{{ fiyatYaz(satisFiyati(product)) }}</span>
                </div>
                <button
                  type="button"
                  class="btn btn-primary product-card__btn"
                  :disabled="product.p_stock <= 0"
                  @click="sepeteEkle(product)"
                >
                  {{ sepettekiAdet(product.p_id) ? `Sepette (${sepettekiAdet(product.p_id)})` : 'Sepete Ekle' }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Sonuç Bulunamadı -->
      <div v-else-if="!error" class="products-empty">
        <p>Aramanızla eşleşen ürün bulunamadı.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { paraYaz as fiyatYaz } from '../utils/para.js'
import Secim from '../components/Secim.vue'

const baseUrl = 'http://localhost:3001'
const route = useRoute()
const router = useRouter()

// Arama ve kategori filtresi durumu
const searchTerm = ref('')
const kategoriler = ['Konsol', 'Oyun', 'Aksesuar']
// Boş değer "hepsi" anlamına gelir
const kategoriSecenekleri = [
  { ad: 'Tüm Kategoriler', deger: '' },
  ...kategoriler.map((k) => ({ ad: k, deger: k })),
]
// Anasayfadaki kategori kutuları /urunler?kategori=Konsol ile gelir
const kategori = ref(kategoriler.includes(route.query.kategori) ? route.query.kategori : '')

// Seçilen kategori URL'de kalsın ki sayfa paylaşılabilsin / yenilenince kaybolmasın
watch(kategori, (yeni) => {
  router.replace({ query: yeni ? { kategori: yeni } : {} })
})

// Sepet App.vue'da tutulur, buraya inject ile gelir (localStorage'a orada yazılır)
const sepet = inject('sepet')

// Ürünler: admin panelinin yönettiği gerçek backend'den (products.json) çekilir
const products = ref([])
const error = ref('')

async function getProducts() {
  error.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/products`)
    if (!res.ok) throw new Error('Ürünler alınamadı.')
    products.value = await res.json()
  } catch (e) {
    error.value = 'Ürünler yüklenemedi. Backend çalışıyor mu? (npm start içinde backend klasörü)'
  }
}

onMounted(() => {
  getProducts()
})

// Arama terimine ve kategoriye göre ürünleri filtreler
const filteredProducts = computed(() => {
  return products.value.filter(
    (product) =>
      product.p_name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
      (kategori.value === '' || product.p_category === kategori.value)
  )
})

// Görseli olmayan ürünler için kategoriye göre ikon
function kategoriIkonu(k) {
  return { Konsol: '🕹️', Oyun: '💿', Aksesuar: '🎧' }[k] ?? '🎮'
}

// İndirimli fiyat (p_disc) normal fiyattan düşükse satış fiyatı odur
function indirimli(product) {
  return product.p_disc != null && Number(product.p_disc) < Number(product.p_price)
}

function satisFiyati(product) {
  return indirimli(product) ? product.p_disc : product.p_price
}



// Ürünü sepete ekler; zaten sepette varsa adedini bir artırır.
// Sepet kendi sade alan adlarını kullanır (id, name, price), veritabanı
// sütun adlarını sepete taşımıyoruz.
function sepeteEkle(product) {
  const mevcut = sepet.find((item) => item.id === product.p_id)
  if (mevcut) {
    // Stoktan fazlasını sepete koymayalım
    if (mevcut.quantity < product.p_stock) mevcut.quantity++
  } else {
    sepet.push({
      id: product.p_id,
      name: product.p_name,
      // Ödeme sayfasındaki sepet küçük görseli için
      image: product.p_image || '',
      price: satisFiyati(product),
      quantity: 1,
      stock: product.p_stock,
    })
  }
}

// Belirtilen ürünün sepetteki adedini döndürür
function sepettekiAdet(id) {
  const item = sepet.find((item) => item.id === id)
  return item ? item.quantity : 0
}
</script>

<style scoped>
.products-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.products-filters__search {
  max-width: 420px;
}

.products-filters__kategori {
  max-width: 220px;
}

.products-error {
  text-align: center;
  color: var(--kirmizi);
  padding: 2rem 1rem;
}

.products-grid {
  padding-bottom: 3.5rem;
}

/* Oyun kutusu hissi veren kart: anasayfadaki oyun kartıyla aynı dil */
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.product-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--golge-buyuk);
}

/* Görsel alanı sabit oranlı; fotoğraf kırpılmadan sığar */
.product-card__gorsel-alan {
  position: relative;
  aspect-ratio: 4 / 3;
  max-width: 100%;
  background-color: var(--zemin);
  border-bottom: var(--kenar);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card__gorsel {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.75rem;
  /* Ürün fotoğrafları pixel değil, net görünsün */
  image-rendering: auto;
}

.product-card__ikon {
  font-size: 4rem;
}

/* Sol üst: kategori, sağ üst: stok rozeti */
.product-card__kategori,
.product-card__badge {
  position: absolute;
  top: var(--bosluk-kucuk);
  font-family: var(--font-baslik);
  font-size: 9px;
  padding: 5px 7px;
  border: 2px solid var(--cerceve);
  color: #fff;
}

.product-card__kategori {
  left: var(--bosluk-kucuk);
  background-color: var(--kirmizi);
}

.product-card__badge {
  right: var(--bosluk-kucuk);
  background-color: var(--turkuaz);
  color: var(--cerceve);
}

.product-card__badge--out {
  background-color: var(--cerceve);
  color: var(--metin-soluk);
}

.product-card__govde {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: var(--bosluk);
}

.product-card__name {
  font-size: 13px;
  line-height: 1.5;
  color: var(--metin);
  margin-bottom: var(--bosluk-kucuk);
}

.product-card__desc {
  color: var(--metin-soluk);
  font-size: 0.9rem;
  line-height: 1.55;
  margin-bottom: 0;
}

/* margin-top:auto fiyat ve butonu kartın altına iter */
.product-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: var(--bosluk);
}

.product-card__fiyatlar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-card__eski-fiyat {
  color: var(--metin-soluk);
  font-size: 0.85rem;
  text-decoration: line-through;
}

.product-card__price {
  font-family: var(--font-baslik);
  font-size: 12px;
  color: var(--sari);
}

.product-card__btn {
  white-space: nowrap;
}

.product-card__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.products-empty {
  text-align: center;
  color: var(--metin-soluk);
  padding: 4rem 1rem;
  font-size: 1.1rem;
}

@media (max-width: 576px) {
  .products-filters {
    flex-direction: column;
  }

  .products-filters__search,
  .products-filters__kategori {
    max-width: 100%;
  }

  .product-card__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
