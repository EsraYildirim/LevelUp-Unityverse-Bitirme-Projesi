// Bootstrap CSS ve JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Global stiller
import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { oturumuYukle } from './utils/oturum.js'

// Sayfa yenilendiğinde sessionStorage'daki oturumu geri yükle;
// router korumaları çalışmadan önce hazır olmalı.
oturumuYukle()

createApp(App).use(router).mount('#app')
