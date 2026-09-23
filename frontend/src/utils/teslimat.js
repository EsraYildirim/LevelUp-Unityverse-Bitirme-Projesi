// Teslimat bilgileri: ülke listesi, her ülkenin şehirleri ve telefon kodu.
// Ödeme sayfasındaki Ülke / Şehir / Telefon alanları bu tek kaynaktan beslenir;
// ülke değişince şehir listesi ve telefon kodu buradan otomatik güncellenir.
//
// telHane: o ülkede alan kodu hariç beklenen hane sayısı [en az, en çok]
export const ULKELER = [
  {
    ad: 'Türkiye',
    telKodu: '+90',
    telHane: [10, 10],
    sehirler: [
      'İstanbul',
      'Ankara',
      'İzmir',
      'Bursa',
      'Antalya',
      'Adana',
      'Konya',
      'Gaziantep',
      'Kayseri',
      'Trabzon',
    ],
  },
  {
    ad: 'Almanya',
    telKodu: '+49',
    telHane: [10, 11],
    sehirler: ['Berlin', 'Münih', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf'],
  },
  {
    ad: 'Hollanda',
    telKodu: '+31',
    telHane: [9, 9],
    sehirler: ['Amsterdam', 'Rotterdam', 'Lahey', 'Utrecht', 'Eindhoven', 'Groningen'],
  },
  {
    ad: 'Avusturya',
    telKodu: '+43',
    telHane: [10, 11],
    sehirler: ['Viyana', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
  },
  {
    ad: 'Belçika',
    telKodu: '+32',
    telHane: [9, 9],
    sehirler: ['Brüksel', 'Anvers', 'Gent', 'Bruges', 'Liege'],
  },
  {
    ad: 'Fransa',
    telKodu: '+33',
    telHane: [9, 9],
    sehirler: ['Paris', 'Marsilya', 'Lyon', 'Toulouse', 'Nice', 'Bordeaux', 'Strazburg'],
  },
  {
    ad: 'İngiltere',
    telKodu: '+44',
    telHane: [10, 10],
    sehirler: ['Londra', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow', 'Edinburgh'],
  },
]

// Ülke adından o ülkenin kaydını bulur; bilinmeyen ad gelirse ilk ülkeye düşer
export function ulkeyiBul(ad) {
  return ULKELER.find((u) => u.ad === ad) ?? ULKELER[0]
}
