// Paylaşılan form doğrulama yardımcıları
// Tüm formlarda (Kayıt Ol, İletişim, Admin > Kullanıcı Ekle vb.) aynı kurallar
// tekrar tekrar yazılmasın diye burada tek bir yerde tanımlanır.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Email formatını kontrol eder (örn. ornek@mail.com)
export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email)
}

// Bir input değerinden rakam olmayan karakterleri temizler, istenen hane kadar bırakır
export function filterDigits(rawValue, maxLength) {
  return rawValue.replace(/\D/g, '').slice(0, maxLength)
}

// Bir input değerinden rakam olmayan karakterleri temizler, en fazla 11 hane bırakır
export function filterPhoneDigits(rawValue) {
  return filterDigits(rawValue, 11)
}

// Telefon numarasının 10-11 haneli olup olmadığını kontrol eder
export function isValidPhone(tel) {
  return tel.length >= 10 && tel.length <= 11
}

// Ülkeye göre değişen hane sayısı için: Hollanda 9, Türkiye 10, Almanya 10-11 ...
export function isValidPhoneRange(tel, enAz, enCok) {
  return tel.length >= enAz && tel.length <= enCok
}

// Ad/soyad: yalnızca harf, boşluk, kesme işareti ve tire.
// Türkçe harfler de geçerli (Ayşe, Gülçin, İlknur...)
// Temizlik için g bayraklı, kontrol için baysız sürüm: g bayraklı bir regex'te
// .test() lastIndex'i hatırladığı için art arda çağrılarda yanlış sonuç verir.
const AD_DISI_G = /[^A-Za-zÇĞİÖŞÜçğıöşü\s'-]/g
const AD_DISI = /[^A-Za-zÇĞİÖŞÜçğıöşü\s'-]/

// Girilen metinden rakam ve özel karakterleri temizler
export function filterNameChars(rawValue) {
  return rawValue.replace(AD_DISI_G, '')
}

// En az iki harf içeren, rakamsız bir ad mı?
export function isValidName(ad) {
  const temiz = String(ad ?? '').trim()
  return temiz.length >= 2 && !AD_DISI.test(temiz)
}

// input @input olayında: rakam/özel karakter daha yazılırken engellenir
export function onNameInput(event, updateFn) {
  const filtered = filterNameChars(event.target.value)
  updateFn(filtered)
  event.target.value = filtered
}

// T.C. Kimlik No 11 haneli olmalıdır
export function isValidTC(tc) {
  return tc.length === 11
}

// Kart numarası 16 haneli olmalıdır
export function isValidCardNumber(number) {
  return number.length === 16
}

// CVV 3 haneli olmalıdır
export function isValidCvv(cvv) {
  return cvv.length === 3
}

// Son kullanma tarihi AA/YY biçiminde ve geçmiş bir tarih olmamalı (örn. 02/31)
export function isValidExpiry(value) {
  const eslesme = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!eslesme) return false

  const ay = Number(eslesme[1])
  const yil = Number(eslesme[2])
  if (ay < 1 || ay > 12) return false

  // İki haneli yılı 2000'li yıllara çeviriyoruz: 31 → 2031
  const bugun = new Date()
  const buYil = bugun.getFullYear() % 100
  const buAy = bugun.getMonth() + 1
  if (yil < buYil) return false
  if (yil === buYil && ay < buAy) return false

  return true
}

// Kullanıcı yazarken "0231" → "02/31" biçimine çevirir
export function formatExpiry(rawValue) {
  const rakamlar = rawValue.replace(/\D/g, '').slice(0, 4)
  if (rakamlar.length <= 2) return rakamlar
  return rakamlar.slice(0, 2) + '/' + rakamlar.slice(2)
}

// Şifre en az 8 karakter olmalıdır
export function isValidPassword(pass) {
  return pass.length >= 8
}

// Şifre ile şifre tekrarının aynı olup olmadığını kontrol eder
export function passwordsMatch(pass, repeatPass) {
  return pass === repeatPass
}

// input @input olayında kullanılan hazır yardımcı: hem ref'i hem native DOM
// değerini eşitler (Vue, ref değişmediğinde DOM'u yeniden yazmayabilir)
export function onDigitsInput(event, maxLength, updateFn) {
  const filtered = filterDigits(event.target.value, maxLength)
  updateFn(filtered)
  event.target.value = filtered
}

// Telefon alanları için kısayol (en fazla 11 hane)
export function onPhoneInput(event, updateFn) {
  onDigitsInput(event, 11, updateFn)
}
