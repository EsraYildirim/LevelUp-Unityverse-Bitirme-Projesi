// Para biçimlendirme yardımcıları — Türkçe yazım: binlik ayracı ".",
// ondalık ayracı ",". Örnek: 108949.2 → "108.949,20 ₺"
//
// Tüm fiyatlar (anasayfa, ürünler, sepet, admin panelleri) bu tek dosyadan
// biçimlenir ki site genelinde aynı görünsün.

const BICIM = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// Ekranda gösterilen fiyat: "49.999,00 ₺"
export function paraYaz(deger) {
  return BICIM.format(Number(deger) || 0) + ' ₺'
}

// Simgesiz hali (tablo başlığında zaten "₺" yazıyorsa)
export function sayiYaz(deger) {
  return BICIM.format(Number(deger) || 0)
}

// Input içinde gösterilecek hali: gereksiz ",00" yazılmaz → 49999 → "49.999"
export function paraGiris(deger) {
  const sayi = Number(deger)
  if (!Number.isFinite(sayi)) return ''
  return sayi.toLocaleString('tr-TR', { maximumFractionDigits: 2 })
}

// Kullanıcı yazarken binlik noktalarını yerleştirir:
// "100000" → "100.000",  "1234,5" → "1.234,5"
export function paraBicimle(hamDeger) {
  // Rakam ve virgül dışındaki her şeyi at (kullanıcının yazdığı noktalar dahil;
  // binlik noktalarını biz yeniden koyuyoruz)
  const temiz = String(hamDeger ?? '').replace(/[^\d,]/g, '')
  if (!temiz) return ''

  const [tamKisim, ...kalan] = temiz.split(',')

  // Baştaki gereksiz sıfırlar gitsin ("007" → "7"), ama tek "0" kalabilsin
  const tam = tamKisim.replace(/^0+(?=\d)/, '')
  const binlikli = tam.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Virgülden sonrası en fazla 2 hane (kuruş)
  const kurus = kalan.length ? ',' + kalan.join('').slice(0, 2) : ''

  return binlikli + kurus
}

// Biçimli metni sayıya çevirir: "108.949,20" → 108949.2
export function paraOku(metin) {
  if (typeof metin === 'number') return metin

  const temiz = String(metin ?? '')
    .replace(/\./g, '') // binlik noktaları
    .replace(',', '.') // ondalık virgülü
    .replace(/[^\d.]/g, '')

  const sayi = Number(temiz)
  return Number.isFinite(sayi) ? sayi : 0
}
