<template>
  <div class="auth">
    <div class="auth__card fade-in">
      <!-- Sekmeler: /giris → Giriş Yap, /kayit → Kayıt Ol -->
      <div class="auth__tabs" role="tablist">
        <router-link
          to="/giris"
          class="auth__tab"
          :class="{ 'auth__tab--active': !kayitSekmesi }"
          role="tab"
        >
          Giriş Yap
        </router-link>
        <router-link
          to="/kayit"
          class="auth__tab"
          :class="{ 'auth__tab--active': kayitSekmesi }"
          role="tab"
        >
          Kayıt Ol
        </router-link>
      </div>

      <p class="auth__subtitle">
        {{ kayitSekmesi ? 'LevelUp ailesine katıl.' : 'Hesabına giriş yaparak devam et.' }}
      </p>

      <RegisterForm v-if="kayitSekmesi" />
      <LoginForm v-else />
    </div>
  </div>
</template>

<script setup>
// Giriş ve Kayıt formlarını tek sayfada, sekmeli olarak gösterir.
// Hangi sekmenin açık olduğu URL'den gelir; böylece /kayit linki doğrudan kayıt sekmesini açar.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const route = useRoute()
const kayitSekmesi = computed(() => route.path === '/kayit')
</script>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  padding: 3.5rem 1rem;
}

.auth__card {
  background: var(--panel);
  border: var(--kenar);
  box-shadow: var(--golge-buyuk);
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
}

/* Sekme başlıkları: aktif olan kırmızı kutu, diğeri soluk */
.auth__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.auth__tab {
  flex: 1;
  text-align: center;
  font-family: var(--font-baslik);
  font-size: 12px;
  padding: 0.85rem 0.5rem;
  color: var(--metin-soluk);
  background: var(--zemin);
  border: var(--kenar);
  text-decoration: none;
  white-space: nowrap;
}

.auth__tab:hover {
  color: var(--metin);
}

.auth__tab--active {
  color: #fff;
  background: var(--kirmizi);
  box-shadow: var(--golge);
}

.auth__subtitle {
  color: var(--metin-soluk);
  text-align: center;
  margin-bottom: 1.75rem;
}

@media (max-width: 480px) {
  .auth__card {
    padding: 1.5rem;
  }

  .auth__tab {
    font-size: 10px;
  }
}
</style>
