<script setup>
/* KEEPING EXISTING LOGIC UNCHANGED */
import { ref, onMounted, watch } from 'vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { useToast } from 'vue-toast-notification'
import PostCard from '@/components/PostCard.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import api from '@/api/http'

const postStore     = usePostStore()
const categoryStore = useCategoryStore()
const loading       = ref(true)
const $toast        = useToast()
const searchTab     = ref('feed') // 'feed' | 'people'

watch(() => postStore.searchQuery, () => {
  searchTab.value = 'feed'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const suggestedUsers  = ref([])
const loadingPeople   = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      postStore.fetchPosts(),
      categoryStore.fetchCategory(),
      fetchSuggestedUsers(),
    ])
  } catch (error) {
    $toast.error(error.response?.data?.message || 'បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។')
  } finally {
    loading.value = false
  }
})

async function fetchSuggestedUsers() {
  loadingPeople.value = true
  try {
    const res = await api.get('/api/users/search', { params: { q: '' } })
    if (res.data.result && Array.isArray(res.data.data)) {
      suggestedUsers.value = res.data.data.slice(0, 5)
    }
  } catch {
  } finally {
    loadingPeople.value = false
  }
}

const handlePostCreated = async () => {
  try {
    await postStore.fetchPosts()
    $toast.success('បានបង្កើតការបង្ហោះដោយជោគជ័យ!')
  } catch {
    $toast.error('បរាជ័យក្នុងការធ្វើឱ្យការបង្ហោះថ្មី')
  }
}

const filterByCategory = async (categoryId) => {
  loading.value = true
  try {
    await postStore.fetchPosts('', 1, 20, categoryId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    $toast.error('បរាជ័យក្នុងការច្រោះការបង្ហោះ')
  } finally {
    loading.value = false
  }
}

const loadMorePosts = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const nextPage = postStore.pagination.current_page + 1
    await postStore.fetchPostsAppend('', nextPage)
  } catch {
    $toast.error('បរាជ័យក្នុងការផ្ទុកការបង្ហោះបន្ថែម')
  } finally {
    loading.value = false
  }
}

const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'ព្រឹត្តិការណ៍': 'bi-calendar-event',
    'ការងារហាត់ការ': 'bi-briefcase',
    'ការងារ': 'bi-briefcase-fill',
    'បទបង្ហាញ': 'bi-easel',
    'គម្រោង': 'bi-diagram-3',
    'ការសិក្សា': 'bi-book',
    'ការបង្ហោះ': 'bi-newspaper',
    'ការបង្ហោះទាំងអស់': 'bi-newspaper'
  }
  return 'bi ' + (iconMap[categoryName.toLowerCase()] || 'bi-tag')
}

function userAvatar(user) {
  return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=6366f1&color=fff&size=80`
}
</script>

<template>
  <DashboardLayout>
    <div class="home-page-modern">
      <div class="container-modern">
        <div class="main-grid">
          
          <!-- LEFT SIDEBAR (Optionally added for balance or spacing) -->
          <!-- You can add a profile summary here if needed, otherwise feed takes center -->

          <!-- MAIN FEED COLUMN -->
          <div class="feed-column">
            <!-- COMPOSER SECTION -->
            <div class="glass-card composer-wrapper animate-slide-up">
              <CreatePostView @post-created="handlePostCreated" />
            </div>

            <!-- SEARCH PILL NAVIGATION -->
            <div v-if="postStore.searchQuery" class="modern-tabs animate-fade-in">
              <button
                class="tab-pill"
                :class="{ active: searchTab === 'feed' }"
                @click="searchTab = 'feed'"
              >
                <i class="bi bi-grid-1x2-fill"></i>
                <span>Feed Updates</span>
              </button>
              <button
                class="tab-pill"
                :class="{ active: searchTab === 'people' }"
                @click="searchTab = 'people'"
              >
                <i class="bi bi-people-fill"></i>
                <span>People</span>
                <span v-if="postStore.searchUsers.length" class="count-badge">
                  {{ postStore.searchUsers.length }}
                </span>
              </button>
            </div>

            <!-- FEED CONTENT -->
            <div class="feed-content">
              <template v-if="!postStore.searchQuery || searchTab === 'feed'">
                <!-- Loading Skeleton -->
                <div v-if="loading && postStore.posts.length === 0" class="skeleton-container">
                  <div v-for="i in 3" :key="i" class="skeleton-card"></div>
                </div>

                <!-- Posts List -->
                <div v-else-if="postStore.posts.length > 0" class="post-stack">
                  <div 
                    v-for="(post, index) in postStore.posts" 
                    :key="post.id" 
                    class="glass-card post-item animate-slide-up"
                    :style="{ animationDelay: (index * 0.05) + 's' }"
                  >
                    <PostCard :post="post" />
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="glass-card empty-state animate-fade-in">
                  <div class="empty-icon-wrapper">
                    <i class="bi bi-box2-heart"></i>
                  </div>
                  <h3>No posts yet</h3>
                  <p>Be the first to share something with the community.</p>
                </div>

                <!-- Load More Button -->
                <div v-if="postStore.pagination?.has_more_pages" class="load-more-container">
                  <button class="btn-modern-primary" @click="loadMorePosts" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-arrow-down-short"></i>
                    Load More Updates
                  </button>
                </div>
              </template>

              <!-- PEOPLE SEARCH TAB -->
              <template v-if="postStore.searchQuery && searchTab === 'people'">
                <div v-if="postStore.searchUsers.length === 0" class="glass-card empty-state">
                  <i class="bi bi-person-x"></i>
                  <h3>No results found</h3>
                  <p>Try searching for a different name or role.</p>
                </div>

                <div v-else class="people-search-grid">
                  <router-link
                    v-for="u in postStore.searchUsers"
                    :key="u.id"
                    :to="`/profile/${u.id}`"
                    class="glass-card person-search-card"
                  >
                    <div class="person-card-inner">
                      <img :src="userAvatar(u)" class="person-card-avatar" :alt="u.full_name" />
                      <div class="person-card-details">
                        <h4>{{ u.full_name }}</h4>
                        <p>{{ u.professional?.job_title || 'Community Member' }}</p>
                      </div>
                      <div class="person-card-action">
                        <i class="bi bi-chevron-right"></i>
                      </div>
                    </div>
                  </router-link>
                </div>
              </template>
            </div>
          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="sidebar-column">
            <div class="sticky-sidebar">
              
              <!-- CATEGORIES SECTION -->
              <div class="glass-card sidebar-section">
                <div class="section-header">
                  <h5>ប្រភេទ</h5>
                  <div class="header-line"></div>
                </div>
                <div class="category-grid">
                  <div
                    v-for="cat in categoryStore.category"
                    :key="cat.id"
                    class="modern-category-item"
                    @click="filterByCategory(cat.id)"
                  >
                    <div class="cat-icon">
                      <i :class="getCategoryIcon(cat.name)"></i>
                    </div>
                    <span>{{ cat.name }}</span>
                  </div>
                </div>
              </div>

              <!-- SUGGESTED PEOPLE SECTION -->
              <!-- <div class="glass-card sidebar-section">
                <div v-if="loadingPeople" class="skeleton-list">
                  <div v-for="i in 3" :key="i" class="skeleton-mini"></div>
                </div>

                <div v-else class="suggested-list">
                  <div v-for="person in suggestedUsers" :key="person.id" class="mini-profile-card">
                    <router-link :to="`/profile/${person.id}`" class="mini-avatar-link">
                      <img :src="userAvatar(person)" alt="Avatar" />
                    </router-link>
                    <div class="mini-info">
                      <router-link :to="`/profile/${person.id}`" class="mini-name">
                        {{ person.full_name }}
                      </router-link>
                      <span class="mini-role">{{ person.professional?.job_title || 'User' }}</span>
                    </div>
                    <router-link :to="`/profile/${person.id}`" class="mini-btn">
                      View
                    </router-link>
                  </div>
                  <div v-if="!suggestedUsers.length" class="empty-mini">
                    <p>No suggestions available</p>
                  </div>
                </div>
              </div> -->

              <!-- CHAT WIDGET -->
              <div class="modern-chat-wrapper">
                <ChatWidget />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* ── MODERN UI TOKENS ─────────────────────────────────────── */
:host {
  --primary: #6366f1;
  --primary-glow: rgba(99, 102, 241, 0.15);
  --accent: #8b5cf6;
  --bg: #f8fafc;
  --card-bg: rgba(255, 255, 255, 0.85);
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border: rgba(226, 232, 240, 0.7);
  --radius-lg: 20px;
  --radius-md: 12px;
  --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

/* ── LAYOUT ─────────────────────────────────────────────── */
.home-page-modern {
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.05) 0px, transparent 50%);
  min-height: 100vh;
  padding: 30px 0;
  font-family: 'Inter', -apple-system, sans-serif;
}

.container-modern {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: flex-start;
}

/* ── COMPONENTS ─────────────────────────────────────────── */
.glass-card {
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
}

/* ── FEED ───────────────────────────────────────────────── */
.composer-wrapper {
  padding: 8px; /* Inner padding managed by CreatePostView */
  background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);
}

.post-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-item {
  padding: 0;
  overflow: hidden;
}

/* ── PILL TABS ──────────────────────────────────────────── */
.modern-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 6px;
  background: rgba(226, 232, 240, 0.4);
  border-radius: 50px;
  width: fit-content;
}

.tab-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 40px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.tab-pill.active {
  background: #ffffff;
  color: #6366f1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.count-badge {
  background: #6366f1;
  color: white;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 4px;
}

/* ── SIDEBAR ────────────────────────────────────────────── */
.sticky-sidebar {
  position: sticky;
  top: 132px;
}

.section-header {
  margin-bottom: 18px;
}

.section-header h5 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.header-line {
  height: 3px;
  width: 40px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 10px;
}

/* Categories */
.category-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.modern-category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: 0.2s;
  color: #475569;
  font-weight: 500;
  font-size: 0.88rem;
}

.modern-category-item:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
}

.cat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 8px;
  transition: 0.2s;
}

.modern-category-item:hover .cat-icon {
  background: #6366f1;
  color: white;
}

.suggested-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-avatar-link img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #6366f1, #8b5cf6) border-box;
}

.mini-info {
  flex: 1;
  min-width: 0;
}

.mini-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-role {
  font-size: 0.75rem;
  color: #94a3b8;
  display: block;
}

.mini-btn {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6366f1;
  padding: 6px 12px;
  border-radius: 30px;
  background: #f0f3ff;
  text-decoration: none;
  transition: 0.2s;
}

.mini-btn:hover {
  background: #6366f1;
  color: white;
}

.btn-modern-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-modern-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 20px 0 40px;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── RESPONSIVE ─────────────────────────────────────────── */
@media (max-width: 992px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  .sidebar-column {
    display: none; /* Hide sidebar on mobile or move below */
  }
}

/* ── SKELETON LOADER ─────────────────────────────────────── */
.skeleton-card {
  height: 200px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: #cbd5e1;
}

.empty-state h3 {
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  color: #94a3b8;
}

/* Person Search Results */
.person-search-card {
  padding: 16px;
}

.person-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.person-card-avatar {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  object-fit: cover;
}

.person-card-details h4 {
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}

.person-card-details p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.person-card-action {
  margin-left: auto;
  color: #6366f1;
}

</style>