// Uygulama genelinde kullanılan bildirim (toast) kuyruğu.
//
// Her panel kendi içinde "işlem başarılı" yazısı tutmak yerine buradan
// basari() / hata() / uyari() çağırır; App.vue'daki <Bildirimler /> bileşeni
// hepsini ekranın sağ üstünde gösterir ve süresi dolunca kaldırır.
import { reactive } from 'vue'

export const bildirimler = reactive([])

// Bildirimin ekranda kalma süresi (ms). Hatalar biraz daha uzun durur.
const SURE = { basari: 3500, uyari: 4500, hata: 6000 }

let sonrakiId = 1

function ekle(tur, metin) {
  if (!metin) return null

  const id = sonrakiId++
  bildirimler.push({ id, tur, metin })

  setTimeout(() => bildirimiKapat(id), SURE[tur] ?? 4000)
  return id
}

export function basari(metin) {
  return ekle('basari', metin)
}

export function uyari(metin) {
  return ekle('uyari', metin)
}

export function hata(metin) {
  return ekle('hata', metin)
}

export function bildirimiKapat(id) {
  const sira = bildirimler.findIndex((b) => b.id === id)
  if (sira !== -1) bildirimler.splice(sira, 1)
}
