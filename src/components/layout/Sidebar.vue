<template>
  <aside :class="['novia-sidebar', { 'is-open': isOpen, 'is-mobile': !isDesktop }]">

    <!-- Overlay (Mobile) -->
    <div v-if="isOpen && !isDesktop" class="sidebar-overlay" @click="$emit('close')"></div>

    <div class="sidebar-content">
      <!-- Mobile Header -->
      <div class="sidebar-mobile-header">
        <div class="brand-sm">
          <i class="bi bi-hexagon-fill"></i>
          <span>Novia</span>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Main Menu Group -->
        <div class="nav-group">
          <span class="nav-label" style="font-size: 14px;">ម៉ឺនុយ</span>
          <ul>
            <li v-for="item in menuItems" :key="item.key">
              <router-link :to="item.to" class="nav-link" :class="{ active: isRouteActive(item.to) }"
                @click="closeSidebarOnMobile">
                <span class="link-icon">
                  <i :class="['bi', item.icon]"></i>
                </span>
                <span class="link-text">{{ item.label }}</span>
                <span v-if="isRouteActive(item.to)" class="active-indicator"></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Settings Group -->
        <div class="nav-group">
          <span class="nav-label" style="font-size: 14px;">កំណត់</span>
          <ul>
            <li v-for="item in settingsItems" :key="item.key">
              <router-link :to="item.to" class="nav-link" :class="{ active: isRouteActive(item.to) }"
                @click="closeSidebarOnMobile">
                <span class="link-icon">
                  <i :class="['bi', item.icon]"></i>
                </span>
                <span class="link-text">{{ item.label }}</span>
                <span v-if="isRouteActive(item.to)" class="active-indicator"></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Help Group -->
        <div class="nav-group">
          <span class="nav-label" style="font-size: 14px;">ជំនួយ</span>
          <ul>
            <li v-for="item in helpItems" :key="item.key">
              <router-link :to="item.to" class="nav-link" :class="{ active: isRouteActive(item.to) }"
                @click="closeSidebarOnMobile">
                <span class="link-icon">
                  <i :class="['bi', item.icon]"></i>
                </span>
                <span class="link-text">{{ item.label }}</span>
                <span v-if="isRouteActive(item.to)" class="active-indicator"></span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Logout (Static) -->
        <div class="nav-group bottom">
          <span class="nav-label" style="font-size: 14px;">គណនី</span>
          <button class="nav-link logout" @click="showLogoutModal = true">
            <span class="link-icon">
              <i class="bi bi-box-arrow-left"></i>
            </span>
            <span class="link-text">ចាកចេញ</span>
          </button>
        </div>
      </nav>
    </div>
  </aside>

  <!-- Logout Confirmation Modal (Unchanged) -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
        <Transition name="slide-up">
          <div v-if="showLogoutModal" class="modal-box" role="dialog" aria-modal="true">
            <div class="modal-icon"><i class="bi bi-box-arrow-left"></i></div>
            <h5 class="modal-title">តើអ្នកចង់ចាកចេញពិតប្រាកដដែលទេ?</h5>
            <p class="modal-desc">ព័ត៌មានរបស់អ្នកចាកចេញ</p>
            <div class="modal-actions">
              <button class="btn-cancel" :disabled="isLoggingOut" @click="showLogoutModal = false">បោះបង់</button>
              <button class="btn-logout" :disabled="isLoggingOut" @click="handleLogout">
                <span v-if="isLoggingOut" class="spinner"></span>
                <i v-else class="bi bi-box-arrow-left"></i>
                {{ isLoggingOut ? 'Logging out...' : 'ចាកចេញ' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStores } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const auth = useAuthStores()
const router = useRouter()
const route = useRoute()

const windowWidth = ref(window.innerWidth)
const isDesktop = computed(() => windowWidth.value >= 992)

const menuItems = [
  { key: 'home', label: 'ទំព័រដើម', icon: 'bi-house-door', to: '/home' },
  { key: 'messages', label: 'សារ', icon: 'bi-chat-dots', to: '/messages' },
]
const settingsItems = [
  { key: 'settings', label: 'ការកំណត់', icon: 'bi-gear', to: '/settings' },
  { key: 'privacy', label: 'ឯកសារឯកជន', icon: 'bi-shield-check', to: '/privacy' },
]
const helpItems = [
  { key: 'about', label: 'អំពីពួកយើង', icon: 'bi-info-circle', to: '/about' },
  { key: 'faq', label: 'សំណួរ', icon: 'bi-question-circle', to: '/faq' },
  { key: 'help', label: 'ជំនួយ', icon: 'bi-life-preserver', to: '/help' },
]

const isRouteActive = (itemPath) => {
  if (itemPath === '/home') return route.path === '/home' || route.path === '/'
  return route.path.startsWith(itemPath)
}

const closeSidebarOnMobile = () => { if (!isDesktop.value) emit('close') }

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)
const handleLogout = async () => {
  isLoggingOut.value = true
  try { await auth.logout() } catch { localStorage.removeItem('token') }
  finally {
    showLogoutModal.value = false
    isLoggingOut.value = false
    router.push('/login')
  }
}

const handleResize = () => { windowWidth.value = window.innerWidth }
onMounted(() => { window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize) })
watch(() => props.isOpen, (val) => {
  if (!isDesktop.value) document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.novia-sidebar {
  width: 260px;
  height: calc(100vh - 70px);
  position: fixed;
  left: 0;
  top: 70px;
  background: rgba(255, 255, 255, 0.98);
  border-right: 1px solid #e2e8f0;
  z-index: 1040;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.novia-sidebar.is-mobile {
  transform: translateX(-100%);
  top: 0;
  height: 100vh;
}

.novia-sidebar.is-mobile.is-open {
  transform: translateX(0);
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Reduced from 1.5rem 1rem */
  padding: 0.75rem 0.85rem;
  overflow-y: auto;
}

.sidebar-mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  /* Reduced from 2rem */
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

@media (max-width: 991px) {
  .sidebar-mobile-header {
    display: flex;
  }
}

.brand-sm {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
}

.brand-sm i {
  color: #6366f1;
  font-size: 1.35rem;
}

.close-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #f1f5f9;
  border: none;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-group {
  margin-bottom: 1rem;
}

.nav-group.bottom {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.nav-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  font-weight: 600;
  /* Reduced from 0.75rem */
  margin-bottom: 0.35rem;
  padding-left: 0.75rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  /* Added small gap between li items */
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.nav-link:hover {
  background: #f8fafc;
  color: #6366f1;
  transform: translateX(3px);
}

.nav-link.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 10px -2px rgba(99, 102, 241, 0.2);
}

.link-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.nav-link:hover .link-icon {
  background: rgba(99, 102, 241, 0.08);
}

.nav-link.active .link-icon {
  background: rgba(255, 255, 255, 0.15);
}

.link-text {
  flex: 1;
  font-size: 0.9rem;
}

.active-indicator {
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.nav-link.logout {
  color: #ef4444;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.nav-link.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(2px);
  z-index: 1030;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.modal-box {
  background: #ffffff;
  border-radius: 14px;
  padding: 2rem 2rem 1.75rem;
  width: 100%;
  max-width: 390px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 26px;
  color: #dc3545;
}

.modal-title {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.modal-desc {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.75rem;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel,
.btn-logout {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.15s;
}

.btn-cancel {
  border: 1px solid #dee2e6;
  background: transparent;
  color: #6c757d;
}

.btn-logout {
  border: none;
  background: #fff0f0;
  color: #dc3545;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #f5c6cb;
  border-top-color: #dc3545;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>