<template>
  <DashboardLayout>
    <div class="profile-page">

      <!-- ═══════════════════════════════════════════
           HERO BANNER
      ════════════════════════════════════════════ -->
      <div class="hero-banner">
        <!-- Cover background -->
        <div
          class="hero-bg"
          :style="profile.cover ? `background-image:url(${profile.cover})` : ''"
        />
        <div class="hero-overlay" />

        <!-- Change cover button -->
        <button class="cover-edit-btn" @click="coverInput.click()" :disabled="uploadingCover">
          <Loader2 v-if="uploadingCover" :size="14" class="spin" />
          <ImageIcon v-else :size="14" />
          {{ uploadingCover ? 'កំពុងផ្ទុកឡើង…' : 'ផ្លាស់ប្ដូររូបព័ទ្ធ' }}
        </button>
        <input ref="coverInput" type="file" accept="image/*" hidden @change="onCoverFile" />

        <div class="container">
          <div class="hero-content">
            <!-- Avatar with edit overlay -->
            <div class="avatar-wrap" @click="avatarInput.click()">
              <img :src="profile.avatar || defaultAvatar" class="avatar-img" alt="avatar" />
              <div class="avatar-edit-overlay">
                <Camera :size="16" />
              </div>
            </div>
            <input ref="avatarInput" type="file" accept="image/*" hidden @change="onAvatarFile" />

            <div class="hero-info">
              <h2 class="hero-name">{{ profile.full_name }}</h2>
              <p class="hero-role">
                {{ profile.professional?.job_title || 'បន្ថែមតួនាទីការងារ' }}
              </p>
              <p class="hero-company" v-if="profile.professional?.company_name">
                {{ profile.professional.company_name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════
           TABS
      ════════════════════════════════════════════ -->
      <div class="profile-tabs">
        <div class="container">
          <div class="tabs">
            <span class="tab" :class="{ active: activeTab === 'overview' }"    @click="activeTab = 'overview'">ទិដ្ឋភាពទូទៅ</span>
            <span class="tab" :class="{ active: activeTab === 'professional' }" @click="activeTab = 'professional'">វិជ្ជាជីវៈ</span>
            <span class="tab" :class="{ active: activeTab === 'education' }"   @click="activeTab = 'education'">ការអប់រំ</span>
            <span class="tab" :class="{ active: activeTab === 'collaboration' }" @click="activeTab = 'collaboration'">កិច្ចសហប្រតិបត្តិការ</span>
            <span class="tab" :class="{ active: activeTab === 'cv' }"          @click="activeTab = 'cv'">ប្រវត្តិរូប</span>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════
           MAIN CONTENT
      ════════════════════════════════════════════ -->
      <div class="container main-content">
        <div class="row mt-5 g-4">

          <!-- ─── LEFT SIDEBAR ─────────────────────── -->
          <div class="col-lg-4">
            <!-- Contact -->
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">ទំនាក់ទំនង</h6>
                <div class="info-row" v-if="profile.email">
                  <Mail :size="13" class="info-icon" />
                  <span>{{ profile.email }}</span>
                </div>
                <div class="info-row" v-if="profile.phone">
                  <Phone :size="13" class="info-icon" />
                  <span>{{ profile.phone }}</span>
                </div>
                <div class="info-row" v-if="profile.current_city">
                  <MapPin :size="13" class="info-icon" />
                  <span>{{ profile.current_city }}</span>
                </div>
                <div class="info-row" v-if="profile.portfolio_link">
                  <Link2 :size="13" class="info-icon" />
                  <a :href="profile.portfolio_link" target="_blank" class="info-link">ផតហ្វូលីយ៉ូ</a>
                </div>
                <router-link to="/editProfile" class="edit-link">កែប្រែព័ត៌មាន</router-link>
              </div>
            </div>

            <!-- Skills -->
            <div class="card">
              <div class="card-body">
                <div class="card-title-row">
                  <h6 class="card-title">ជំនាញ</h6>
                  <button class="icon-action-btn" @click="showSkillModal = true" title="គ្រប់គ្រងជំនាញ">
                    <Settings :size="13" />
                  </button>
                </div>
                <div v-if="profile.skills?.length" class="skills-wrap">
                  <span class="skill-badge" v-for="s in profile.skills" :key="s.id">{{ s.name }}</span>
                </div>
                <p v-else class="empty-text">
                  មិនទាន់មានជំនាញ។
                  <button class="text-btn" @click="showSkillModal = true">បន្ថែមជំនាញ</button>
                </p>
              </div>
            </div>

            <!-- Education summary -->
            <div class="card">
              <div class="card-body">
                <div class="card-title-row">
                  <h6 class="card-title">ការអប់រំ</h6>
                  <router-link to="/editEducation" class="icon-action-btn" title="គ្រប់គ្រងការអប់រំ">
                    <Settings :size="13" />
                  </router-link>
                </div>
                <template v-if="profile.educations?.length">
                  <div class="edu-summary" v-for="edu in profile.educations.slice(0,2)" :key="edu.id">
                    <p class="edu-school">{{ edu.school?.name || '—' }}</p>
                    <p class="edu-degree">{{ edu.degree?.name }} · {{ edu.subject?.name }}</p>
                  </div>
                </template>
                <p v-else class="empty-text">
                  មិនទាន់មានទិន្នន័យការអប់រំ។
                  <router-link to="/editEducation" class="text-btn">បន្ថែមការអប់រំ</router-link>
                </p>
              </div>
            </div>
          </div>

          <!-- ─── RIGHT CONTENT ─────────────────────── -->
          <div class="col-lg-8">
            <!-- ── OVERVIEW ─────────────────────────── -->
            <div v-if="activeTab === 'overview'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">អត្ថបទរបស់ខ្ញុំ ({{ postCount }})</h6>
                   <div  @click="openModal" class="btn-sm-primary">    
                    <Plus :size="13" /> បង្កើតអត្ថបទ
                 </div>
                </div>

                <div v-if="loadingPosts" class="text-center py-4">
                  <div class="spinner" />
                </div>
                <div v-else-if="paginatedPosts.length">
                  <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" class="mb-3" />
                </div>
                <div v-else class="empty-state-sm">មិនទាន់មានអត្ថបទ។</div>

                <div class="pager" v-if="totalPages > 1">
                  <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
                  <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
                  <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
                </div>
              </div>
            </div>

            <!-- ── PROFESSIONAL ──────────────────────── -->
            <div v-if="activeTab === 'professional'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">ព័ត៌មានវិជ្ជាជីវៈ</h6>
                  <router-link to="/editProfile" class="btn-sm-ghost">
                    <Pencil :size="13" /> កែប្រែ
                  </router-link>
                </div>
                <template v-if="profile.professional?.job_title">
                  <div class="prof-grid">
                    <div class="prof-item">
                      <span class="prof-label">តួនាទីការងារ</span>
                      <span class="prof-value">{{ profile.professional.job_title }}</span>
                    </div>
                    <div class="prof-item">
                      <span class="prof-label">ក្រុមហ៊ុន</span>
                      <span class="prof-value">{{ profile.professional.company_name || '—' }}</span>
                    </div>
                    <div class="prof-item full">
                      <span class="prof-label">ទំនួលខុសត្រូវ</span>
                      <span class="prof-value">{{ profile.professional.responsibility || '—' }}</span>
                    </div>
                  </div>
                </template>
                <div v-else class="empty-state-sm">
                  មិនទាន់មានព័ត៌មានវិជ្ជាជីវៈ។
                  <router-link to="/editProfile" class="text-btn">បន្ថែមព័ត៌មាន</router-link>
                </div>
              </div>
            </div>

            <!-- ── EDUCATION ──────────────────────────── -->
            <div v-if="activeTab === 'education'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">ការអប់រំ</h6>
                  <router-link to="/editEducation" class="btn-sm-primary">
                    <Plus :size="13" /> គ្រប់គ្រង
                  </router-link>
                </div>
                <template v-if="profile.educations?.length">
                  <div class="edu-timeline">
                    <div class="edu-entry" v-for="edu in profile.educations" :key="edu.id">
                      <div class="edu-dot-col">
                        <div class="edu-dot" />
                        <div class="edu-line" v-if="profile.educations.indexOf(edu) < profile.educations.length - 1"></div>
                      </div>
                      <div class="edu-body">
                        <span class="edu-badge" v-if="edu.degree?.name">{{ edu.degree.name }}</span>
                        <p class="edu-subject-name">{{ edu.subject?.name || '—' }}</p>
                        <p class="edu-school-name">
                          <Building2 :size="11" /> {{ edu.school?.name || '—' }}
                        </p>
                        <p class="edu-dates-text">
                          <CalendarDays :size="11" />
                          {{ formatDate(edu.start_date) }} → {{ edu.end_date ? formatDate(edu.end_date) : 'កំពុងបន្ត' }}
                        </p>
                        <p class="edu-desc-text" v-if="edu.description">{{ edu.description }}</p>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="empty-state-sm">
                  មិនទាន់មានទិន្នន័យការអប់រំ។
                  <router-link to="/editEducation" class="text-btn">បន្ថែមការអប់រំ</router-link>
                </div>
              </div>
            </div>

            <!-- ── COLLABORATION ──────────────────────── -->
            <div v-if="activeTab === 'collaboration'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">កិច្ចសហប្រតិបត្តិការ</h6>
                  <button class="btn-sm-primary" @click="openCollabModal">
                    <template v-if="profile.collaboration">
                      <Pencil :size="13" /> កែប្រែ
                    </template>
                    <template v-else>
                      <Plus :size="13" /> បន្ថែម
                    </template>
                  </button>
                </div>

                <!-- Has collaboration -->
                <div v-if="profile.collaboration" class="collab-card">
                  <div class="collab-logo-wrap">
                    <img
                      v-if="profile.collaboration.company_logo"
                      :src="profile.collaboration.company_logo"
                      class="collab-logo"
                      alt="Company logo"
                    />
                    <div v-else class="collab-logo-placeholder">
                      <Building2 :size="28" />
                    </div>
                  </div>
                  <div class="collab-info">
                    <p class="collab-link-label">តំណភ្ជាប់ក្រុមហ៊ុន / ផតហ្វូលីយ៉ូ</p>
                    <a
                      v-if="profile.collaboration.company_link"
                      :href="profile.collaboration.company_link"
                      target="_blank"
                      class="collab-link"
                    >
                      <ExternalLink :size="13" />
                      {{ profile.collaboration.company_link }}
                    </a>
                    <span v-else class="empty-text">មិនទាន់មានតំណភ្ជាប់</span>
                  </div>
                </div>

                <!-- Empty state -->
                <div v-else class="empty-state collab-empty">
                  <div class="empty-icon"><Handshake :size="28" /></div>
                  <h5 class="empty-title">មិនទាន់មានកិច្ចសហប្រតិបត្តិការ</h5>
                  <p class="empty-desc">បន្ថែមរូបសញ្ញា និងគេហទំព័រក្រុមហ៊ុនរបស់អ្នក ដើម្បីទាក់ទាញដៃគូ។</p>
                  <button class="btn-primary" @click="openCollabModal">
                    <Plus :size="14" /> បន្ថែមកិច្ចសហប្រតិបត្តិការ
                  </button>
                </div>
              </div>
            </div>

            <!-- ── CV ────────────────────────────────── -->
            <div v-if="activeTab === 'cv'" class="card">
              <div class="card-body">
                <div class="section-header">
                  <h6 class="card-title">ប្រវត្តិរូប / CV</h6>
                  <button class="btn-sm-primary" @click="cvInput.click()" :disabled="uploadingCV">
                    <Loader2 v-if="uploadingCV" :size="13" class="spin" />
                    <Upload v-else :size="13" />
                    {{ uploadingCV ? 'កំពុងផ្ទុកឡើង…' : (profile.cv ? 'ជំនួស CV' : 'ផ្ទុក CV ឡើង') }}
                  </button>
                  <input ref="cvInput" type="file" accept=".pdf,.doc,.docx" hidden @change="onCvFile" />
                </div>

                <div v-if="profile.cv" class="cv-preview">
                  <div class="cv-icon"><FileText :size="28" /></div>
                  <div>
                    <p class="cv-name">ប្រវត្តិរូបសង្ខេប</p>
                    <a :href="profile.cv" target="_blank" class="cv-link">
                      <ExternalLink :size="12" /> មើល / ទាញយក
                    </a>
                  </div>
                </div>
                <div v-else class="empty-state-sm">
                  មិនទាន់មាន CV ផ្ទុកឡើង។
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      v-if="showModal"
      @closeModal="closeModal"
    >
      <!-- HEADER -->
      <template #header>
        <div class="d-flex justify-content-between w-100">
          <h5>{{ isEditing ? 'កែប្រែ​រការបង្ហោះ' : 'បង្កើតការបង្ហោះ' }}</h5>
          <button class="btn-close" @click="closeModal"></button>
        </div>
      </template>

      <!-- BODY -->
      <template #body>
        <div class="card">

          <!-- TEXT -->
          <div class="composer-header">
            <img :src="userAvatar" alt="avatarSrc" class="avatar">
            <textarea
              ref="textarea"
              v-model="content"
              class="textarea"
              placeholder="តើអ្នកមានគំនិតបែបមិច?"
              @input="autoResize"
            />
          </div>

          <!-- IMAGE -->
          <img v-if="imagePreview" :src="imagePreview" class="preview" />

          <!-- CATEGORY -->
          <p class="text-muted mt-3">ជ្រើសរើសប្រភេទ</p>

          <div class="category-box">
            <span
              v-for="cat in categoryStore.category"
              :key="cat.id"
              class="badge"
              :class="{ active: selectedCategories.includes(cat.id) }"
              @click="toggleCategory(cat.id)"
            >
              <i :class="getCategoryIcon(cat.name)"></i>
              {{ cat.name }}
            </span>
          </div>

          <!-- ACTIONS -->
          <div class="actions">
            <label class="btn">
              <i class="bi bi-file-earmark-image"></i> ឯកសារភ្ជាប់
              <input type="file" hidden @change="uploadImage" />
            </label>

            <button class="btn" @click="showEmoji = !showEmoji">
              😊 អារម្មណ៍
            </button>

            <button
              class="post-btn"
              @click="submitPost"
              :disabled="loading || (!content && !image)"
            >
              {{ loading ? (isEditing ? 'កំពុងកែប្រែរ...' : 'កំពុងបង្កើត...') : (isEditing ? 'កែប្រែ' : 'បង្កើត') }}
            </button>
          </div>

          <p v-if="submitSuccess" class="success-text mt-2">{{ submitSuccess }}</p>
          <p v-if="submitError" class="error-text mt-2">{{ submitError }}</p>

          <!-- EMOJI -->
          <div v-if="showEmoji" class="emoji-box">
            <span
              v-for="e in emojis"
              :key="e"
              class="emoji"
              @click="addEmoji(e)"
            >
              {{ e }}
            </span>
          </div>

        </div>
      </template>

      <!-- FOOTER -->
      <template #footer>
        <small class="text-muted">ចែករំលែកគំនិតរបស់អ្នកជាមួយអ្នកដទៃ</small>
      </template>
    </BaseModal>

    <!-- ═══════════════════════════════════════════
         MODALS
    ════════════════════════════════════════════ -->

    <!-- Image Crop Modal -->
    <ImageCropModal
      v-if="cropSrc"
      :src="cropSrc"
      :shape="cropShape"
      @crop="onCropped"
      @cancel="cropSrc = null"
    />

    <!-- Collaboration Modal -->
    <CollaborationModal
      v-if="showCollabModal"
      :existing="profile.collaboration"
      @close="showCollabModal = false"
      @saved="onCollabSaved"
    />

    <!-- Skill Modal -->
    <SkillModal
      v-if="showSkillModal"
      :current-skills="profile.skills || []"
      @close="showSkillModal = false"
      @saved="onSkillsSaved"
    />

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast-snack" :class="toast.type">
        <CheckCircle2 v-if="toast.type === 'success'" :size="15" />
        <XCircle v-else :size="15" />
        {{ toast.msg }}
      </div>
    </Transition>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Plus, Pencil, Camera, ImageIcon, Settings, Mail, Phone,
  MapPin, Link2, Building2, CalendarDays, CheckCircle2, XCircle,
  Loader2, Upload, FileText, ExternalLink, Handshake
} from 'lucide-vue-next'
import { usePostStore } from '@/stores/post'
import { useAuthStores } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useCategoryStore } from '@/stores/category'
import PostCard from '@/components/PostCard.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ImageCropModal from '@/components/ImageCropModal.vue'
import CollaborationModal from '@/components/CollaborationModal.vue'
import SkillModal from '@/components/SkillModal.vue'
import BaseModal from '@/components/BaseModal.vue'

const emit = defineEmits(['post-created'])

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const auth = useAuthStores()
const profileStore = useProfileStore()
const categoryStore = useCategoryStore()

// ── Profile Tab State ───────────────────────────────────────
const activeTab       = ref('overview')
const loadingPosts    = ref(false)
const uploadingCover  = ref(false)
const uploadingCV     = ref(false)
const showCollabModal = ref(false)
const showSkillModal  = ref(false)

// Crop modal
const cropSrc   = ref(null)
const cropShape = ref('circle')
let pendingCropType = null  // 'avatar' | 'cover'

// Toast
const toast = ref({ show: false, msg: '', type: 'success' })

// File input refs
const avatarInput = ref(null)
const coverInput  = ref(null)
const cvInput     = ref(null)

// Default avatar
const defaultAvatar = 'https://i.pravatar.cc/150'

// ── Profile data (from auth.user) ──────────────────────────
const profile = computed(() => {
  const u = auth.user || {}
  return {
    id:             u.id,
    full_name:      u.full_name      || 'អ្នកប្រើប្រាស់',
    avatar:         u.avatar         || null,
    cover:          u.cover          || '',
    email:          u.email          || '',
    phone:          u.phone          || '',
    current_city:   u.current_city   || '',
    home_town:      u.home_town      || '',
    portfolio_link: u.portfolio_link || '',
    professional:   u.professional   || null,
    educations:     u.educations     || [],
    skills:         u.skills         || [],
    collaboration:  u.collaboration  || null,
    cv:             u.cv             || null,
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

// ── Posts ──────────────────────────────────────────────────
const ownPosts = computed(() => {
  if (!auth.user?.id) return []
  return (postStore.posts || []).filter(p =>
    p.user_id === auth.user.id || p.creator?.id === auth.user.id
  )
})
const postCount      = computed(() => ownPosts.value.length)
const currentPage    = ref(1)
const perPage        = 5
const totalPages     = computed(() => Math.max(1, Math.ceil(ownPosts.value.length / perPage)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return ownPosts.value.slice(start, start + perPage)
})

// ── Avatar upload ───────────────────────────────────────────
function onAvatarFile(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  pendingCropType = 'avatar'
  cropShape.value = 'circle'
  cropSrc.value = URL.createObjectURL(file)
}

// ── Cover upload ────────────────────────────────────────────
function onCoverFile(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  pendingCropType = 'cover'
  cropShape.value = 'rect'
  cropSrc.value = URL.createObjectURL(file)
}

// ── After crop ──────────────────────────────────────────────
async function onCropped(blob) {
  cropSrc.value = null
  const file = new File([blob], `${pendingCropType}.jpg`, { type: 'image/jpeg' })

  if (pendingCropType === 'avatar') {
    try {
      await profileStore.updateAvatar(file)
      await auth.fetchUser()
      showToast('រូបថតប្រូហ្វាលបានធ្វើបច្ចុប្បន្នភាព!', 'success')
    } catch {
      showToast('បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពរូបថត។', 'error')
    }
  } else if (pendingCropType === 'cover') {
    uploadingCover.value = true
    try {
      await profileStore.updateCover(file)
      await auth.fetchUser()
      showToast('រូបព័ទ្ធបានធ្វើបច្ចុប្បន្នភាព!', 'success')
    } catch {
      showToast('បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពរូបព័ទ្ធ។', 'error')
    } finally {
      uploadingCover.value = false
    }
  }
  pendingCropType = null
}

// ── CV upload ────────────────────────────────────────────────
async function onCvFile(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if (!file) return
  uploadingCV.value = true
  try {
    await profileStore.updateCV(file)
    await auth.fetchUser()
    showToast('CV បានផ្ទុកឡើងដោយជោគជ័យ!', 'success')
  } catch {
    showToast('បរាជ័យក្នុងការផ្ទុក CV ឡើង។', 'error')
  } finally {
    uploadingCV.value = false
  }
}

// ── Collaboration ────────────────────────────────────────────
function openCollabModal() {
  showCollabModal.value = true
}

function onCollabSaved() {
  showToast('កិច្ចសហប្រតិបត្តិការបានធ្វើបច្ចុប្បន្នភាព!', 'success')
}

// ── Skills ───────────────────────────────────────────────────
function onSkillsSaved() {
  showToast('ជំនាញបានធ្វើបច្ចុប្បន្នភាព!', 'success')
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── Post Modal State ────────────────────────────────────────
const showModal    = ref(false)
const content      = ref('')
const image        = ref(null)
const imagePreview = ref(null)
const loading      = ref(false)
const submitError  = ref('')
const submitSuccess = ref('')
const emojis       = ['😀','😂','😍','🔥','👍','❤️','🎉','😎']
const showEmoji    = ref(false)
const textarea     = ref(null)
const isEditing    = ref(false)
const editingPostId = ref(null)
const selectedCategories = ref([])

const userAvatar = computed(() =>
  auth.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'
)

const getReturnPath = () => {
  const from = route.query.from
  if (typeof from === 'string' && from.trim()) return from
  return '/'
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  if (isEditing.value) {
    router.push(getReturnPath())
  }
}

const autoResize = async () => {
  await nextTick()
  if (!textarea.value) return
  textarea.value.style.height = 'auto'
  textarea.value.style.height = textarea.value.scrollHeight + 'px'
}

const addEmoji = (e) => {
  content.value += e
  autoResize()
}

const uploadImage = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  image.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const toggleCategory = (id) => {
  if (selectedCategories.value.includes(id)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== id)
  } else {
    selectedCategories.value.push(id)
  }
}

const getCategoryIcon = (name) => {
  const map = {
    event: 'bi-calendar-event',
    internship: 'bi-briefcase',
    jobs: 'bi-briefcase-fill',
    project: 'bi-diagram-3',
    study: 'bi-book'
  }
  return map[name.toLowerCase()] || 'bi-tag'
}

const submitPost = async () => {
  if (!content.value && !image.value) return

  loading.value = true
  submitError.value = ''
  submitSuccess.value = ''

  try {
    const formData = new FormData()
    formData.append('text', content.value)
    formData.append('category_ids', JSON.stringify(selectedCategories.value))

    if (image.value) {
      formData.append('image', image.value)
    }

    if (isEditing.value && editingPostId.value) {
      await postStore.updatePost(editingPostId.value, formData)
      submitSuccess.value = 'Post updated successfully. Redirecting...'
    } else {
      await postStore.addPost(formData)
      submitSuccess.value = 'Post created successfully.'
    }

    content.value = ''
    image.value = null
    imagePreview.value = null
    selectedCategories.value = []
    showEmoji.value = false

    emit('post-created')
    if (isEditing.value) {
      setTimeout(() => { closeModal() }, 900)
    } else {
      closeModal()
    }

  } catch (error) {
    submitError.value =
      error?.response?.data?.message ||
      'Failed to update post. Please try again.'
  } finally {
    loading.value = false
  }
}

// ── onMounted hooks ─────────────────────────────────────────
onMounted(async () => {
  loadingPosts.value = true
  try {
    await postStore.fetchPosts()
  } finally {
    loadingPosts.value = false
  }
})

onMounted(async () => {
  await categoryStore.fetchCategory()
})

onMounted(async () => {
  const editId = route.query.edit
  if (editId) {
    isEditing.value = true
    editingPostId.value = parseInt(editId)

    openModal()

    postStore.fetchPostById(editingPostId.value)
      .then(() => {
        const post = postStore.post
        if (post) {
          content.value = post.text || ''
          imagePreview.value = post.image || null
          selectedCategories.value = Array.isArray(post.categories)
            ? post.categories.map((cat) => Number(cat.id)).filter(Boolean)
            : []
          autoResize()
        }
      })
      .catch((err) => {
        console.error('បរាជ័យ​ក្នុង​ការ​បង្ហោះសារ', err)
      })
  }
})
</script>

<style scoped>
.post-trigger-btn p {
    flex: 1;
    margin: 0;
    font-size: 14px;
    color: #888780;
    font-family: 'Kantumruy Pro', sans-serif;
  }

  .post-trigger-btn .bi-pencil-square {
    color: #7F77DD;
    font-size: 16px;
  }

  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #EEEDFE;
  }

  .card {
    padding: 18px;
    border: none;
    background: transparent;
  }

  .composer-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 0.5px solid rgba(83, 74, 183, 0.12);
  }

  .textarea {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #2C2C2A;
    background: transparent;
    resize: none;
    min-height: 64px;
    font-family: 'Kantumruy Pro', sans-serif;
    line-height: 1.7;
  }

  .textarea::placeholder {
    color: #B4B2A9;
  }

  .preview {
    width: 100%;
    border-radius: 10px;
    border: 0.5px solid rgba(83, 74, 183, 0.15);
    margin-top: 10px;
  }

  .text-muted {
    font-size: 12px;
    color: #888780;
    margin-bottom: 8px !important;
    font-family: 'Kantumruy Pro', sans-serif;
  }

  .category-box {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 10px 0 14px;
  }

  .badge {
    padding: 5px 11px;
    border-radius: 20px;
    cursor: pointer;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    background: #F1EFE8;
    color: #5F5E5A;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s;
    font-weight: 400;
  }

  .badge:hover {
    border-color: #7F77DD;
    color: #3C3489;
    background: #EEEDFE;
  }

  .badge.active {
    background: #EEEDFE;
    border-color: #7F77DD;
    color: #3C3489;
    font-weight: 500;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding-top: 12px;
    border-top: 0.5px solid rgba(83, 74, 183, 0.1);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border-radius: 8px;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    background: #F1EFE8;
    color: #5F5E5A;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .btn:hover {
    background: #D3D1C7;
    border-color: rgba(0, 0, 0, 0.15);
  }

  .post-btn {
    margin-left: auto;
    background: #534AB7;
    color: #EEEDFE;
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    font-family: inherit;
    letter-spacing: 0.01em;
  }

  .post-btn:hover {
    background: #3C3489;
  }

  .post-btn:active {
    transform: scale(0.98);
  }

  .post-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .emoji-box {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 0.5px solid rgba(83, 74, 183, 0.1);
  }

  .emoji {
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.15s;
  }

  .emoji:hover {
    background: #EEEDFE;
  }

  .error-text {
    color: #A32D2D;
    font-size: 12px;
  }

  .success-text {
    color: #3B6D11;
    font-size: 12px;
  }

.profile-page {
  background: #f3f4f6;
  min-height: 100vh;
}

/* ── HERO ─────────────────────────────── */
.hero-banner {
  height: 260px;
  position: relative;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%);
}

.cover-edit-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(8px);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: .78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s;
}
.cover-edit-btn:hover:not(:disabled) { background: rgba(255,255,255,0.28); }
.cover-edit-btn:disabled { opacity: .6; cursor: not-allowed; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-content {
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

.hero-content {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding-top: 145px;
}

/* ── AVATAR ──────────────────────────── */
.avatar-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #fff;
  object-fit: cover;
  display: block;
}

.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity .2s;
}
.avatar-wrap:hover .avatar-edit-overlay { opacity: 1; }

/* ── HERO INFO ───────────────────────── */
.hero-info { 
  padding-bottom: 16px;
  color: #fff;
}

.hero-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.hero-role {
  font-size: .9rem;
  margin: 0;
  opacity: 0.95;
}

.hero-company {
  font-size: .85rem;
  margin: 2px 0 0;
  opacity: 0.85;
}

/* ── TABS ────────────────────────────── */
.profile-tabs {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs {
  display: flex;
  gap: 32px;
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  cursor: pointer;
  color: #6b7280;
  font-size: .9rem;
  font-weight: 500;
  padding: 14px 0;
  transition: color .15s;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}
.tab:hover  { color: #374151; }
.tab.active { 
  color: #111; 
  border-bottom-color: #111; 
  font-weight: 600; 
}

@media (max-width: 992px) {
  .col-lg-4,
  .col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 100px;
  }
  
  .hero-banner {
    height: 320px;
  }
  
  .hero-info {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .avatar-wrap {
    width: 90px;
    height: 90px;
  }
  
  .hero-name {
    font-size: 1.2rem;
  }
  
  .tabs {
    gap: 20px;
  }
  
  .tab {
    font-size: .85rem;
    padding: 12px 0;
  }
}

/* ── CARD ────────────────────────────── */
.card {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: box-shadow .2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-body { padding: 20px; }

.card-title {
  font-weight: 700;
  font-size: 1rem;
  color: #111;
  margin: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

/* ── CONTACT INFO ────────────────────── */
.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: .85rem;
  color: #374151;
  margin-bottom: 10px;
}

.info-icon { color: #9ca3af; flex-shrink: 0; }
.info-link { 
  color: #2563eb; 
  text-decoration: none; 
  font-size: .85rem;
  word-break: break-all;
}
.info-link:hover { text-decoration: underline; }

.edit-link {
  display: inline-block;
  margin-top: 12px;
  font-size: .8rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
}
.edit-link:hover { color: #111; }

/* ── SKILLS ──────────────────────────── */
.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-badge {
  background: #f3f4f6;
  color: #374151;
  font-size: .75rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
}

/* ── EDUCATION SIDEBAR ───────────────── */
.edu-summary { 
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}
.edu-summary:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.edu-school  { 
  font-size: .85rem; 
  font-weight: 600; 
  color: #111; 
  margin: 0 0 2px;
}
.edu-degree  { 
  font-size: .75rem; 
  color: #6b7280; 
  margin: 0; 
}

/* ── PROFESSIONAL ────────────────────── */
.prof-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.prof-item.full { grid-column: 1 / -1; }
.prof-label {
  display: block;
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #9ca3af;
  margin-bottom: 4px;
}
.prof-value {
  font-size: .9rem;
  color: #111;
  font-weight: 500;
  line-height: 1.5;
}

/* ── EDUCATION TIMELINE ──────────────── */
.edu-timeline { display: flex; flex-direction: column; gap: 0; }

.edu-entry {
  display: flex;
  gap: 0;
}

.edu-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
  flex-shrink: 0;
}

.edu-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #111;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #e5e7eb;
  flex-shrink: 0;
}

.edu-line {
  width: 2px;
  flex: 1;
  background: #e5e7eb;
  margin: 4px 0;
}

.edu-body {
  padding: 0 0 24px 16px;
  flex: 1;
}

.edu-badge {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  font-size: .7rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
  margin-bottom: 6px;
}

.edu-subject-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 4px;
}

.edu-school-name {
  font-size: .8rem;
  color: #6b7280;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.edu-dates-text {
  font-size: .75rem;
  color: #9ca3af;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.edu-desc-text {
  font-size: .8rem;
  color: #6b7280;
  margin: 8px 0 0;
  line-height: 1.5;
}

/* ── COLLABORATION ───────────────────── */
.collab-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.collab-logo-wrap {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collab-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.collab-logo-placeholder { color: #9ca3af; }

.collab-info { flex: 1; min-width: 200px; }
.collab-link-label {
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #9ca3af;
  margin: 0 0 6px;
}

.collab-link {
  font-size: .85rem;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  word-break: break-all;
}
.collab-link:hover { text-decoration: underline; }

.collab-empty { 
  text-align: center; 
  padding: 48px 20px; 
}

/* ── CV ──────────────────────────────── */
.cv-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.cv-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cv-name { 
  font-size: .9rem; 
  font-weight: 600; 
  color: #111; 
  margin: 0 0 4px; 
}
.cv-link {
  font-size: .8rem;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.cv-link:hover { text-decoration: underline; }

/* ── BUTTONS ─────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #111;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: .85rem;
  font-weight: 600;
  font-family: inherit;
  transition: all .2s;
}
.btn-primary:hover { background: #374151; transform: translateY(-1px); }

.btn-sm-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: .8rem;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  transition: all .2s;
}
.btn-sm-primary:hover { background: #374151; }

.btn-sm-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f3f4f6;
  color: #374151;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: .8rem;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  transition: all .2s;
}
.btn-sm-ghost:hover { background: #e5e7eb; }

.icon-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  text-decoration: none;
  transition: all .2s;
}
.icon-action-btn:hover { background: #f3f4f6; color: #111; border-color: #d1d5db; }

/* ── EMPTY STATES ────────────────────── */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-state-sm {
  font-size: .85rem;
  color: #9ca3af;
  padding: 32px 0;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f3f4f6;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 8px;
}

.empty-desc {
  font-size: .85rem;
  color: #9ca3af;
  margin: 0 0 24px;
}

.empty-text {
  font-size: .85rem;
  color: #9ca3af;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.text-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: .85rem;
  color: #2563eb;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
}
.text-btn:hover { text-decoration: underline; }

/* ── PAGINATION ──────────────────────── */
.pager {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: .85rem;
  transition: all .2s;
}
.page-btn:hover:not(:disabled) { border-color: #111; background: #f9fafb; }
.page-btn.active { background: #111; color: #fff; border-color: #111; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── SPINNER ─────────────────────────── */
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

.spin { animation: spin .7s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

/* ── TOAST ───────────────────────────── */
.toast-snack {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: .85rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
  z-index: 9999;
  white-space: nowrap;
}
.toast-snack.success { background: #111; color: #fff; }
.toast-snack.error   { background: #dc2626; color: #fff; }

.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* ── UTILS ───────────────────────────── */
.text-center { text-align: center; }
.py-4 { padding: 24px 0; }
.mb-3 { margin-bottom: 16px; }
</style>