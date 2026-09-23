// Tarih biçimlendirme yardımcıları — Türkçe yazım: gün.ay.yıl
// Örnek: "2026-09-13 21:43:34" → "13.09.2026"
//
// Tüm tarihler (siparişler, mesajlar, hesabım) bu tek dosyadan biçimlenir
// ki site genelinde aynı görünsün. Fiyatlar için karşılığı: utils/para.js
//
// Veritabanı tarihleri db.js'teki dateStrings sayesinde "2026-09-13 21:43:34"
// biçiminde düz metin gelir. Metni new Date()'e vermek yerine parçalarını
// kendimiz ayırıyoruz: tarayıcı saat dilimine göre günü bir gün kaydırabilir.

const TARIH_DESENI = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/

// Metni { gun, ay, yil, saat, dakika } parçalarına ayırır, tanımadıysa null
function parcala(deger) {
  if (!deger) return null

  // Date nesnesi de gelebilir (örn. JSON yerine doğrudan nesne kullanılırsa)
  if (deger instanceof Date) {
    if (isNaN(deger)) return null
    return {
      gun: String(deger.getDate()).padStart(2, '0'),
      ay: String(deger.getMonth() + 1).padStart(2, '0'),
      yil: String(deger.getFullYear()),
      saat: String(deger.getHours()).padStart(2, '0'),
      dakika: String(deger.getMinutes()).padStart(2, '0'),
    }
  }

  const eslesme = TARIH_DESENI.exec(String(deger))
  if (!eslesme) return null

  const [, yil, ay, gun, saat, dakika] = eslesme
  return { gun, ay, yil, saat, dakika }
}

// Ekranda gösterilen tarih: "13.09.2026"
export function tarihYaz(deger) {
  const p = parcala(deger)
  return p ? `${p.gun}.${p.ay}.${p.yil}` : ''
}

// Saatiyle birlikte: "13.09.2026 21:43"
export function tarihSaatYaz(deger) {
  const p = parcala(deger)
  if (!p) return ''
  if (!p.saat) return tarihYaz(deger)
  return `${p.gun}.${p.ay}.${p.yil} ${p.saat}:${p.dakika}`
}

// input type="date" bu biçimi bekler: "2026-09-13"
export function tarihGirisi(deger) {
  const p = parcala(deger)
  return p ? `${p.yil}-${p.ay}-${p.gun}` : ''
}
