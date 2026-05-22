<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { useAuthStores } from '@/stores/auth'
import { useToast } from 'vue-toast-notification'
import PostCard from '@/components/PostCard.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChatWidget from '@/components/ChatWidget.vue'
import api from '@/api/http'
import BaseModal from '../components/BaseModal.vue'

const showModalEdit  = ref(false)
const postStore      = usePostStore()
const categoryStore  = useCategoryStore()
const auth           = useAuthStores()
const loading        = ref(true)
const $toast         = useToast()
const searchTab      = ref('feed') // 'feed' | 'people'

// Edit modal state
const isEditing          = ref(false)
const editingPost        = ref(null)
const content            = ref('')
const image              = ref(null)
const imagePreview       = ref(null)
const selectedCategories = ref([])
const showEmoji          = ref(false)
const submitSuccess      = ref('')
const submitError        = ref('')
const textarea           = ref(null)

const emojis = ['😀','😂','😍','🥰','😎','🤔','👍','❤️','🎉','🔥','💯','🙏']

// Reset tab to feed and scroll to top on every new search
watch(() => postStore.searchQuery, () => {
  searchTab.value = 'feed'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// People You May Know
const suggestedUsers = ref([])
const loadingPeople  = ref(true)

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
    // Silently fail — not critical
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
  return user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=6366f1&color=fff&size=80`
}

function handleEdit(post) {
  editingPost.value        = post
  isEditing.value          = true
  content.value            = post?.content || ''
  selectedCategories.value = post?.categories?.map(c => c.id) || []
  imagePreview.value       = post?.image || null
  image.value              = null
  submitSuccess.value      = ''
  submitError.value        = ''
  showModalEdit.value      = true
}

function closeModal() {
  showModalEdit.value      = false
  isEditing.value          = false
  editingPost.value        = null
  content.value            = ''
  image.value              = null
  imagePreview.value       = null
  selectedCategories.value = []
  showEmoji.value          = false
  submitSuccess.value      = ''
  submitError.value        = ''
}

function autoResize() {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

function toggleCategory(id) {
  const idx = selectedCategories.value.indexOf(id)
  if (idx === -1) {
    selectedCategories.value.push(id)
  } else {
    selectedCategories.value.splice(idx, 1)
  }
}

function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return
  image.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function addEmoji(emoji) {
  content.value += emoji
}

async function submitPost() {
  submitSuccess.value = ''
  submitError.value   = ''
  loading.value       = true
  try {
    const formData = new FormData()
    formData.append('content', content.value)
    if (image.value) formData.append('image', image.value)
    selectedCategories.value.forEach(id => formData.append('categories[]', id))

    if (isEditing.value && editingPost.value) {
      await api.post(`/api/posts/${editingPost.value.id}?_method=POST`, formData)
      submitSuccess.value = 'បានកែប្រែការបង្ហោះដោយជោគជ័យ!'
      $toast.success(submitSuccess.value)
    }

    await postStore.fetchPosts()
    closeModal()
  } catch (err) {
    submitError.value = err.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុក'
    $toast.error(submitError.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="home-page">
      <div class="container">
        <div class="row">

          <!-- MAIN FEED screen scrollable -->
            <div class="col-feed feed-scroll">
            <div class="card create-post-card">
              <div class="card-body">
                <CreatePostView @post-created="handlePostCreated" />
              </div>
            </div>

            <!-- Search tabs (only while searching) -->
            <div v-if="postStore.searchQuery" class="search-tabs">
              <button
                class="stab"
                :class="{ active: searchTab === 'feed' }"
                @click="searchTab = 'feed'"
              >
                <i class="bi bi-newspaper"></i> ព័ត៌មាន
              </button>
              <button
                class="stab"
                :class="{ active: searchTab === 'people' }"
                @click="searchTab = 'people'"
              >
                <i class="bi bi-people-fill"></i> មនុស្ស
                <span v-if="postStore.searchUsers.length" class="stab-badge">{{ postStore.searchUsers.length }}</span>
              </button>
            </div>

            <!-- ── FEED TAB ── -->
            <template v-if="!postStore.searchQuery || searchTab === 'feed'">
              <div v-if="loading && postStore.posts.length === 0" class="card text-center">
                <div class="card-body">
                  <div class="spinner"></div>
                  <p class="card-text">កំពុងផ្ទុកការបង្ហោះ...</p>
                </div>
              </div>

              <div v-else-if="postStore.posts.length > 0">
                <div v-for="post in postStore.posts" :key="post.id" class="card post-card">
                  <div class="card-body">
                    <PostCard :post="post" @editPost="handleEdit(post)" />
                  </div>
                </div>
              </div>

              <div v-else class="card text-center">
                <div class="card-body">
                  <i class="bi bi-newspaper empty-icon"></i>
                  <h4 class="card-title">មិនទាន់មានការបង្ហោះទេ</h4>
                  <p class="card-text">សូមក្លាយជាអ្នកដំបូងដែលចែករំលែកអ្វីមួយ!</p>
                </div>
              </div>

              <div v-if="postStore.pagination?.has_more_pages" class="load-more">
                <button class="btn-load" @click="loadMorePosts" :disabled="loading">
                  <span v-if="loading" class="spinner small"></span>
                  ផ្ទុកការបង្ហោះបន្ថែម
                </button>
              </div>
            </template>

            <!-- ── PEOPLE TAB ── -->
            <template v-if="postStore.searchQuery && searchTab === 'people'">
              <div v-if="postStore.searchUsers.length === 0" class="card text-center">
                <div class="card-body">
                  <i class="bi bi-person-x empty-icon"></i>
                  <h4 class="card-title">រកមិនឃើញអ្នកណា</h4>
                  <p class="card-text">សូមសាកល្បងស្វែងរកពាក្យផ្សេង។</p>
                </div>
              </div>

              <div v-else class="card search-people-card">
                <div class="card-body">
                  <div class="search-people-grid">
                    <router-link
                      v-for="u in postStore.searchUsers"
                      :key="u.id"
                      :to="`/profile/${u.id}`"
                      class="search-person-item"
                    >
                      <img :src="userAvatar(u)" class="search-person-av" :alt="u.full_name" />
                      <div class="search-person-info">
                        <p class="search-person-name">{{ u.full_name }}</p>
                        <p class="search-person-role">{{ u.professional?.job_title || 'អ្នកប្រើប្រាស់' }}</p>
                      </div>
                      <span class="search-person-btn">មើលប្រវត្តិរូប</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="col-side">
            <div class="sidebar">

              <!-- Categories -->
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">ប្រភេទ</h6>
                  <div v-if="categoryStore.loading" class="text-center">
                    <div class="spinner small"></div>
                  </div>
                  <div v-else class="category-list">
                    <div
                      v-for="cat in categoryStore.category"
                      :key="cat.id"
                      class="category-item"
                      @click="filterByCategory(cat.id)"
                    >
                      <i :class="getCategoryIcon(cat.name)"></i>
                      <span>{{ cat.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- People You May Know -->
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">មនុស្សដែលអ្នកធ្លាប់ស្គាល់</h6>

                  <div v-if="loadingPeople" class="text-center">
                    <div class="spinner small"></div>
                  </div>

                 <template v-else-if="suggestedUsers.length">
                    <div
                      v-for="person in suggestedUsers"
                      :key="person.id"
                      class="person-item"
                    >
                      <router-link :to="`/profile/${person.id}`" class="person-av-link">
                        <img :src="userAvatar(person)" class="person-av" :alt="person.full_name" />
                      </router-link>
                      <div class="person-info">
                        <router-link :to="`/profile/${person.id}`" class="person-name">
                          {{ person.full_name }}
                        </router-link>
                        <p class="person-role">{{ person.professional?.job_title || 'អ្នកប្រើប្រាស់' }}</p>
                      </div>
                      <router-link
                        :to="`/profile/${person.id}`"
                        class="person-view-btn"
                        title="មើលប្រវត្តិរូប"
                      >មើល</router-link>
                    </div>
                  </template>

                  <div v-else class="people-empty">
                    <p >ស្វែងរកមនុស្សដែលអ្នកចង់ស្វែងរក។</p>
                  </div>
                </div>
              </div>

              <!-- Chat Widget -->
              <ChatWidget />

            </div>
          </div>

        </div>
      </div>
    </div>
  </DashboardLayout>

  <!-- ───────────── EDIT MODAL ───────────── -->
  <BaseModal style="top: 200px;"
    v-if="showModalEdit"
    @closeModal="closeModal"
  >
    <!-- HEADER -->
    <template #header>
      <div class="modal-head-inner">
        <h5 class="modal-title-text">
          {{ isEditing ? 'កែប្រែការបង្ហោះ' : 'បង្កើតការបង្ហោះ' }}
        </h5>
        <button class="modal-close-btn" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </template>

    <!-- BODY -->
    <template #body>

      <!-- Composer row: avatar + textarea -->
      <div class="mc-composer">
        <img :src="userAvatar(auth.user)" alt="avatar" class="mc-avatar" />
        <textarea
          ref="textarea"
          v-model="content"
          class="mc-textarea"
          placeholder="តើអ្នកមានគំនិតបែបមិច?"
          @input="autoResize"
        />
      </div>

      <!-- Image preview -->
      <div v-if="imagePreview" class="mc-preview-wrap">
        <img :src="imagePreview" class="mc-preview-img" />
        <button class="mc-remove-img" @click="imagePreview = null; image = null">
          <i class="bi bi-x-circle-fill"></i>
        </button>
      </div>

      <!-- Category label -->
      <p class="mc-label">ជ្រើសរើសប្រភេទ</p>

      <!-- Category badges -->
      <div class="mc-category-box">
        <span
          v-for="cat in categoryStore.category"
          :key="cat.id"
          class="mc-badge"
          :class="{ 'mc-badge--active': selectedCategories.includes(cat.id) }"
          @click="toggleCategory(cat.id)"
        >
          <i :class="getCategoryIcon(cat.name)"></i>
          {{ cat.name }}
        </span>
      </div>

      <!-- Action bar -->
      <div class="mc-actions">
        <label class="mc-action-btn">
          <i class="bi bi-file-earmark-image"></i>
          <span>ឯកសារភ្ជាប់</span>
          <input type="file" hidden @change="uploadImage" />
        </label>

        <button class="mc-action-btn" @click="showEmoji = !showEmoji">
          😊 <span>អារម្មណ៍</span>
        </button>

        <button
          class="mc-submit-btn"
          @click="submitPost"
          :disabled="loading || (!content && !image)"
        >
          <span v-if="loading" class="mc-spinner"></span>
          {{ loading
            ? (isEditing ? 'កំពុងកែប្រែ...' : 'កំពុងបង្កើត...')
            : (isEditing ? 'កែប្រែ' : 'បង្កើត') }}
        </button>
      </div>

      <!-- Success / Error messages -->
      <p v-if="submitSuccess" class="mc-success">✓ {{ submitSuccess }}</p>
      <p v-if="submitError"   class="mc-error">✕ {{ submitError }}</p>

      <!-- Emoji picker -->
      <div v-if="showEmoji" class="mc-emoji-box">
        <span
          v-for="e in emojis"
          :key="e"
          class="mc-emoji"
          @click="addEmoji(e)"
        >{{ e }}</span>
      </div>

    </template>

    <!-- FOOTER -->
    <template #footer>
      <small class="mc-footer-text">ចែករំលែកគំនិតរបស់អ្នកជាមួយអ្នកដទៃ</small>
    </template>
  </BaseModal>
</template>

<style scoped>
/* ═══════════════════════════════════════
   PAGE & LAYOUT  (unchanged)
════════════════════════════════════════ */
.home-page {
  background: #f0f2f5;
  min-height: 100vh;
  padding: 20px 0;
}
.container { height: 100%; }
.row { height: 100%; }
.feed-scroll {
  height: calc(100vh - 70px - 40px); /* viewport minus navbar and page padding */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-right: 6px;
}
.container {
  max-width: 100%;
  width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}
.row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.col-feed { flex: 1; min-width: 320px; }
.col-side  { width: 300px; flex-shrink: 0; }

/* Search tabs */
.search-tabs { display: flex; gap: 8px; margin-bottom: 14px; }
.stab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 22px;
  border: 2px solid #e2e8f0; background: #fff;
  font-size: .86rem; font-weight: 600; color: #64748b;
  cursor: pointer; font-family: inherit; transition: all .18s;
}
.stab:hover { border-color: #6366f1; color: #6366f1; }
.stab.active {
  background: #6366f1; border-color: #6366f1; color: #fff;
  box-shadow: 0 2px 8px rgba(99,102,241,.25);
}
.stab-badge {
  background: rgba(255,255,255,0.3); color: inherit;
  font-size: .7rem; font-weight: 700; padding: 1px 7px; border-radius: 20px;
}
.stab:not(.active) .stab-badge { background: #ede9fe; color: #6366f1; }

/* People results */
.search-people-card { border-left: 3px solid #6366f1; }
.search-people-grid { display: flex; flex-direction: column; gap: 6px; }
.search-person-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  text-decoration: none; color: inherit; transition: background .15s;
}
.search-person-item:hover { background: #f8fafc; }
.search-person-av { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.search-person-info { flex: 1; min-width: 0; }
.search-person-name { font-size: .88rem; font-weight: 600; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.search-person-role { font-size: .76rem; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.search-person-btn { font-size: .76rem; font-weight: 600; color: #6366f1; padding: 5px 12px; border-radius: 8px; border: 1.5px solid #e0e7ff; background: #f8f5ff; flex-shrink: 0; white-space: nowrap; }

/* Cards */
.card { background: #fff; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
.card-body { padding: 14px 16px; }
.card-title { font-weight: 700; font-size: .9rem; margin-bottom: 10px; color: #1e293b; }
.card-text { color: #65676b; font-size: 14px; }

.sidebar { position: sticky; top: 80px; }
.create-post-card { padding: 0; }
.post-card { transition: 0.2s; }
.post-card:hover { transform: translateY(-2px); }

.category-list { display: flex; flex-direction: column; gap: 6px; }
.category-item { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: .86rem; color: #374151; transition: background .15s; }
.category-item:hover { background: #f0f2f5; }

.person-item { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
.person-av-link { flex-shrink: 0; }
.person-av { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; display: block; }
.person-info { flex: 1; min-width: 0; }
.person-name { font-size: .82rem; font-weight: 600; color: #1e293b; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.person-name:hover { color: #6366f1; }
.person-role { font-size: .72rem; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.person-view-btn { font-size: .72rem; font-weight: 600; color: #6366f1; text-decoration: none; flex-shrink: 0; padding: 3px 8px; border-radius: 6px; border: 1px solid #e0e7ff; transition: background .15s; }
.person-view-btn:hover { background: #eff6ff; }
.people-empty p { font-size: .78rem; color: #94a3b8; text-align: center; margin: 8px 0 4px; }

.load-more { display: flex; justify-content: center; margin: 10px 0 20px; }
.btn-load { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; border-radius: 9px; border: none; background: #1877f2; color: #fff; cursor: pointer; font-size: .86rem; font-weight: 600; font-family: inherit; }
.btn-load:hover:not(:disabled) { background: #166fe5; }
.btn-load:disabled { opacity: .6; cursor: not-allowed; }

.spinner { width: 28px; height: 28px; border: 3px solid #ddd; border-top-color: #1877f2; border-radius: 50%; animation: spin 1s linear infinite; margin: 16px auto; display: block; }
.spinner.small { width: 16px; height: 16px; border-width: 2px; margin: 8px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon { font-size: 40px; color: #ccc; margin-bottom: 10px; }
.text-center { text-align: center; }

@media (max-width: 992px) {
  .col-side { width: 100%; order: 2; }
  .col-feed { width: 100%; order: 1; }
  .row { gap: 16px; }
}

/* ═══════════════════════════════════════
   MODAL STYLES  (mc- prefix = modal content)
════════════════════════════════════════ */

/* Header */
.modal-head-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.modal-title-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.modal-close-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
}
.modal-close-btn:hover { background: #e2e8f0; color: #1e293b; }

/* Composer */
.mc-composer {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}
.mc-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #e0e7ff;
}
.mc-textarea {
  flex: 1;
  min-height: 80px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: .93rem;
  font-family: inherit;
  color: #1e293b;
  resize: none;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
  background: #f8fafc;
  line-height: 1.55;
}
.mc-textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  background: #fff;
}
.mc-textarea::placeholder { color: #94a3b8; }

/* Image preview */
.mc-preview-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 14px;
}
.mc-preview-img {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
}
.mc-remove-img {
  position: absolute;
  top: 8px; right: 8px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px; height: 28px;
  font-size: 1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.mc-remove-img:hover { background: rgba(239,68,68,0.85); }

/* Category label */
.mc-label {
  font-size: .8rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .04em;
  margin: 0 0 8px;
}

/* Category badges */
.mc-category-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.mc-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: .8rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all .15s;
  user-select: none;
}
.mc-badge:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
.mc-badge--active {
  border-color: #6366f1;
  background: #6366f1;
  color: #fff;
}
.mc-badge--active:hover { background: #4f46e5; border-color: #4f46e5; }

/* Action bar */
.mc-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 4px;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 10px;
}
.mc-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: .82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all .15s;
}
.mc-action-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

/* Submit button */
.mc-submit-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 22px;
  border-radius: 9px;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #fff;
  font-size: .88rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity .15s, transform .1s, box-shadow .15s;
  box-shadow: 0 3px 10px rgba(99,102,241,0.35);
}
.mc-submit-btn:hover:not(:disabled) {
  opacity: .92;
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(99,102,241,0.4);
}
.mc-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

/* Mini spinner inside button */
.mc-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

/* Success / Error */
.mc-success {
  font-size: .83rem; font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 6px 0 0;
}
.mc-error {
  font-size: .83rem; font-weight: 600;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 6px 0 0;
}

/* Emoji picker */
.mc-emoji-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.mc-emoji {
  font-size: 1.4rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 3px 5px;
  transition: background .12s, transform .1s;
}
.mc-emoji:hover { background: #e0e7ff; transform: scale(1.2); }

/* Footer text */
.mc-footer-text {
  font-size: .78rem;
  color: #94a3b8;
}
</style>