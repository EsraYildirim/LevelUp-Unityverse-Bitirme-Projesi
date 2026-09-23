// Oturum (giriş) durumu
// ---------------------------------------------------------------------------
// Giriş bilgisi sessionStorage'da tutulur: sekme kapanınca oturum da kapanır.
// sessionStorage reaktif olmadığı için ekranların anında güncellenmesi adına
// aynı bilgiyi bir reactive nesnede de tutuyoruz.
import { reactive } from 'vue'

const baseUrl = 'http://localhost:3001'

// Roller: 0 = Kullanıcı, 1 = Admin (veritabanındaki u_role ile aynı)
export const ROL_KULLANICI = 0
export const ROL_ADMIN = 1

export const oturum = reactive({
  girisYapildi: false,
  rol: ROL_KULLANICI,
  kullaniciId: null,
  isim: '',
})

// Giriş başarılı olduğunda backend'den dönen kullanıcıyı oturuma yazar
export function girisYap(kullanici) {
  sessionStorage.setItem('isLoggedIn', 'true')
  sessionStorage.setItem('role', kullanici.u_role)
  sessionStorage.setItem('userId', kullanici.u_id)

  oturum.girisYapildi = true
  oturum.rol = Number(kullanici.u_role)
  oturum.kullaniciId = Number(kullanici.u_id)
  oturum.isim = kullanici.u_firstName ?? ''
}

export function cikisYap() {
  sessionStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('role')
  sessionStorage.removeItem('userId')

  oturum.girisYapildi = false
  oturum.rol = ROL_KULLANICI
  oturum.kullaniciId = null
  oturum.isim = ''
}

// Sayfa yenilendiğinde reactive nesneyi sessionStorage'dan doldurur
export function oturumuYukle() {
  oturum.girisYapildi = sessionStorage.getItem('isLoggedIn') === 'true'
  oturum.rol = Number(sessionStorage.getItem('role') ?? ROL_KULLANICI)
  const id = sessionStorage.getItem('userId')
  oturum.kullaniciId = id ? Number(id) : null

  // Ad oturumda tutulmuyor, backend'den okunuyor (/api/getUsername)
  if (oturum.girisYapildi && oturum.kullaniciId) kullaniciAdiniGetir()
}

// Giriş yapan kullanıcının adını getirir; panelde "Hoş geldin X" için kullanılır
export async function kullaniciAdiniGetir() {
  try {
    const res = await fetch(`${baseUrl}/api/getUsername`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: oturum.kullaniciId }),
    })
    if (!res.ok) return
    oturum.isim = await res.json()
  } catch {
    // backend kapalıysa ad boş kalır, oturum yine geçerlidir
  }
  return oturum.isim
}

// Giriş yapan rolün gideceği panel
export function panelYolu() {
  return oturum.rol === ROL_ADMIN ? '/admin' : '/hesabim'
}
