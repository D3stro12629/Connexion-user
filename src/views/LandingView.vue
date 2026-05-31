<template>
  <div class="landing-wrapper">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg sticky-top navbar-glass">
      <div class="container">
        <div class="navbar-brand d-flex align-items-center">
          <div class="logo-icon me-2">
            <i class="bi bi-hexagon-fill"></i>
          </div>
          <span class="brand-text">Connexion</span>
        </div>
        <div class="d-flex align-items-center gap-2 gap-md-3">
          <router-link to="/login" class="nav-link fw-semibold px-3 d-none d-sm-block">
            ចូលគណនី
          </router-link>
          <router-link to="/register" class="btn btn-primary-custom px-4 shadow-sm">
            ចាប់ផ្តើមឥឡូវនេះ
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section position-relative overflow-hidden">
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <div class="container position-relative">
        <div class="row align-items-center min-vh-80 py-4">
          <div class="col-lg-6 hero-content text-center text-lg-start">
            <div class="badge-premium mb-4 animate-up">
              <span class="pulse-dot"></span> 🚀 វេទិកាសម្រាប់អ្នកជំនាញលេខ ១ នៅកម្ពុជា
            </div>
            <h1 class="display-3 fw-black mb-4 leading-tight">
              ពង្រីក <br> <span class="text-gradient">បណ្តាញទំនាក់ទំនង</span> <br>
              វិជ្ជាជីវៈរបស់អ្នក
            </h1>
            <p class="lead text-secondary mb-5 pe-lg-5 fs-5">
              <b>Connexion</b> គឺជាកន្លែងដែលអ្នកជំនាញជួបគ្នា ចែករំលែកចំណេះដឹង និងស្វែងរកឱកាសការងារថ្មីៗ
              ដើម្បីកសាងអនាគតដ៏ភ្លឺស្វាង។
            </p>
            <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <router-link to="/register" class="btn btn-primary-lg px-5 py-3 shadow-lg">
                ចូលរួមឥឡូវនេះ — ដោយឥតគិតថ្លៃ
              </router-link>
              <a href="#features" class="btn btn-outline-secondary px-5 py-3">
                ស្វែងយល់បន្ថែម
              </a>
            </div>
            
            <div class="mt-5 d-flex align-items-center justify-content-center justify-content-lg-start gap-3">
              <div class="avatar-group">
                <img src="https://i.pravatar.cc/100?u=1" alt="user">
                <img src="https://i.pravatar.cc/100?u=2" alt="user">
                <img src="https://i.pravatar.cc/100?u=3" alt="user">
                <span class="avatar-more">+500</span>
              </div>
              <p class="mb-0 text-muted small fw-medium">ចូលរួមដោយអ្នកជំនាញជាង ៥,០០០ នាក់</p>
            </div>
          </div>

          <div class="col-lg-6 mt-5 mt-lg-0">
            <div class="hero-image-container">
              <div class="main-image-wrapper">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  alt="Professional collaboration" class="img-fluid hero-img-main" />
              </div>
              <!-- Floating UI Elements -->
              <div class="ui-card card-job shadow-lg animate-float">
                <div class="icon-circle bg-primary"><i class="bi bi-briefcase"></i></div>
                <div>
                  <div class="fw-bold small">ឱកាសការងារថ្មី</div>
                  <div class="text-muted smaller">UI/UX Designer</div>
                </div>
              </div>
              <div class="ui-card card-user shadow-lg animate-float-delayed">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-person-check-fill text-success"></i>
                  <span class="fw-bold small">តភ្ជាប់បណ្តាញថ្មី</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section py-5">
      <div class="container">
        <div class="stats-grid shadow-sm">
          <div class="stat-item">
            <h3>10K+</h3>
            <p>សមាជិកសរុប</p>
          </div>
          <div class="stat-item">
            <h3>500+</h3>
            <p>ក្រុមហ៊ុនចូលរួម</p>
          </div>
          <div class="stat-item">
            <h3>2K+</h3>
            <p>ឱកាសការងារ</p>
          </div>
          <div class="stat-item border-0">
            <h3>99%</h3>
            <p>ភាពពេញចិត្ត</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features-section py-100">
      <div class="container">
        <div class="text-center max-w-700 mx-auto mb-5">
          <h2 class="section-title h1">ហេតុអ្វីត្រូវជ្រើសរើស Connexion?</h2>
          <p class="text-muted fs-5">យើងផ្តល់ជូននូវឧបករណ៍ដ៏សំបូរបែបដើម្បីជួយអ្នកឱ្យរីកចម្រើនក្នុងអាជីព។</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-3" v-for="(f, i) in features" :key="i">
            <div class="feature-card-modern shadow-hover h-100">
              <div :class="['icon-box-lg', f.color]">
                <i :class="['bi', f.icon]"></i>
              </div>
              <h4 class="fw-bold my-4">{{ f.title }}</h4>
              <p class="text-muted line-height-relaxed">
                {{ f.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works py-100 bg-light-soft">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <h2 class="display-5 fw-bold mb-4">តើវាដំណើរការយ៉ាងដូចម្តេច?</h2>
            <p class="text-muted mb-5">ត្រឹមតែ ៣ ជំហានងាយៗ ដើម្បីចាប់ផ្តើមពង្រីកពិភពវិជ្ជាជីវៈរបស់អ្នក។</p>

            <div class="step-list">
              <div class="step-item mb-4">
                <div class="step-number">១</div>
                <div>
                  <h5 class="fw-bold">បង្កើតប្រវត្តិរូប</h5>
                  <p class="text-muted small">បង្ហាញពីជំនាញ បទពិសោធន៍ និងស្នាដៃរបស់អ្នក។</p>
                </div>
              </div>
              <div class="step-item mb-4">
                <div class="step-number">២</div>
                <div>
                  <h5 class="fw-bold">ស្វែងរកការតភ្ជាប់</h5>
                  <p class="text-muted small">ស្វែងរកអ្នកជំនាញ និងក្រុមហ៊ុនដែលត្រូវនឹងគោលដៅរបស់អ្នក។</p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">៣</div>
                <div>
                  <h5 class="fw-bold">រីកចម្រើនជាមួយគ្នា</h5>
                  <p class="text-muted small">ចែករំលែកចំណេះដឹង និងចាប់យកឱកាសការងារដែលអ្នកស្រមៃ។</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-7 mt-5 mt-lg-0">
            <div class="video-mockup shadow-2xl">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop"
                class="img-fluid rounded-4" alt="dashboard">
              <div class="play-button"><i class="bi bi-play-fill"></i></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-wrapper py-100">
      <div class="container">
        <div class="cta-card-gradient shadow-lg p-5 text-center text-white position-relative">
          <div class="cta-content">
            <h2 class="fw-bold mb-3 display-5">ត្រៀមខ្លួនសម្រាប់ជំហានបន្ទាប់ហើយឬនៅ?</h2>
            <p class="mb-5 opacity-75 lead fs-4">ចូលរួមជាមួយបណ្តាញអ្នកជំនាញដ៏ធំបំផុតនៅក្នុងដៃរបស់អ្នក។</p>
            <router-link to="/register" class="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow">
              ចុះឈ្មោះដោយឥតគិតថ្លៃឥឡូវនេះ
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer-section py-5 bg-dark text-white">
      <div class="container">
        <div class="row gy-5">
          <div class="col-lg-4">
            <div class="d-flex align-items-center mb-4">
              <div class="logo-icon-sm me-2"><i class="bi bi-hexagon-fill"></i></div>
              <span class="fw-bold fs-3">Connexion</span>
            </div>
            <p class="text-gray-400 mb-4">
              យើងប្តេជ្ញាបង្កើតពិភពលោកមួយដែលការតភ្ជាប់វិជ្ជាជីវៈមានភាពងាយស្រួល និងមានប្រសិទ្ធភាពបំផុត។
            </p>
            <div class="social-links d-flex gap-3">
              <a href="#" class="social-btn"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-btn"><i class="bi bi-telegram"></i></a>
              <a href="#" class="social-btn"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div class="col-6 col-lg-2 offset-lg-2">
            <h6 class="fw-bold mb-4">ក្រុមហ៊ុន</h6>
            <ul class="list-unstyled footer-links">
              <li><a href="#">អំពីយើង</a></li>
              <li><a href="#">អាជីព</a></li>
              <li><a href="#">ព័ត៌មាន</a></li>
            </ul>
          </div>

          <div class="col-6 col-lg-2">
            <h6 class="fw-bold mb-4">ជំនួយ</h6>
            <ul class="list-unstyled footer-links">
              <li><a href="#">មជ្ឈមណ្ឌលជំនួយ</a></li>
              <li><a href="#">គោលការណ៍ឯកជនភាព</a></li>
              <li><a href="#">លក្ខខណ្ឌប្រើប្រាស់</a></li>
            </ul>
          </div>

          <div class="col-lg-2">
            <h6 class="fw-bold mb-4">ទាញយកកម្មវិធី</h6>
            <div class="d-grid gap-2">
              <button class="btn btn-outline-light btn-sm px-3 py-2"><i class="bi bi-apple me-2"></i> App Store</button>
              <button class="btn btn-outline-light btn-sm px-3 py-2"><i class="bi bi-google-play me-2"></i> Play
                Store</button>
            </div>
          </div>
        </div>
        <hr class="my-5 border-secondary">
        <div class="text-center text-gray-500 small">
          © ២០២៦ Connexion. រក្សាសិទ្ធិគ្រប់យ៉ាង។ កសាងឡើងដោយក្តីស្រឡាញ់នៅកម្ពុជា។
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // Force reset body styles
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  document.body.style.position = 'static';

  // Remove any leftover Bootstrap modal backdrops that might block scrolling
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(b => b.remove());
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Inter:wght@400;600;700;800&display=swap');

/* Add this at the top of your <style scoped> */
:deep(html),
:deep(body) {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  height: auto !important;
}

.landing-wrapper {
  /* Ensure the wrapper doesn't trap the scroll */
  min-height: 100vh;
  display: block;
}

.landing-wrapper {
  font-family: 'Kantumruy Pro', 'Inter', sans-serif;
  color: #1e293b;
  background-color: #ffffff;
  overflow-x: hidden;
}

/* --- Layout Elements --- */
.min-vh-80 {
  min-height: 80vh;
}

.py-100 {
  padding: 100px 0;
}

.bg-light-soft {
  background-color: #f8fafc;
}

.text-gray-400 {
  color: #94a3b8;
}

.text-gray-500 {
  color: #64748b;
}

/* --- Typography --- */
.fw-black {
  font-weight: 800;
}

.leading-tight {
  line-height: 1.2;
}

.text-gradient {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- Glass Navbar --- */
.navbar-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.75rem 0;
}

.logo-icon {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.5rem;
}

/* --- Hero Section --- */
.hero-section {
  background: #ffffff;
  padding-bottom: 50px;
}

.hero-bg-shapes .shape {
  position: absolute;
  filter: blur(100px);
  z-index: 0;
  border-radius: 50%;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.15);
  top: -100px;
  right: -50px;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: rgba(168, 85, 247, 0.1);
  bottom: -150px;
  left: -100px;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: rgba(236, 72, 153, 0.08);
  top: 20%;
  left: 30%;
}

.badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.85rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.btn-primary-custom {
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary-custom:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

.btn-primary-lg {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-primary-lg:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4) !important;
}

/* --- Hero Image --- */
.hero-image-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.main-image-wrapper {
  position: relative;
  padding: 15px;
  background: white;
  border-radius: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.hero-img-main {
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
}

.ui-card {
  position: absolute;
  background: white;
  padding: 15px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;
}

.card-job {
  top: 10%;
  left: -30px;
}

.card-user {
  bottom: 15%;
  right: -20px;
}

.icon-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: white;
  padding: 40px;
  border-radius: 24px;
  margin-top: -60px;
  position: relative;
  z-index: 10;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
  border-right: 1px solid #f1f5f9;
}

.stat-item h3 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 5px;
}

.stat-item p {
  margin: 0;
  color: #64748b;
  font-weight: 500;
}

/* --- Feature Cards --- */
.feature-card-modern {
  background: white;
  padding: 40px 30px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.feature-card-modern:hover {
  transform: translateY(-10px);
  border-color: #6366f1;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.1);
}

.icon-box-lg {
  width: 65px;
  height: 65px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.icon-box-lg.purple {
  background: #f5f3ff;
  color: #7c3aed;
}

.icon-box-lg.success {
  background: #f0fdf4;
  color: #16a34a;
}

.icon-box-lg.primary {
  background: #eff6ff;
  color: #2563eb;
}

.icon-box-lg.warning {
  background: #fffbeb;
  color: #d97706;
}

/* --- Steps --- */
.step-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  min-width: 45px;
  height: 45px;
  background: #6366f1;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}

.video-mockup {
  position: relative;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: white;
  color: #6366f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* --- Testimonials --- */
.testimonial-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}

/* --- CTA Section --- */
.cta-card-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 40px;
  border: none;
  overflow: hidden;
}

.cta-card-gradient::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://www.transparenttextures.com/patterns/cubes.png");
  opacity: 0.1;
}

/* --- Footer --- */
.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: 0.2s;
}

.footer-links a:hover {
  color: white;
  padding-left: 5px;
}

.social-btn {
  width: 40px;
  height: 40px;
  background: #334155;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: 0.3s;
}

.social-btn:hover {
  background: #6366f1;
  transform: scale(1.1);
}

/* --- Avatar Group --- */
.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-group img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  margin-left: -12px;
}

.avatar-group img:first-child {
  margin-left: 0;
}

.avatar-more {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: -12px;
}

/* --- Animations --- */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 5s ease-in-out infinite 1s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 991px) {
  .display-3 {
    font-size: 2.8rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stat-item {
    border: none;
  }

  .ui-card {
    display: none;
  }

  .py-100 {
    padding: 60px 0;
  }
}
</style>
<style>
html,
body {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  height: auto !important;
  position: relative !important;
}

#app {
  height: auto !important;
  overflow: visible !important;
}
</style>