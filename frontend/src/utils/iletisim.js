// Site genelindeki iletişim bilgileri.
//
// İletişim sayfası ve footer aynı değerleri buradan okur; biri değişince
// diğeri geride kalmaz. (Aynı mantık: utils/para.js, utils/tarih.js)
//
// Adresler örnek amaçlıdır. E-postada ".example" uzantısı kullanılıyor:
// bu uzantı örnek/dokümantasyon için ayrılmıştır, gerçek bir şirketin
// adresine denk gelme ihtimali yoktur.

export const ADRES =
  'Teknopark İstanbul, Teknopark Bulvarı No:1, Sanayi Mah., 34906 Pendik / İstanbul'

// Footer gibi dar alanlarda adresin kısa hali
export const ADRES_KISA = 'Pendik / İstanbul'

export const EPOSTA = 'destek@levelup.example'
export const EPOSTA_LINK = `mailto:${EPOSTA}`

export const TELEFON = '+90 212 555 00 00'
// tel: bağlantısında boşluk olmaz
export const TELEFON_LINK = `tel:${TELEFON.replace(/\s/g, '')}`

export const CALISMA_SAATLERI = 'Pazartesi - Cumartesi 10:00 - 20:00'

// İletişim sayfasındaki bilgi listesi
export const ILETISIM_LISTESI = [
  {
    ikon: '📍',
    baslik: 'Adres',
    deger: ADRES,
  },
  {
    ikon: '✉️',
    baslik: 'E-posta',
    deger: EPOSTA,
    link: EPOSTA_LINK,
    not: 'Siparişler ve iade için',
  },
  {
    ikon: '📞',
    baslik: 'Telefon',
    deger: TELEFON,
    link: TELEFON_LINK,
    not: 'Hafta içi 09:00 - 18:00',
  },
  {
    ikon: '⏰',
    baslik: 'Mağaza Saatleri',
    deger: CALISMA_SAATLERI,
    not: 'Pazar kapalı',
  },
]
