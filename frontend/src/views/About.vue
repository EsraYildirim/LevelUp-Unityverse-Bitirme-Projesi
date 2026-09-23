<template>
  <div class="about">
    <!-- Sayfa Başlığı -->
    <header class="page-header fade-in">
      <h1 class="page-header__title">Hakkımızda</h1>
      <p class="page-header__subtitle">
        LevelUp'ın hikayesini, vizyonunu ve ekibini keşfedin.
      </p>
    </header>

    <div class="container">
      <!-- Şirket Bilgisi -->
      <section class="about-info fade-in">
        <h2 class="about-info__title">Biz Kimiz?</h2>
        <p class="about-info__text">
          2026 yılında kurulan LevelUp, oyun tutkunlarını en kaliteli
          oyunlarla buluşturan bir dijital platformdur. Binlerce oyuncuya
          güvenli, hızlı ve keyifli bir alışveriş deneyimi sunmak için
          çalışıyoruz.
        </p>
      </section>

      <!-- Vizyon ve Misyon -->
      <section class="row g-4 about-vm">
        <div class="col-12 col-md-6 fade-in fade-in--delay-1">
          <div class="about-vm__card">
            <h3 class="about-vm__title">Vizyonumuz</h3>
            <p class="about-vm__text">
              Dünyanın en güvenilir ve en sevilen oyun platformu olmak;
              oyuncuların hayal gücünü sınırsız kılan bir topluluk inşa etmek.
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6 fade-in fade-in--delay-2">
          <div class="about-vm__card">
            <h3 class="about-vm__title">Misyonumuz</h3>
            <p class="about-vm__text">
              Her bütçeye uygun, kaliteli oyunları erişilebilir kılmak ve
              oyunculara kesintisiz, güvenli bir alışveriş deneyimi sunmak.
            </p>
          </div>
        </div>
      </section>

      <!-- İstatistikler -->
      <section class="about-stats fade-in">
        <div class="row g-4 text-center">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="col-6 col-md-3 fade-in"
            :class="`fade-in--delay-${index + 1}`"
          >
            <div class="about-stats__card">
              <div class="about-stats__number">{{ stat.value }}</div>
              <div class="about-stats__label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Ekip Bölümü -->
      <section class="about-team">
        <h2 class="about-team__title fade-in">Ekibimiz</h2>
        <!-- Tek kişilik ekip: kart ortada dursun diye yanlarda boş sütun bırakıyoruz -->
        <div class="row g-4 justify-content-center">
          <div
            v-for="(member, index) in team"
            :key="member.name"
            class="col-12 col-sm-8 col-md-5 col-lg-4 fade-in"
            :class="`fade-in--delay-${index + 1}`"
          >
            <div class="about-team__card">
              <div class="about-team__avatar">{{ member.emoji }}</div>
              <h3 class="about-team__name">{{ member.name }}</h3>
              <p class="about-team__role">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// İstatistik verileri
const stats = [
  { value: '1M+', label: 'Kullanıcı' },
  { value: '5000+', label: 'Oyun' },
  { value: '%99', label: 'Memnuniyet' },
  { value: '7/24', label: 'Destek' },
]

// Ekip üyeleri verisi
const team = [{ name: 'Esra Yıldırım', role: 'Kurucu & CEO', emoji: '👩‍💻' }]
</script>

<style scoped>
.about-info {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 3rem;
}

.about-info__title {
  font-weight: 700;
  margin-bottom: 1rem;
}

.about-info__text {
  color: var(--metin-soluk);
  font-size: 1.05rem;
  line-height: 1.8;
}

.about-vm {
  margin-bottom: 3rem;
}

.about-vm__card {
  background: var(--panel);
  border: var(--kenar);
  padding: 2rem;
  height: 100%;
  box-shadow: var(--golge);
  border-top: var(--kenar);
}

.about-vm__title {
  font-family: var(--font-baslik);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  color: var(--turkuaz);
  margin-bottom: 0.75rem;
}

.about-vm__text {
  color: var(--metin-soluk);
  line-height: 1.7;
  margin-bottom: 0;
}

.about-stats {
  margin-bottom: 3rem;
}

.about-stats__card {
  background: var(--kirmizi);
  color: #fff;
  padding: 1.75rem 1rem;
  box-shadow: var(--golge);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.about-stats__card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--golge-buyuk);
}

.about-stats__number {
  font-family: var(--font-baslik);
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.35);
}

.about-stats__label {
  font-size: 0.95rem;
  opacity: 0.9;
}

.about-team {
  padding-bottom: 3.5rem;
}

.about-team__title {
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
}

.about-team__card {
  background: var(--panel);
  border: var(--kenar);
  padding: 2rem 1rem;
  text-align: center;
  height: 100%;
  box-shadow: var(--golge);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.about-team__card:hover {
  transform: translate(-2px, -2px);
  border-color: var(--cerceve);
  box-shadow: var(--golge-buyuk);
}

.about-team__avatar {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  
}

.about-team__name {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.about-team__role {
  color: var(--sari);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0;
}
</style>
