// Vue Router konfigürasyonu
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Products from './views/Products.vue'
import Auth from './views/Auth.vue'
import Contact from './views/Contact.vue'
import Checkout from './views/Checkout.vue'
import Admin from './views/Admin.vue'
import Hesabim from './views/Hesabim.vue'
import Forbidden from './views/Forbidden.vue'
import Test from './views/Test.vue'
import { oturum, ROL_ADMIN, ROL_KULLANICI } from './utils/oturum.js'

// Rota tanımları
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/hakkimizda', name: 'About', component: About },
  { path: '/urunler', name: 'Products', component: Products },
  { path: '/iletisim', name: 'Contact', component: Contact },
  { path: '/odeme', name: 'Checkout', component: Checkout },
  // Giriş ve Kayıt aynı sayfada sekme olarak; URL hangi sekmenin açık olduğunu belirler
  { path: '/giris', name: 'Login', component: Auth },
  { path: '/kayit', name: 'Register', component: Auth },
  // meta.girisGerekli : giriş yapmış olmak şart
  // meta.roller       : yalnızca bu rollerdekiler girebilir (dizi)
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { girisGerekli: true, roller: [ROL_ADMIN] },
  },
  {
    path: '/hesabim',
    name: 'Hesabim',
    component: Hesabim,
    meta: { girisGerekli: true, roller: [ROL_KULLANICI] },
  },
  { path: '/403', name: 'Forbidden', component: Forbidden },
  // Test sayfası admin panelinde bir sekme; doğrudan adresle de yalnızca admin girebilir
  { path: '/test', name: 'Test', component: Test, meta: { girisGerekli: true, roller: [ROL_ADMIN] } },
  // Tanımsız adresler de 403 yerine anlaşılır bir sayfaya düşsün
  { path: '/:hepsi(.*)', name: 'NotFound', component: Forbidden },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Sayfa korumaları: yetkisiz erişimde 403, giriş yoksa giriş sayfası
router.beforeEach((to) => {
  // Korumalı sayfa ama giriş yapılmamış → giriş sayfası
  if (to.meta.girisGerekli && !oturum.girisYapildi) return '/giris'

  // Sayfa belirli rollere açık ve kullanıcının rolü listede değil → 403
  if (to.meta.roller && !to.meta.roller.includes(oturum.rol)) return '/403'

  return true
})

export default router
