<template>
  <div class="test">
    <!-- Admin panelinde sekme olarak gömülü kullanıldığında sayfa başlığı gizlenir -->
    <header v-if="!gomulu" class="page-header fade-in">
      <h1 class="page-header__title">Ders Notları</h1>
      <p class="page-header__subtitle">
        Kursta öğrenilenler: her konu kendi ayrı bileşeninde, çalışır örnekle.
      </p>
    </header>

    <div v-else class="test-ust">
      <h2 class="test-baslik">Ders Notları</h2>
      <p class="test-aciklama">
        Kursta öğrenilenler. Her örnek kendi bileşeninde duruyor; kodu
        <code>src/components/examples/</code> klasöründe bulabilirsin.
      </p>
    </div>

    <div class="test-content fade-in" :class="{ container: !gomulu }">
      <VBindExample />
      <VBindSrcExample />
      <SliderExample />
      <VIfElseExample />
      <NotDurumuExample />
      <VShowExample />
      <VForTableExample />
      <SimpleVForExample />
      <ObjectVForExample />
      <VOnExample />
      <VModelNumberAgeExample />
      <VModelNumberMultiplyExample />
      <VModelTrimExample />
      <VModelLazyExample />
      <VModelCheckboxExample />
      <VModelCheckboxListExample />
      <VModelSelectExample />
      <StokDurumuExample />
      <FiltrelemeExample />
      <TodoListExample />
      <ParolaGucuExample />
      <TemaDegistirmeExample />
      <KdvHesaplamaExample />
      <UrunYonetimiExample />
      <AdminPanelExample />
      <ProvideInjectExample />
      <NodeApiExample />
    </div>
  </div>
</template>

<script setup>
// gomulu: Admin panelinin içinde sekme olarak mı gösteriliyor?
defineProps({
  gomulu: { type: Boolean, default: false },
})

// Her örnek kendi bağımsız bileşeninde: veri, mantık ve stil bir arada, birbirinden ayrı
import VBindExample from '../components/examples/VBindExample.vue'
import VBindSrcExample from '../components/examples/VBindSrcExample.vue'
import SliderExample from '../components/examples/SliderExample.vue'
import VIfElseExample from '../components/examples/VIfElseExample.vue'
import NotDurumuExample from '../components/examples/NotDurumuExample.vue'
import VShowExample from '../components/examples/VShowExample.vue'
import VForTableExample from '../components/examples/VForTableExample.vue'
import SimpleVForExample from '../components/examples/SimpleVForExample.vue'
import ObjectVForExample from '../components/examples/ObjectVForExample.vue'
import VOnExample from '../components/examples/VOnExample.vue'
import VModelNumberAgeExample from '../components/examples/VModelNumberAgeExample.vue'
import VModelNumberMultiplyExample from '../components/examples/VModelNumberMultiplyExample.vue'
import VModelTrimExample from '../components/examples/VModelTrimExample.vue'
import VModelLazyExample from '../components/examples/VModelLazyExample.vue'
import VModelCheckboxExample from '../components/examples/VModelCheckboxExample.vue'
import VModelCheckboxListExample from '../components/examples/VModelCheckboxListExample.vue'
import VModelSelectExample from '../components/examples/VModelSelectExample.vue'
import StokDurumuExample from '../components/examples/StokDurumuExample.vue'
import FiltrelemeExample from '../components/examples/FiltrelemeExample.vue'
import TodoListExample from '../components/examples/TodoListExample.vue'
import ParolaGucuExample from '../components/examples/ParolaGucuExample.vue'
import TemaDegistirmeExample from '../components/examples/TemaDegistirmeExample.vue'
import KdvHesaplamaExample from '../components/examples/KdvHesaplamaExample.vue'
import UrunYonetimiExample from '../components/examples/UrunYonetimiExample.vue'
import AdminPanelExample from '../components/examples/AdminPanelExample.vue'
import ProvideInjectExample from '../components/examples/ProvideInjectExample.vue'
import NodeApiExample from '../components/examples/NodeApiExample.vue'
</script>

<style scoped>
.test-ust {
  margin-bottom: var(--bosluk-buyuk);
}

.test-baslik {
  font-size: 14px;
  color: var(--sari);
  margin-bottom: var(--bosluk-kucuk);
}

.test-aciklama {
  color: var(--metin-soluk);
  margin: 0;
}

.test-aciklama code {
  color: var(--turkuaz);
}

.test-content {
  padding-bottom: 3rem;
  text-align: center;
  color: var(--metin-soluk);
}
</style>
