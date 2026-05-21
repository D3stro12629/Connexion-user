<template>
  <DashboardLayout>
    <div class="education-page bg-light min-vh-100 py-4">
      <div class="container">
        <!-- Page Header -->
        <div class="d-flex align-items-center gap-3 mb-4 pb-2">
          <div class="header-icon d-flex align-items-center justify-content-center">
            <GraduationCap :size="24" class="text-white" />
          </div>
          <div>
            <h1 class="h3 fw-bold mb-1" style="color: #1e1b4b;">បន្ថែមប្រវត្តិសិក្សា</h1>
            <p class="small mb-0" style="color: #64748b;">សូមបំពេញព័ត៌មានលម្អិតខាងក្រោម</p>
          </div>
        </div>

        <div class="row g-4">
          <!-- LEFT: Form Section -->
          <div class="col-lg-5">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" 
                       style="width: 44px; height: 44px; background: #6366f1;">
                    <component :is="editingId ? Pencil : Plus" :size="18" class="text-white" />
                  </div>
                  <div>
                    <h3 class="h6 fw-bold mb-1" style="color: #1e1b4b;">{{ editingId ? 'កែប្រែព័ត៌មានសិក្សា' : 'បន្ថែមប្រវត្តិសិក្សាថ្មី' }}</h3>
                    <p class="small mb-0" style="color: #64748b;">{{ editingId ? 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានសិក្សារបស់អ្នក' : 'សូមបំពេញព័ត៌មានលម្អិតខាងក្រោម' }}</p>
                  </div>
                </div>
              </div>

              <div class="card-body p-4">
                <!-- School Field -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold mb-1" style="color: #6366f1;">
                    ឈ្មោះសាលា / សាកលវិទ្យាល័យ <span class="text-danger">*</span>
                  </label>
                  <div class="position-relative">
                    <input
                      v-model="schoolSearch"
                      type="text"
                      class="form-control rounded-2 pe-5"
                      :class="{ 'is-invalid': schoolError }"
                      placeholder="ស្វែងរក ឬវាយបញ្ចូលឈ្មោះសាលា..."
                      style="border-color: #e2e8f0;"
                      @input="filterSchools"
                      @focus="showSchoolDrop = true"
                      @blur="delayHideSchool"
                    />
                    <button 
                      v-if="schoolSearch" 
                      class="position-absolute end-0 top-50 translate-middle-y btn btn-link p-0 me-2" 
                      style="color: #94a3b8; text-decoration: none;" 
                      type="button"
                      @click="clearSchool">
                      <X :size="14" />
                    </button>
                  </div>
                  
                  <!-- Dropdown -->
                  <div v-if="showSchoolDrop && filteredSchools.length" class="dropdown-menu show w-100 mt-1 shadow-sm rounded-2" style="z-index: 1000; border-color: #e2e8f0;">
                    <button
                      v-for="school in filteredSchools"
                      :key="school.id"
                      class="dropdown-item d-flex align-items-center gap-2 py-2"
                      type="button"
                      style="color: #1e293b;"
                      @mousedown.prevent="selectSchool(school)"
                    >
                      <Building2 :size="12" style="color: #6366f1;" />
                      <span>{{ school.name }}</span>
                    </button>
                  </div>

                  <!-- Selected badge -->
                  <div v-if="form.school_name" class="mt-2">
                    <span class="badge rounded-pill px-3 py-2" style="background: #eef2ff; color: #6366f1;">
                      <CheckCircle2 :size="12" class="me-1" />
                      {{ form.school_name }}
                      <button class="btn btn-link p-0 ms-2" style="color: #6366f1; font-size: 1rem; text-decoration: none;" @click="clearSchool">×</button>
                    </span>
                  </div>
                </div>

                <!-- Degree Field -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold mb-1" style="color: #6366f1;">
                    កម្រិតសិក្សា / សញ្ញាបត្រ <span class="text-danger">*</span>
                  </label>
                  <select v-model="form.degree_id" class="form-select rounded-2" style="border-color: #e2e8f0;" @change="onDegreeChange">
                    <option value="" disabled>ជ្រើសរើសកម្រិតសិក្សា</option>
                    <option v-for="degree in degrees" :key="degree.id" :value="degree.id">{{ degree.name }}</option>
                    <option value="custom">+ ផ្សេងៗ (បញ្ជាក់ខាងក្រោម)</option>
                  </select>
                  
                  <input
                    v-if="form.degree_id === 'custom'"
                    v-model="form.degree_name_custom"
                    type="text"
                    class="form-control rounded-2 mt-2"
                    style="border-color: #e2e8f0;"
                    placeholder="វាយបញ្ចូលកម្រិតសិក្សារបស់អ្នក"
                  />
                </div>

                <!-- Subject / Major -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold mb-1" style="color: #6366f1;">
                    ជំនាញសិក្សា / ឯកទេស
                  </label>
                  <div class="position-relative">
                    <input
                      v-model="subjectSearch"
                      type="text"
                      class="form-control rounded-2 pe-5"
                      placeholder="ស្វែងរក ឬវាយបញ្ចូលឈ្មោះជំនាញ..."
                      style="border-color: #e2e8f0;"
                      @input="filterSubjects"
                      @focus="showSubjectDrop = true"
                      @blur="delayHideSubject"
                    />
                    <button 
                      v-if="subjectSearch" 
                      class="position-absolute end-0 top-50 translate-middle-y btn btn-link p-0 me-2" 
                      style="color: #94a3b8; text-decoration: none;"
                      type="button"
                      @click="clearSubject">
                      <X :size="14" />
                    </button>
                  </div>
                  
                  <div v-if="showSubjectDrop && filteredSubjects.length" class="dropdown-menu show w-100 mt-1 shadow-sm rounded-2" style="z-index: 1000; border-color: #e2e8f0;">
                    <button
                      v-for="subject in filteredSubjects"
                      :key="subject.id"
                      class="dropdown-item d-flex align-items-center gap-2 py-2"
                      type="button"
                      style="color: #1e293b;"
                      @mousedown.prevent="selectSubject(subject)"
                    >
                      <BookOpen :size="12" style="color: #6366f1;" />
                      <span>{{ subject.name }}</span>
                    </button>
                  </div>

                  <div v-if="form.subject_name" class="mt-2">
                    <span class="badge rounded-pill px-3 py-2" style="background: #eef2ff; color: #6366f1;">
                      <CheckCircle2 :size="12" class="me-1" />
                      {{ form.subject_name }}
                      <button class="btn btn-link p-0 ms-2" style="color: #6366f1; font-size: 1rem; text-decoration: none;" @click="clearSubject">×</button>
                    </span>
                  </div>
                </div>

                <!-- Date Range Row -->
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label small fw-semibold mb-1" style="color: #6366f1;">ខែឆ្នាំចាប់ផ្តើម <span class="text-danger">*</span></label>
                    <input v-model="form.start_date" type="month" class="form-control rounded-2" style="border-color: #e2e8f0;" />
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold mb-1" style="color: #6366f1;">ខែឆ្នាំបញ្ចប់</label>
                    <input
                      v-model="form.end_date"
                      type="month"
                      class="form-control rounded-2"
                      style="border-color: #e2e8f0;"
                      :disabled="form.is_current"
                    />
                  </div>
                </div>

                <!-- Current Study Toggle -->
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input form-check-input-lg" type="checkbox" id="currentStudy" v-model="form.is_current" @change="onCurrentChange" />
                  <label class="form-check-label small fw-medium" for="currentStudy" style="color: #334155;">កំពុងសិក្សា</label>
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold mb-1" style="color: #6366f1;">ពិពណ៌នាបន្ថែម (បើមាន)</label>
                  <textarea
                    v-model="form.description"
                    class="form-control rounded-2"
                    rows="3"
                    placeholder="រៀបរាប់ពីសមិទ្ធផល សកម្មភាពផ្សេងៗ មធ្យមភាគពិន្ទុ (GPA) ឬព័ត៌មានលម្អិត..."
                    maxlength="500"
                    style="border-color: #e2e8f0;"
                  ></textarea>
                  <div class="text-end small mt-1" style="color: #94a3b8;">{{ form.description?.length || 0 }}/500</div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex gap-2 justify-content-end pt-3 border-top">
                  <button v-if="editingId" class="btn rounded-2 px-4" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;" @click="cancelEdit">
                    <X :size="14" class="me-1" /> បោះបង់
                  </button>
                  <button v-else class="btn rounded-2 px-4" type="button" style="background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;" @click="resetForm">
                    <RefreshCcw :size="14" class="me-1" /> កំណត់ឡើងវិញ
                  </button>
                  <button class="btn rounded-2 px-4 text-white" type="button" style="background: #6366f1; border: none;" :disabled="saving || !canSubmit" @click="save">
                    <Loader2 v-if="saving" :size="14" class="spin me-1" />
                    <component :is="editingId ? Save : Plus" v-else :size="14" class="me-1" />
                    {{ saving ? 'កំពុងរក្សាទុក...' : editingId ? 'ធ្វើបច្ចុប្បន្នភាព' : 'រក្សាទុក' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Records List -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: #eef2ff;">
                    <ListChecks :size="18" style="color: #6366f1;" />
                  </div>
                  <div>
                    <h3 class="h6 fw-bold mb-1" style="color: #1e1b4b;">ប្រវត្តិនៃការសិក្សារបស់អ្នក</h3>
                    <p class="small mb-0" style="color: #64748b;">មានប្រវត្តិសិក្សាចំនួន {{ educations.length }} កំណត់ត្រា</p>
                  </div>
                </div>
              </div>

              <div class="card-body p-4">
                <!-- Skeleton Loading -->
                <div v-if="loading">
                  <div v-for="n in 3" :key="n" class="d-flex gap-3 mb-3">
                    <div class="rounded-circle" style="width: 40px; height: 40px; background: #e2e8f0;"></div>
                    <div class="flex-grow-1">
                      <div class="rounded" style="height: 12px; width: 60%; margin-bottom: 8px; background: #e2e8f0;"></div>
                      <div class="rounded" style="height: 10px; width: 40%; background: #e2e8f0;"></div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="!educations.length" class="text-center py-5">
                  <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px; background: #eef2ff;">
                    <GraduationCap :size="32" style="color: #6366f1;" />
                  </div>
                  <h5 class="fw-semibold mb-2" style="color: #1e1b4b;">មិនទាន់មានប្រវត្តិសិក្សានៅឡើយទេ</h5>
                  <p class="small mb-0" style="color: #64748b;">សូមបន្ថែមប្រវត្តិសិក្សាដំបូងរបស់អ្នក ដើម្បីបំពេញប្រវត្តិរូប</p>
                </div>

                <!-- Timeline List -->
                <div v-else class="timeline-list" style="max-height: 580px; overflow-y: auto;">
                  <div
                    v-for="(edu, index) in educations"
                    :key="edu.id"
                    class="d-flex gap-3 pb-3 mb-3 border-bottom"
                    :class="{ 'rounded-3 p-3': editingId === edu.id }"
                    :style="editingId === edu.id ? 'background: #eef2ff;' : ''"
                  >
                    <div class="d-flex flex-column align-items-center flex-shrink-0" style="width: 32px;">
                      <div class="rounded-circle" style="width: 10px; height: 10px; background: #6366f1;"></div>
                      <div v-if="index < educations.length - 1" class="flex-grow-1" style="width: 2px; min-height: 40px; margin-top: 8px; background: #e2e8f0;"></div>
                    </div>
                    
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <div class="d-flex gap-2 flex-wrap">
                          <span class="badge rounded-pill px-3 py-1" style="background: #eef2ff; color: #6366f1;">{{ edu.degree?.name || 'សញ្ញាបត្រ' }}</span>
                          <span v-if="!edu.end_date" class="badge rounded-pill px-3 py-1" style="background: #d1fae5; color: #059669;">បច្ចុប្បន្ន</span>
                        </div>
                        <div class="d-flex gap-1">
                          <button class="btn btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center" 
                                  style="width: 32px; height: 32px; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569;" 
                                  @click="startEdit(edu)" title="កែប្រែ">
                            <Pencil :size="14" />
                          </button>
                          <button class="btn btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center" 
                                  style="width: 32px; height: 32px; background: #f8fafc; border: 1px solid #e2e8f0; color: #ef4444;" 
                                  @click="confirmDelete(edu)" title="លុប">
                            <Trash2 :size="14" />
                          </button>
                        </div>
                      </div>
                      
                      <h6 class="fw-bold mb-1" style="color: #1e1b4b;">{{ edu.subject?.name || 'ជំនាញសិក្សា / ឯកទេស' }}</h6>
                      
                      <div class="d-flex gap-3 flex-wrap mb-2">
                        <span class="small d-flex align-items-center gap-1" style="color: #64748b;">
                          <Building2 :size="12" />
                          {{ edu.school?.name || 'ឈ្មោះសាលា' }}
                        </span>
                        <span class="small d-flex align-items-center gap-1" style="color: #64748b;">
                          <CalendarDays :size="12" />
                          {{ formatDate(edu.start_date) }} 
                          <span v-if="edu.end_date">→ {{ formatDate(edu.end_date) }}</span>
                          <span v-else>→ បច្ចុប្បន្ន</span>
                        </span>
                      </div>
                      
                      <p v-if="edu.description" class="small mb-0" style="color: #64748b;">{{ edu.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <Teleport to="body">
        <div class="modal fade show d-block" tabindex="-1" v-if="deleteTarget" style="background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1050;">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-3">
              <div class="modal-header border-0 pb-0">
                <button type="button" class="btn-close" @click="deleteTarget = null"></button>
              </div>
              <div class="modal-body text-center pt-0 pb-4">
                <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px; background: #fef3c7;">
                  <AlertTriangle :size="24" style="color: #d97706;" />
                </div>
                <h5 class="fw-bold mb-2" style="color: #1e1b4b;">លុបប្រវត្តិសិក្សានេះ?</h5>
                <p class="small mb-4" style="color: #64748b;">
                  តើអ្នកពិតជាចង់លុបទិន្នន័យ <strong style="color: #1e1b4b;">{{ deleteTarget?.degree?.name || 'កំណត់ត្រានេះ' }}</strong> 
                  នៅ <strong style="color: #1e1b4b;">{{ deleteTarget?.school?.name || 'សាលារបស់អ្នក' }}</strong> មែនទេ?<br>
                  ទិន្នន័យដែលលុបហើយមិនអាចយកមកវិញបានទេ។
                </p>
                <div class="d-flex gap-2 justify-content-center">
                  <button class="btn rounded-2 px-4" style="background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;" @click="deleteTarget = null">បោះបង់</button>
                  <button class="btn rounded-2 px-4 text-white" style="background: #ef4444; border: none;" :disabled="deleting" @click="doDelete">
                    <Loader2 v-if="deleting" :size="14" class="spin me-1" />
                    <Trash2 v-else :size="14" class="me-1" />
                    {{ deleting ? 'កំពុងលុប...' : 'យល់ព្រមលុប' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Toast Notification -->
      <div class="position-fixed bottom-0 start-50 translate-middle-x mb-3" style="z-index: 1100;">
        <Transition name="toast">
          <div v-if="toast.show" class="toast show rounded-2 shadow-lg" role="alert" :class="toast.type === 'success' ? 'bg-success' : 'bg-danger'">
            <div class="toast-body d-flex align-items-center gap-2 text-white">
              <CheckCircle2 v-if="toast.type === 'success'" :size="16" />
              <XCircle v-else :size="16" />
              <span class="small fw-semibold">{{ toast.msg }}</span>
              <button type="button" class="btn-close btn-close-white ms-2" @click="toast.show = false"></button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { ref, computed, onMounted } from "vue"
import {
  ArrowLeft, GraduationCap, Plus, Pencil, Save, Trash2, X,
  Building2, Award, BookOpen, CalendarDays, ListChecks,
  RefreshCcw, Loader2, CheckCircle2, XCircle, AlertTriangle
} from "lucide-vue-next"
import { useAuthStores } from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"

const auth = useAuthStores()
const profileStore = useProfileStore()

// State
const educations = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)
const toast = ref({ show: false, msg: "", type: "success" })
const schoolError = ref(false)

// Search/Autocomplete
const schoolSearch = ref("")
const subjectSearch = ref("")
const showSchoolDrop = ref(false)
const showSubjectDrop = ref(false)
const filteredSchools = ref([])
const filteredSubjects = ref([])

// Mock API data
const allSchools = ref([
  { id: 1, name: "សាកលវិទ្យាល័យអន្តរជាតិភ្នំពេញ (PPIU)" },
  { id: 2, name: "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)" },
  { id: 3, name: "វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)" },
  { id: 4, name: "សាកលវិទ្យាល័យន័រតុន (Norton)" },
  { id: 5, name: "សាកលវិទ្យាល័យអន្តរជាតិផារ៉ាហ្គន (Paragon)" },
])

const degrees = ref([
  { id: 1, name: "បរិញ្ញាបត្រ (Bachelor)" },
  { id: 2, name: "បរិញ្ញាបត្រជាន់ខ្ពស់ (Master)" },
  { id: 3, name: "ថ្នាក់បណ្ឌិត (PhD)" },
  { id: 4, name: "បរិញ្ញាបត្ររង (Associate)" },
  { id: 5, name: "សញ្ញាបត្របច្ចេកទេស" },
])

const allSubjects = ref([
  { id: 1, name: "វិទ្យាសាស្ត្រកុំព្យូទ័រ" },
  { id: 2, name: "វិស្វកម្មកម្មវិធីកុំព្យូទ័រ" },
  { id: 3, name: "បច្ចេកវិទ្យាព័ត៌មាន (IT)" },
  { id: 4, name: "គ្រប់គ្រងពាណិជ្ជកម្ម" },
  { id: 5, name: "ទីផ្សារ និងការផ្សាយពាណិជ្ជកម្ម" },
])

// Form model
const emptyForm = () => ({
  school_id: null,
  school_name: "",
  degree_id: "",
  degree_name_custom: "",
  subject_id: null,
  subject_name: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
})

const form = ref(emptyForm())

const canSubmit = computed(() => {
  const hasSchool = form.value.school_id || schoolSearch.value
  const hasDegree = form.value.degree_id && (form.value.degree_id !== "custom" || form.value.degree_name_custom)
  const hasStartDate = form.value.start_date
  return hasSchool && hasDegree && hasStartDate
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const monthNames = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
  return `${monthNames[parseInt(month) - 1]} ${year}`
}

// Load data
onMounted(async () => {
  loading.value = true
  try {
    const res = await auth.profile()
    if (res.data.result) {
      educations.value = res.data.data.educations ?? []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

// Autocomplete methods
function filterSchools() {
  const query = schoolSearch.value.toLowerCase()
  filteredSchools.value = query ? allSchools.value.filter(s => s.name.toLowerCase().includes(query)) : []
}

function selectSchool(school) {
  form.value.school_id = school.id
  form.value.school_name = school.name
  schoolSearch.value = school.name
  showSchoolDrop.value = false
}

function clearSchool() {
  form.value.school_id = null
  form.value.school_name = ""
  schoolSearch.value = ""
}

function filterSubjects() {
  const query = subjectSearch.value.toLowerCase()
  filteredSubjects.value = query ? allSubjects.value.filter(s => s.name.toLowerCase().includes(query)) : []
}

function selectSubject(subject) {
  form.value.subject_id = subject.id
  form.value.subject_name = subject.name
  subjectSearch.value = subject.name
  showSubjectDrop.value = false
}

function clearSubject() {
  form.value.subject_id = null
  form.value.subject_name = ""
  subjectSearch.value = ""
}

function delayHideSchool() {
  setTimeout(() => { showSchoolDrop.value = false }, 150)
}

function delayHideSubject() {
  setTimeout(() => { showSubjectDrop.value = false }, 150)
}

function onDegreeChange() {
  if (form.value.degree_id !== "custom") {
    form.value.degree_name_custom = ""
  }
}

function onCurrentChange() {
  if (form.value.is_current) {
    form.value.end_date = ""
  }
}

function buildPayload() {
  const payload = {
    start_date: form.value.start_date,
    end_date: form.value.is_current ? null : (form.value.end_date || null),
    description: form.value.description || null,
  }

  if (form.value.school_id) {
    payload.school_id = form.value.school_id
  } else if (schoolSearch.value) {
    payload.school_name = schoolSearch.value
  }

  if (form.value.degree_id && form.value.degree_id !== "custom") {
    payload.degree_id = form.value.degree_id
  } else if (form.value.degree_name_custom) {
    payload.degree_name = form.value.degree_name_custom
  }

  if (form.value.subject_id) {
    payload.subject_id = form.value.subject_id
  } else if (subjectSearch.value) {
    payload.subject_name = subjectSearch.value
  }

  return payload
}

async function save() {
  saving.value = true
  try {
    const payload = buildPayload()
    let res
    if (editingId.value) {
      res = await profileStore.updateEducation(editingId.value, payload)
    } else {
      res = await profileStore.addEducation(payload)
    }
    
    if (res.data.result) {
      educations.value = res.data.data.educations ?? []
      showToast(editingId.value ? "បានកែប្រែព័ត៌មានរួចរាល់!" : "បានរក្សាទុកប្រវត្តិសិក្សាថ្មីរួចរាល់!", "success")
      cancelEdit()
    } else {
      showToast(res.data.message || "មិនអាចរក្សាទុកបានទេ", "error")
    }
  } catch (e) {
    console.error(e)
    const msg = e?.response?.data?.message || e?.message || "មានបញ្ហាប្រព័ន្ធ។ សូមព្យាយាមម្តងទៀត។"
    showToast(msg, "error")
  } finally {
    saving.value = false
  }
}

function startEdit(edu) {
  editingId.value = edu.id
  
  form.value.school_id = edu.school?.id ?? null
  form.value.school_name = edu.school?.name ?? ""
  schoolSearch.value = edu.school?.name ?? ""
  
  const matchedDegree = degrees.value.find(d => d.id === edu.degree?.id)
  form.value.degree_id = matchedDegree ? matchedDegree.id : "custom"
  form.value.degree_name_custom = !matchedDegree ? (edu.degree?.name ?? "") : ""
  
  form.value.subject_id = edu.subject?.id ?? null
  form.value.subject_name = edu.subject?.name ?? ""
  subjectSearch.value = edu.subject?.name ?? ""
  
  form.value.start_date = edu.start_date ?? ""
  form.value.end_date = edu.end_date ?? ""
  form.value.is_current = !edu.end_date
  form.value.description = edu.description ?? ""
  
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function cancelEdit() {
  editingId.value = null
  resetForm()
}

function resetForm() {
  schoolSearch.value = ""
  subjectSearch.value = ""
  form.value = emptyForm()
}

function confirmDelete(edu) {
  deleteTarget.value = edu
}

async function doDelete() {
  deleting.value = true
  try {
    const res = await profileStore.deleteEducation(deleteTarget.value.id)
    if (res.data.result) {
      educations.value = res.data.data.educations ?? educations.value.filter(e => e.id !== deleteTarget.value.id)
      showToast("បានលុបទិន្នន័យរួចរាល់", "success")
      deleteTarget.value = null
    } else {
      showToast(res.data.message || "មិនអាចលុបបានទេ", "error")
    }
  } catch (e) {
    console.error(e)
    const msg = e?.response?.data?.message || e?.message || "មានបញ្ហាប្រព័ន្ធ"
    showToast(msg, "error")
  } finally {
    deleting.value = false
  }
}

function showToast(msg, type = "success") {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}
</script>

<style scoped>
/* Custom styles for Bootstrap enhancements */
.education-page {
  background: #f8fafc;
}

.header-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.timeline-list::-webkit-scrollbar {
  width: 6px;
}

.timeline-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.timeline-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.timeline-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.modal.show.d-block {
  display: block;
}

/* Form focus states */
.form-control:focus,
.form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
}

/* Switch styling */
.form-switch .form-check-input {
  width: 2.5em;
  height: 1.25em;
  background-color: #e2e8f0;
  border-radius: 1.25em;
  transition: background-color 0.6s ease, border-color 0.6s ease;
  margin-right: 10px;
}

.form-switch .form-check-input:checked {
  background-color: #6366f1;
  border-color: #6366f1;
}

/* Card hover */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important;
}

/* Border bottom for timeline */
.border-bottom {
  border-bottom-color: #e2e8f0 !important;
}

/* Dropdown styling */
.dropdown-menu {
  border-color: #e2e8f0;
}

.dropdown-item:hover {
  background-color: #eef2ff;
}

/* Button hover */
.btn-primary-custom:hover {
  background: #4f46e5;
}

/* Custom text colors */
.text-primary-custom {
  color: #6366f1;
}
</style>