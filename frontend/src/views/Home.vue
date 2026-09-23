<template>
  <div class="home">
    <!-- Hero: CRT ekran çerçevesi (scanline efekti sadece burada kullanılıyor) -->
    <section class="home-hero fade-in">
      <div class="container">
        <div class="crt">
          <div class="crt__icerik">
            <div class="crt__metin">
              <h1 class="crt__baslik">Oyun Zamanı</h1>
              <p class="crt__aciklama">
                Konsol, oyun ve aksesuar; hepsi tek yerde.
              </p>
              <router-link to="/urunler" class="btn btn-primary">
                Oyunlara Göz At
              </router-link>
            </div>

            <!-- Hareketli pixel konsol: tamamen CSS, görsel dosyası yok.
                 Ekranda sonsuz koşan küçük bir oyun oynanıyor. -->
            <div class="konsol" role="img" aria-label="Üzerinde oyun oynanan pixel oyun konsolu">
              <div class="konsol__ekran">
                <span class="konsol__yildiz konsol__yildiz--1"></span>
                <span class="konsol__yildiz konsol__yildiz--2"></span>
                <span class="konsol__yildiz konsol__yildiz--3"></span>
                <span class="konsol__oyuncu"></span>
                <span class="konsol__engel konsol__engel--1"></span>
                <span class="konsol__engel konsol__engel--2"></span>
                <span class="konsol__zemin"></span>
                <span class="konsol__skor">SKOR 9999</span>
              </div>

              <div class="konsol__alt">
                <div class="konsol__dpad">
                  <span class="konsol__dpad-yatay"></span>
                  <span class="konsol__dpad-yukari"></span>
                  <span class="konsol__dpad-asagi"></span>
                </div>
                <div class="konsol__hoparlor">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div class="konsol__butonlar">
                  <span class="konsol__buton konsol__buton--a"></span>
                  <span class="konsol__buton konsol__buton--b"></span>
                </div>
              </div>

              <span class="konsol__led"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kategori şeridi -->
    <section class="container home-bolum">
      <div class="kategori-serit">
        <router-link
          v-for="kategori in kategoriler"
          :key="kategori.ad"
          :to="{ path: '/urunler', query: { kategori: kategori.deger } }"
          class="kategori-kutu"
        >
          <span class="kategori-kutu__ikon">{{ kategori.ikon }}</span>
          <h3 class="kategori-kutu__ad">{{ kategori.ad }}</h3>
          <span class="kategori-kutu__adet">{{ kategori.adet }} ürün</span>
        </router-link>
      </div>
    </section>

    <!-- Öne çıkan konsollar: veritabanındaki Konsol kategorisinden ilk 4 ürün -->
    <section v-if="oneCikanKonsollar.length" class="container home-bolum">
      <div class="home-bolum__ust">
        <h2 class="home-bolum__baslik">Öne Çıkan Konsollar</h2>
        <router-link
          :to="{ path: '/urunler', query: { kategori: 'Konsol' } }"
          class="home-bolum__link"
        >
          Tümünü Gör →
        </router-link>
      </div>

      <div class="oyun-grid">
        <article v-for="konsol in oneCikanKonsollar" :key="konsol.p_id" class="oyun-kart">
          <div class="oyun-kart__gorsel-alan oyun-kart__gorsel-alan--konsol">
            <img
              v-if="konsol.p_image"
              class="oyun-kart__gorsel oyun-kart__gorsel--foto"
              :src="konsol.p_image"
              :alt="konsol.p_name"
              loading="lazy"
            />
            <span v-else class="oyun-kart__ikon">🕹️</span>
            <span class="oyun-kart__platform">{{ platformAdi(konsol.p_name) }}</span>
          </div>

          <div class="oyun-kart__govde">
            <h3 class="oyun-kart__ad">{{ konsol.p_name }}</h3>
            <p class="oyun-kart__tur">{{ kisaOzellik(konsol.p_desc) }}</p>
            <span class="oyun-kart__fiyat">
              <s v-if="indirimli(konsol)" class="oyun-kart__eski-fiyat">{{ fiyatYaz(konsol.p_price) }}</s>
              {{ fiyatYaz(indirimli(konsol) ? konsol.p_disc : konsol.p_price) }}
            </span>
            <router-link
              :to="{ path: '/urunler', query: { kategori: 'Konsol' } }"
              class="btn btn-primary oyun-kart__buton"
            >
              İncele
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- Öne çıkan oyunlar -->
    <section v-if="oneCikanOyunlar.length" class="container home-bolum">
      <div class="home-bolum__ust">
        <h2 class="home-bolum__baslik">Öne Çıkan Oyunlar</h2>
        <router-link
          :to="{ path: '/urunler', query: { kategori: 'Oyun' } }"
          class="home-bolum__link"
        >
          Tümünü Gör →
        </router-link>
      </div>

      <div class="oyun-grid">
        <article v-for="oyun in oneCikanOyunlar" :key="oyun.p_id" class="oyun-kart">
          <div class="oyun-kart__gorsel-alan oyun-kart__gorsel-alan--oyun">
            <img
              class="oyun-kart__gorsel oyun-kart__gorsel--kapak"
              :src="oyun.p_image"
              :alt="oyun.p_name + ' kapak görseli'"
              loading="lazy"
            />
            <span v-if="indirimli(oyun)" class="oyun-kart__platform">İndirim</span>
          </div>

          <div class="oyun-kart__govde">
            <h3 class="oyun-kart__ad">{{ oyun.p_name }}</h3>
            <p class="oyun-kart__tur">{{ kisaOzellik(oyun.p_desc) }}</p>
            <span class="oyun-kart__fiyat">
              <s v-if="indirimli(oyun)" class="oyun-kart__eski-fiyat">{{ fiyatYaz(oyun.p_price) }}</s>
              {{ fiyatYaz(indirimli(oyun) ? oyun.p_disc : oyun.p_price) }}
            </span>
            <router-link
              :to="{ path: '/urunler', query: { kategori: 'Oyun' } }"
              class="btn btn-primary oyun-kart__buton"
            >
              İncele
            </router-link>
          </div>
        </article>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { paraYaz as fiyatYaz } from '../utils/para.js'

const baseUrl = 'http://localhost:3001'

// Kategori şeridi: adetler backend'deki gerçek ürün sayısından gelir,
// tıklanınca Ürünler sayfası o kategoriye filtrelenmiş açılır
const kategoriler = ref([
  { ikon: '🕹️', ad: 'Konsollar', deger: 'Konsol', adet: 0 },
  { ikon: '💿', ad: 'Oyunlar', deger: 'Oyun', adet: 0 },
  { ikon: '🎧', ad: 'Aksesuarlar', deger: 'Aksesuar', adet: 0 },
])

// Anasayfada gösterilecek konsollar: her platformdan (PlayStation, Xbox, Nintendo, Steam)
// görseli olan ve stokta bulunan ilk ürün, en fazla 4
const oneCikanKonsollar = ref([])

// Öne çıkan oyunlar: Oyun kategorisinden stokta olan ilk 4 ürün
const oneCikanOyunlar = ref([])

async function urunleriGetir() {
  try {
    const res = await fetch(`${baseUrl}/api/products`)
    if (!res.ok) return
    const urunler = await res.json()
    kategoriler.value.forEach((k) => {
      k.adet = urunler.filter((u) => u.p_category === k.deger).length
    })
    // Önce her platformdan (PlayStation, Xbox, Nintendo, Steam) birer tane
    // alıyoruz ki liste tek markayla dolmasın. 4 kutu dolmadıysa kalan
    // konsollarla tamamlıyoruz — yoksa tek platform varken bölüm boş kalıyor.
    const uygunKonsollar = urunler.filter(
      (u) => u.p_category === 'Konsol' && u.p_image && u.p_stock > 0
    )

    const secilen = []
    const gorulenPlatformlar = new Set()
    for (const u of uygunKonsollar) {
      const platform = platformAdi(u.p_name)
      if (!gorulenPlatformlar.has(platform)) {
        gorulenPlatformlar.add(platform)
        secilen.push(u)
      }
    }
    for (const u of uygunKonsollar) {
      if (secilen.length >= 4) break
      if (!secilen.includes(u)) secilen.push(u)
    }
    oneCikanKonsollar.value = secilen.slice(0, 4)

    oneCikanOyunlar.value = urunler
      .filter((u) => u.p_category === 'Oyun' && u.p_image && u.p_stock > 0)
      .slice(0, 4)
  } catch {
    // backend kapalıysa adetler 0 kalır, konsol bölümü gizlenir, sayfa yine açılır
  }
}

onMounted(() => {
  urunleriGetir()
})

// "PlayStation 5 Slim 1 TB" → "PlayStation", "Xbox Series X" → "Xbox" gibi kısa rozet
function platformAdi(ad) {
  if (/playstation/i.test(ad)) return 'PlayStation'
  if (/xbox/i.test(ad)) return 'Xbox'
  if (/nintendo/i.test(ad)) return 'Nintendo'
  if (/steam/i.test(ad)) return 'Steam'
  return 'Konsol'
}

// Açıklamanın virgüle kadar olan ilk parçası kısa özellik satırı olarak yeter
// (nokta ile bölünmez, "7.9 inç" gibi ondalıklar bozulmasın)
function kisaOzellik(desc) {
  if (!desc) return ''
  const ilk = desc.split(',')[0]
  return ilk.length > 40 ? ilk.slice(0, 40) + '…' : ilk
}

function indirimli(u) {
  return u.p_disc != null && Number(u.p_disc) < Number(u.p_price)
}
</script>

<style scoped>
/* ===== Hero: CRT ekranı ===== */
.home-hero {
  padding: var(--bosluk-buyuk) 0;
}

.crt {
  position: relative;
  background-color: var(--cerceve);
  border: 6px solid var(--panel);
  box-shadow: var(--golge);
  padding: var(--bosluk-buyuk);
}

/* Scanline deseni — sadece bu bölümde kullanılıyor */
.crt::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.04) 0px,
    rgba(255, 255, 255, 0.04) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
}

.crt__icerik {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bosluk-buyuk);
}

.crt__metin {
  max-width: 65ch;
}

.crt__baslik {
  color: var(--sari);
  margin-bottom: var(--bosluk);
}

.crt__aciklama {
  color: var(--metin);
  margin-bottom: var(--bosluk-buyuk);
}

/* ===== Hareketli pixel konsol =====
   Tek bir görsel dosyası kullanılmıyor; gövde, ekran, d-pad ve butonlar
   kutulardan, hareket de CSS animasyonlarından oluşuyor. */
.konsol {
  position: relative;
  flex-shrink: 0;
  width: 320px;
  padding: 14px 14px 18px;
  background-color: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge-buyuk);
  /* Konsol hafifçe nefes alıyor */
  animation: konsol-salinim 4s ease-in-out infinite;
}

@keyframes konsol-salinim {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
}

/* --- Ekran --- */
.konsol__ekran {
  position: relative;
  height: 150px;
  overflow: hidden;
  background: linear-gradient(180deg, #0d1b3a 0%, #1a1040 100%);
  border: var(--kenar);
}

.konsol__skor {
  position: absolute;
  top: 8px;
  left: 8px;
  font-family: var(--font-baslik);
  font-size: 8px;
  color: var(--turkuaz);
  /* Arcade skoru gibi yanıp sönüyor */
  animation: skor-yanip-son 1.2s steps(1) infinite;
}

@keyframes skor-yanip-son {
  0%,
  60% {
    opacity: 1;
  }
  61%,
  100% {
    opacity: 0.35;
  }
}

/* Arkada sağdan sola akan yıldızlar: derinlik hissi için üç farklı hız */
.konsol__yildiz {
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: var(--metin);
  animation: yildiz-kay linear infinite;
}

.konsol__yildiz--1 {
  top: 26px;
  animation-duration: 2.4s;
}

.konsol__yildiz--2 {
  top: 48px;
  opacity: 0.6;
  animation-duration: 3.6s;
  animation-delay: -1.2s;
}

.konsol__yildiz--3 {
  top: 14px;
  opacity: 0.4;
  animation-duration: 4.8s;
  animation-delay: -2.4s;
}

@keyframes yildiz-kay {
  from {
    left: 100%;
  }
  to {
    left: -6px;
  }
}

/* Zemin şeridi: tekrar eden desen sola kayınca yer akıyormuş gibi görünüyor */
.konsol__zemin {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200%;
  height: 20px;
  background: repeating-linear-gradient(
    90deg,
    var(--turkuaz) 0 10px,
    #1d6f68 10px 20px
  );
  animation: zemin-kay 0.6s linear infinite;
}

@keyframes zemin-kay {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-20px);
  }
}

/* Zıplayan oyuncu */
.konsol__oyuncu {
  position: absolute;
  left: 42px;
  bottom: 20px;
  width: 16px;
  height: 16px;
  background-color: var(--sari);
  box-shadow: inset 0 0 0 3px var(--kirmizi);
  /* Engeller 1.4 sn'de bir çift geldiği için zıplama 0.7 sn: her engele bir zıplama.
     Zirve %63'te, yani engelin tam oyuncunun hizasına geldiği ana denk geliyor. */
  animation: oyuncu-zipla 0.7s cubic-bezier(0.3, 0, 0.4, 1) infinite;
}

@keyframes oyuncu-zipla {
  0%,
  40% {
    bottom: 20px;
  }
  /* Zirvede kısa bir süre asılı kalıyor; en yüksek engel (32px) rahatça altından geçsin */
  58%,
  70% {
    bottom: 68px;
  }
  88%,
  100% {
    bottom: 20px;
  }
}

/* Sağdan gelip oyuncunun altından geçen engeller */
.konsol__engel {
  position: absolute;
  bottom: 20px;
  width: 12px;
  background-color: var(--kirmizi);
  border: 2px solid var(--cerceve);
  animation: engel-gel 1.4s linear infinite;
}

.konsol__engel--1 {
  height: 20px;
}

.konsol__engel--2 {
  height: 28px;
  animation-delay: -0.7s;
}

@keyframes engel-gel {
  from {
    left: 100%;
  }
  to {
    left: -16px;
  }
}

/* --- Kontroller --- */
.konsol__alt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--bosluk-kucuk);
  margin-top: 14px;
}

/* D-pad: iki dikdörtgenin üst üste binmesiyle artı şekli */
.konsol__dpad {
  position: relative;
  width: 46px;
  height: 46px;
}

.konsol__dpad-yatay,
.konsol__dpad-yukari,
.konsol__dpad-asagi {
  position: absolute;
  background-color: var(--cerceve);
  border: 2px solid var(--zemin);
}

.konsol__dpad-yatay {
  top: 15px;
  left: 0;
  width: 46px;
  height: 16px;
}

/* Dikey çubuk tek parça olduğunda rengi değişince yukarı ve aşağı ok
   birlikte yanıyordu. İki ayrı kola bölündü: yalnızca yukarı kol yanıyor.
   Kolların yatay çubuğa değen kenarlarında çizgi yok, artı tek parça görünsün. */
.konsol__dpad-yukari {
  top: 0;
  left: 15px;
  width: 16px;
  height: 17px;
  border-bottom: none;
  /* Oyuncu zıplarken yalnızca yukarı yön basılıyormuş gibi görünsün */
  animation: dpad-bas 0.7s steps(1) infinite;
}

.konsol__dpad-asagi {
  top: 29px;
  left: 15px;
  width: 16px;
  height: 17px;
  border-top: none;
}

@keyframes dpad-bas {
  0%,
  41% {
    background-color: var(--cerceve);
  }
  42%,
  84% {
    background-color: var(--turkuaz);
  }
  85%,
  100% {
    background-color: var(--cerceve);
  }
}

.konsol__hoparlor {
  display: flex;
  gap: 4px;
}

.konsol__hoparlor span {
  width: 4px;
  height: 18px;
  background-color: var(--cerceve);
}

.konsol__butonlar {
  display: flex;
  align-items: flex-end;
  gap: var(--bosluk-kucuk);
}

.konsol__buton {
  width: 22px;
  height: 22px;
  border: 2px solid var(--cerceve);
  animation: buton-bas 0.7s ease-in-out infinite;
}

.konsol__buton--a {
  background-color: var(--kirmizi);
}

.konsol__buton--b {
  background-color: var(--sari);
  animation-delay: -0.35s;
}

@keyframes buton-bas {
  0%,
  70%,
  100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(3px);
  }
}

/* Güç ışığı */
.konsol__led {
  position: absolute;
  top: 20px;
  right: 22px;
  width: 8px;
  height: 8px;
  background-color: var(--kirmizi);
  animation: led-yan 1.6s steps(1) infinite;
}

@keyframes led-yan {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.25;
  }
}

/* Hareketten rahatsız olan kullanıcılar için: her şey durur, konsol yine görünür */
@media (prefers-reduced-motion: reduce) {
  .konsol,
  .konsol *,
  .konsol *::before,
  .konsol *::after {
    animation: none !important;
  }
}

/* ===== Bölüm başlığı ===== */
.home-bolum {
  padding: var(--bosluk-buyuk) var(--bosluk);
}

.home-bolum__ust {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--bosluk);
  flex-wrap: wrap;
}

.home-bolum__link {
  font-family: var(--font-baslik);
  font-size: 10px;
  color: var(--turkuaz);
  text-decoration: none;
  white-space: nowrap;
}

.home-bolum__link:hover {
  color: var(--sari);
}

.home-bolum__baslik {
  color: var(--sari);
  margin-bottom: var(--bosluk-buyuk);
  text-align: center;
}

/* ===== Kategori şeridi ===== */
.kategori-serit {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--bosluk);
}

.kategori-kutu {
  display: block;
  text-align: center;
  text-decoration: none;
  background-color: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge);
  padding: var(--bosluk-buyuk) var(--bosluk);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.kategori-kutu:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--golge-buyuk);
}

.kategori-kutu__ikon {
  font-size: 32px;
  display: block;
  margin-bottom: var(--bosluk);
}

.kategori-kutu__ad {
  color: var(--metin);
  margin-bottom: var(--bosluk-kucuk);
}

.kategori-kutu__adet {
  color: var(--metin-soluk);
  font-size: 15px;
}

/* ===== Oyun kartları ===== */
.oyun-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--bosluk);
}

/* Kart içeriği farklı uzunlukta olsa da butonlar aynı hizada dursun */
.oyun-kart {
  display: flex;
  flex-direction: column;
  background-color: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.oyun-kart:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--golge-buyuk);
}

.oyun-kart__gorsel-alan {
  position: relative;
  border-bottom: var(--kenar);
}

.oyun-kart__gorsel {
  display: block;
  width: 100%;
  height: auto;
}

/* Oyun kapakları 3:4 kutu oranında tasarlandı, tam otursun */
.oyun-kart__gorsel-alan--oyun {
  aspect-ratio: 3 / 4;
  background-color: var(--zemin);
  overflow: hidden;
}

.oyun-kart__gorsel--kapak {
  height: 100%;
  object-fit: cover;
}

/* Konsol fotoğrafları: sabit oranlı zemin, fotoğraf kırpılmadan sığar, pixel değil net */
.oyun-kart__gorsel-alan--konsol {
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--zemin);
  overflow: hidden;
}

.oyun-kart__gorsel--foto {
  height: 100%;
  object-fit: contain;
  padding: var(--bosluk-kucuk);
  image-rendering: auto;
}

.oyun-kart__ikon {
  font-size: 4rem;
}

.oyun-kart__eski-fiyat {
  display: block;
  font-size: 10px;
  color: var(--metin-soluk);
  margin-bottom: 4px;
}

/* Platform rozeti köşede duruyor */
.oyun-kart__platform {
  position: absolute;
  top: var(--bosluk-kucuk);
  right: var(--bosluk-kucuk);
  font-family: var(--font-baslik);
  font-size: 9px;
  background-color: var(--kirmizi);
  color: #fff;
  border: 2px solid var(--cerceve);
  padding: 5px 7px;
}

.oyun-kart__govde {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: var(--bosluk);
}

.oyun-kart__ad {
  color: var(--metin);
  margin-bottom: var(--bosluk-kucuk);
}

.oyun-kart__tur {
  color: var(--metin-soluk);
  font-size: 15px;
  margin-bottom: var(--bosluk);
}

/* margin-top:auto fiyat ve butonu kartın altına iter */
.oyun-kart__fiyat {
  display: block;
  font-family: var(--font-baslik);
  font-size: 14px;
  color: var(--sari);
  margin-top: auto;
  margin-bottom: var(--bosluk);
}

.oyun-kart__buton {
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
}

/* ===== Responsive ===== */

/* Tablet */
@media (max-width: 768px) {
  .crt {
    padding: var(--bosluk);
  }

  .crt__icerik {
    flex-direction: column;
    text-align: center;
  }

  .oyun-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}

/* Mobil */
@media (max-width: 480px) {
  .kategori-serit,
  .oyun-grid {
    grid-template-columns: 1fr;
  }

  /* Dar ekranda konsol kutuya sığsın, oranı bozulmasın */
  .konsol {
    width: 100%;
    max-width: 320px;
  }
}
</style>
