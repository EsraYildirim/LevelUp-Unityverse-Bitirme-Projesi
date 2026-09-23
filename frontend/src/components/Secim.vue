<template>
  <!-- Açılır liste (select yerine).
       Tarayıcının kendi <select> menüsü macOS'ta kutunun ÜSTÜNDE açılıyor ve
       bunu CSS ile değiştirmek mümkün değil. Bu bileşen listeyi her zaman
       kutunun ALTINDA açar; klavye ve ekran okuyucu desteği de var. -->
  <div ref="kok" class="secim" :class="{ 'secim--acik': acik }">
    <button
      :id="id"
      ref="tetik"
      type="button"
      class="form-select secim__buton"
      :class="{ 'secim__buton--bos': !secili }"
      :disabled="disabled"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="acik"
      :aria-controls="`${bileşenId}-liste`"
      @click="acKapat"
      @keydown="tusaBasildi"
    >
      {{ secili ? secili.ad : placeholder }}
    </button>

    <!-- Liste body'ye taşınıyor: .fade-in animasyonundaki transform üst
         öğelerde yığın bağlamı (stacking context) oluşturuyor ve liste
         ürün kartlarının ALTINDA kalıyordu. Teleport bu tuzağı aşar,
         ayrıca tablo gibi kaydırmalı kutularda da kırpılmaz. -->
    <Teleport to="body">
      <ul
        v-if="acik"
        :id="`${bileşenId}-liste`"
        ref="listeKutusu"
        class="secim__liste"
        :style="listeKonumu"
        role="listbox"
        :aria-activedescendant="vurgulu >= 0 ? `${bileşenId}-${vurgulu}` : undefined"
        @keydown="tusaBasildi"
      >
        <li
          v-for="(secenek, sira) in normalSecenekler"
          :id="`${bileşenId}-${sira}`"
          :key="secenek.deger"
          class="secim__ogesi"
          :class="{
            'secim__ogesi--vurgulu': sira === vurgulu,
            'secim__ogesi--secili': secenek.deger === modelValue,
          }"
          role="option"
          :aria-selected="secenek.deger === modelValue"
          @click="sec(secenek)"
          @mousemove="vurgulu = sira"
        >
          {{ secenek.ad }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  // ['Konsol', 'Oyun'] ya da [{ ad: 'Kullanıcı', deger: 0 }] kabul eder
  secenekler: { type: Array, required: true },
  placeholder: { type: String, default: 'Seçiniz' },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: undefined },
})
const emit = defineEmits(['update:modelValue'])

const bileşenId = useId()
const kok = ref(null)
const tetik = ref(null)
const listeKutusu = ref(null)
const acik = ref(false)
const vurgulu = ref(-1)

// Liste body'ye taşındığı için konumunu butondan ölçüp kendimiz veriyoruz
const listeKonumu = ref({})

function konumuOlc() {
  const k = tetik.value?.getBoundingClientRect()
  if (!k) return
  listeKonumu.value = {
    position: 'fixed',
    top: `${k.bottom + 4}px`,
    left: `${k.left}px`,
    minWidth: `${k.width}px`,
  }
}

// Düz metin dizisi de, {ad, deger} dizisi de aynı biçime getirilir
const normalSecenekler = computed(() =>
  props.secenekler.map((s) =>
    typeof s === 'object' && s !== null ? { ad: String(s.ad), deger: s.deger } : { ad: String(s), deger: s }
  )
)

const secili = computed(() => normalSecenekler.value.find((s) => s.deger === props.modelValue))

function ac() {
  if (props.disabled) return
  konumuOlc()
  acik.value = true
  const sira = normalSecenekler.value.findIndex((s) => s.deger === props.modelValue)
  vurgulu.value = sira >= 0 ? sira : 0
  // Liste ekranın altına taşarsa yukarı çevir
  nextTick(() => {
    const l = listeKutusu.value?.getBoundingClientRect()
    const k = tetik.value?.getBoundingClientRect()
    if (l && k && l.bottom > window.innerHeight - 8) {
      listeKonumu.value = { ...listeKonumu.value, top: `${Math.max(8, k.top - l.height - 4)}px` }
    }
  })
}

function kapat() {
  acik.value = false
  vurgulu.value = -1
}

function acKapat() {
  acik.value ? kapat() : ac()
}

function sec(secenek) {
  emit('update:modelValue', secenek.deger)
  kapat()
  tetik.value?.focus()
}

function tusaBasildi(olay) {
  const son = normalSecenekler.value.length - 1

  if (!acik.value) {
    // Kapalıyken aşağı/yukarı ok, Enter veya boşluk listeyi açar
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(olay.key)) {
      olay.preventDefault()
      ac()
    }
    return
  }

  switch (olay.key) {
    case 'ArrowDown':
      olay.preventDefault()
      vurgulu.value = vurgulu.value >= son ? 0 : vurgulu.value + 1
      break
    case 'ArrowUp':
      olay.preventDefault()
      vurgulu.value = vurgulu.value <= 0 ? son : vurgulu.value - 1
      break
    case 'Home':
      olay.preventDefault()
      vurgulu.value = 0
      break
    case 'End':
      olay.preventDefault()
      vurgulu.value = son
      break
    case 'Enter':
    case ' ':
      olay.preventDefault()
      if (vurgulu.value >= 0) sec(normalSecenekler.value[vurgulu.value])
      break
    case 'Escape':
    case 'Tab':
      kapat()
      break
  }
}

// Dışarı tıklanınca kapansın.
// Liste body'ye taşındığı için kök öğenin içinde değil; onu da ayrıca
// kontrol etmezsek seçeneğe tıklamak "dışarı tıklama" sayılıp liste
// mousedown anında kapanıyor ve tıklama seçeneğe hiç ulaşmıyor.
function disariTiklandi(olay) {
  const icerde =
    kok.value?.contains(olay.target) || listeKutusu.value?.contains(olay.target)
  if (!icerde) kapat()
}

// Sayfa kaydırılır ya da pencere boyutu değişirse liste butonla birlikte gelsin
function yenidenKonumla() {
  if (acik.value) konumuOlc()
}

watch(acik, (yeni) => {
  const yontem = yeni ? 'addEventListener' : 'removeEventListener'
  document[yontem]('mousedown', disariTiklandi)
  window[yontem]('scroll', yenidenKonumla, true)
  window[yontem]('resize', yenidenKonumla)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', disariTiklandi)
  window.removeEventListener('scroll', yenidenKonumla, true)
  window.removeEventListener('resize', yenidenKonumla)
})
</script>

<style scoped>
.secim {
  position: relative;
}

.secim__buton {
  width: 100%;
  text-align: left;
  cursor: pointer;
  /* Sağdaki ok simgesinin üstüne yazı binmesin; sığmayan değer "..." ile kısalsın */
  padding-right: 2.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Henüz seçim yapılmadıysa yazı soluk (placeholder gibi) */
.secim__buton--bos {
  color: var(--metin-soluk);
}

.secim--acik .secim__buton {
  border-color: var(--turkuaz);
}

</style>

<!-- Liste body'ye taşındığı için scoped olamaz -->
<style>
/* Liste HER ZAMAN kutunun altında açılır (konumu JS ölçer) */
.secim__liste {
  /* Seçenek metnine göre genişler; min-width butondan gelir */
  width: max-content;
  max-width: min(320px, 90vw);
  z-index: 1080;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 260px;
  overflow-y: auto;
  background-color: var(--cerceve);
  border: 3px solid var(--turkuaz);
  box-shadow: var(--golge);
}

.secim__ogesi {
  padding: 9px 12px;
  white-space: nowrap;
  font-family: var(--font-govde);
  font-size: 16px;
  color: var(--metin);
  cursor: pointer;
}

.secim__ogesi--secili {
  color: var(--sari);
}

.secim__ogesi--vurgulu {
  color: #fff;
  background-color: var(--kirmizi);
}
</style>
