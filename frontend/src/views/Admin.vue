<template>
  <div class="admin">
    <header class="page-header fade-in">
      <h1 class="page-header__title">Admin Paneli</h1>
      <p class="page-header__subtitle">Ürünleri, kullanıcıları, siparişleri ve mesajları buradan yönetin.</p>
    </header>

    <div class="panel-sayfa fade-in">
      <div class="panel-duzen">
        <PanelKenar v-model="secim" baslik="Yönetim Paneli" :sekmeler="sekmeler" />

        <div class="panel-icerik">
          <AdminProducts v-if="secim === 'urunler'" />
          <AdminUsers v-else-if="secim === 'kullanicilar'" />
          <AdminOrders v-else-if="secim === 'siparisler'" />
          <AdminMessages v-else-if="secim === 'mesajlar'" />
          <Test v-else-if="secim === 'test'" gomulu />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PanelKenar from '../components/PanelKenar.vue'
import AdminProducts from '../components/admin/AdminProducts.vue'
import AdminUsers from '../components/admin/AdminUsers.vue'
import AdminOrders from '../components/admin/AdminOrders.vue'
import AdminMessages from '../components/admin/AdminMessages.vue'
import Test from './Test.vue'

const sekmeler = [
  { ad: 'Ürünler', deger: 'urunler' },
  { ad: 'Kullanıcılar', deger: 'kullanicilar' },
  { ad: 'Siparişler', deger: 'siparisler' },
  { ad: 'Mesajlar', deger: 'mesajlar' },
  // Kurs boyunca işlenen Vue / API konularının çalışan örnekleri
  { ad: 'Ders Notları', deger: 'test' },
]

const secim = ref('urunler')
</script>

<style scoped>
/* Panel sayfaları site genelindeki .container'dan (1140px) daha geniş:
   tablolarda çok sütun var, dar alanda hepsi sıkışıyordu. */
.panel-sayfa {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--bosluk);
}

/* Sol menü + içerik: dar ekranda alt alta düşer */
.panel-duzen {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--bosluk);
  align-items: start;
  margin-bottom: 3rem;
}

.panel-icerik {
  background: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge);
  padding: var(--bosluk-buyuk) var(--bosluk);
  min-width: 0;
}

@media (max-width: 767.98px) {
  .panel-duzen {
    grid-template-columns: 1fr;
  }
}
</style>
