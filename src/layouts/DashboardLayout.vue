<template>
  <div class="dashboard-shell">
    <!-- Fixed Navbar -->
    <Navbar @toggle-sidebar="handleToggleSidebar" />

    <!-- Layout Body -->
    <div class="dashboard-body">
      <!-- Fixed Sidebar -->
      <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />

      <!-- Main Content Area - Pages inject here via <slot> -->
      <main class="main-content" :class="{ 'sidebar-closed': !isSidebarOpen && isDesktop }">
        <div class="content-wrapper">
          <!-- 🔥 CONTENT INJECTION POINT -->
          <slot />
        </div>
      </main>

      <!-- Mobile Overlay -->
      <Transition name="fade">
        <div v-if="isSidebarOpen && !isDesktop" class="mobile-overlay" @click="closeSidebar"></div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

// --- Sidebar State Management ---
const isSidebarOpen = ref(true)
const windowWidth = ref(1024) // Default to desktop to prevent hydration mismatch

const isDesktop = computed(() => windowWidth.value >= 992)

// Handle responsive behavior
const handleResize = () => {
  windowWidth.value = window.innerWidth
  // Auto-adjust sidebar based on breakpoint
  isSidebarOpen.value = isDesktop.value
}

const handleToggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

// Lifecycle
onMounted(() => {
  windowWidth.value = window.innerWidth
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-shell {
  width: 100%;
  min-height: 100vh;
  margin-left: 0;
  overflow-x: hidden;
  color: #e2e8f0;
}

.dashboard-body {
  display: flex;
  position: relative;
  padding-top: 70px;
  min-height: 100vh;
  width: 100%;
  overflow: hidden; /* Keep this to prevent body scroll */
}

/* Main Content Area - ENABLED SCROLLING */
.main-content {
  flex: 1;
  /* Sync this with Sidebar width (260px) */
  margin-left: 260px; 
  min-width: 0;
  height: calc(100vh - 70px); /* Fixed height to enable scrolling */
  overflow-y: auto; /* ENABLE VERTICAL SCROLLING */
  overflow-x: hidden;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.main-content.sidebar-closed {
  margin-left: 0;
}

.content-wrapper {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Custom scrollbar styling for main content */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1015;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 991px) {
  .main-content {
    margin-left: 0 !important;
    height: calc(100vh - 70px);
  }
  .content-wrapper {
    padding: 1rem;
  }
}
</style>

<style>
html, body, #app {
  height: 100%;
  overflow: hidden !important;
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

html::-webkit-scrollbar, 
body::-webkit-scrollbar, 
#app::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  background: transparent;
}
</style>
