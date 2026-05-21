<template>
  <DashboardLayout>
    <div class="edit-profile-page bg-light min-vh-100">
      <div class="container py-4">
        <!-- Page Header -->
        <div class="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <button class="btn btn-link text-dark p-0 text-decoration-none" @click="$router.back()">
            <ArrowLeft :size="20" />
          </button>
          <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center p-2" style="width: 44px; height: 44px;">
            <UserCog :size="22" class="text-primary" />
          </div>
          <div>
            <h1 class="h4 fw-bold text-muted mb-2">កែសម្រួលប្រវត្តិរូប</h1>
            <p class="text-muted small mb-0">ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួន និងវិជ្ជាជីវៈរបស់អ្នក</p>
          </div>
        </div>

        <div class="row g-4">
          <!-- LEFT COLUMN: Personal Information -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
                <div class="d-flex align-items-center gap-2">
                  <div class="bg-primary bg-opacity-10 rounded-circle p-1">
                    <User :size="16" class="text-primary" />
                  </div>
                  <h3 class="h6 fw-semibold mb-0">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                </div>
                <p class="small text-muted mt-1 mb-0 ms-4 ps-1">ព័ត៌មានលម្អិតជាមូលដ្ឋានអំពីអ្នក</p>
              </div>

              <div class="card-body p-4 pt-3">
                <!-- Full Name -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">
                    ឈ្មោះពេញ <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <User :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="personal.full_name" 
                      type="text" 
                      class="form-control bg-light border-start-0"
                      placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក"
                    />
                  </div>
                </div>

                <!-- Date of Birth -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ថ្ងៃខែឆ្នាំកំណើត</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <CalendarDays :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="personal.dob" 
                      type="date" 
                      class="form-control bg-light border-start-0"
                    />
                  </div>
                </div>

                <!-- Gender -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ភេទ</label>
                  <div class="d-flex gap-2">
                    <label class="gender-option flex-fill text-center" :class="{ active: personal.gender === 1 }">
                      <input type="radio" v-model="personal.gender" :value="1" hidden />
                      <span class="d-block fs-5">♂</span>
                      <span class="small">ប្រុស</span>
                    </label>
                    <label class="gender-option flex-fill text-center" :class="{ active: personal.gender === 2 }">
                      <input type="radio" v-model="personal.gender" :value="2" hidden />
                      <span class="d-block fs-5">♀</span>
                      <span class="small">ស្រី</span>
                    </label>
                    <label class="gender-option flex-fill text-center" :class="{ active: personal.gender === 3 }">
                      <input type="radio" v-model="personal.gender" :value="3" hidden />
                      <span class="d-block fs-5">⚬</span>
                      <span class="small">ផ្សេងទៀត</span>
                    </label>
                  </div>
                </div>

                <!-- Phone -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">លេខទូរស័ព្ទ</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Phone :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="personal.phone" 
                      type="tel" 
                      class="form-control bg-light border-start-0"
                      placeholder="ឧទាហរណ៍ 012 345 678"
                    />
                  </div>
                </div>

                <!-- Location Fields -->
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">ទីក្រុងបច្ចុប្បន្ន</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0">
                        <MapPin :size="15" class="text-muted" />
                      </span>
                      <input 
                        v-model="personal.current_city" 
                        type="text" 
                        class="form-control bg-light border-start-0"
                        placeholder="ទីក្រុង"
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">ទីកំណើត</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0">
                        <Home :size="15" class="text-muted" />
                      </span>
                      <input 
                        v-model="personal.home_town" 
                        type="text" 
                        class="form-control bg-light border-start-0"
                        placeholder="ស្រុកកំណើត"
                      />
                    </div>
                  </div>
                </div>

                <!-- Portfolio Link -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ផលប័ត្រ / គេហទំព័រ</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Globe :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="personal.portfolio_link" 
                      type="url" 
                      class="form-control bg-light border-start-0"
                      placeholder="https://គេហទំព័ររបស់អ្នក.com"
                    />
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2 justify-content-end pt-3 border-top mt-4">
                  <button class="btn btn-light btn-sm px-4 rounded-2" @click="$router.back()">
                    បោះបង់
                  </button>
                  <button class="btn btn-primary btn-sm px-4 rounded-2" :disabled="savingPersonal" @click="savePersonal">
                    <Loader2 v-if="savingPersonal" :size="14" class="spin me-1" />
                    <Save v-else :size="14" class="me-1" />
                    {{ savingPersonal ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Professional Information -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm rounded-3">
              <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
                <div class="d-flex align-items-center gap-2">
                  <div class="bg-warning bg-opacity-10 rounded-circle p-1">
                    <Briefcase :size="16" class="text-warning" />
                  </div>
                  <h3 class="h6 fw-semibold mb-0">ព័ត៌មានវិជ្ជាជីវៈ</h3>
                </div>
                <p class="small text-muted mt-1 mb-0 ms-4 ps-1">ព័ត៌មានលម្អិតអំពីការងារ និងអាជីពរបស់អ្នក</p>
              </div>

              <div class="card-body p-4 pt-3">
                <!-- Job Title -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ចំណងជើងការងារ</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Briefcase :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="professional.job_title" 
                      type="text" 
                      class="form-control bg-light border-start-0"
                      placeholder="ឧទាហរណ៍ អ្នកអភិវឌ្ឍន៍ Frontend"
                    />
                  </div>
                </div>

                <!-- Company Name -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ក្រុមហ៊ុន</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Building2 :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="professional.company_name" 
                      type="text" 
                      class="form-control bg-light border-start-0"
                      placeholder="ឈ្មោះក្រុមហ៊ុន"
                    />
                  </div>
                </div>

                <!-- Responsibilities -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ទំនួលខុសត្រូវ</label>
                  <textarea 
                    v-model="professional.responsibility" 
                    class="form-control bg-light" 
                    rows="4"
                    placeholder="ពណ៌នាអំពីទំនួលខុសត្រូវសំខាន់ៗ សមិទ្ធផល និងការងារប្រចាំថ្ងៃរបស់អ្នក..."
                  ></textarea>
                  <div class="text-end small text-muted mt-1">
                    {{ professional.responsibility?.length || 0 }} / 500
                  </div>
                </div>

                <!-- Divider -->
                <div class="position-relative text-center my-4">
                  <hr class="text-muted" />
                  <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">
                    សុវត្ថិភាព
                  </span>
                </div>

                <!-- Change Password Section -->
                <div class="mb-3">
                  <label class="form-label small fw-semibold text-secondary mb-1">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <KeyRound :size="15" class="text-muted" />
                    </span>
                    <input 
                      v-model="passwords.current" 
                      :type="showPwd[0] ? 'text' : 'password'" 
                      class="form-control bg-light border-start-0"
                      placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន"
                    />
                    <button class="btn btn-light border-start-0" type="button" @click="showPwd[0] = !showPwd[0]">
                      <Eye v-if="!showPwd[0]" :size="14" />
                      <EyeOff v-else :size="14" />
                    </button>
                  </div>
                </div>

                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">ពាក្យសម្ងាត់ថ្មី</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0">
                        <KeyRound :size="15" class="text-muted" />
                      </span>
                      <input 
                        v-model="passwords.password" 
                        :type="showPwd[1] ? 'text' : 'password'" 
                        class="form-control bg-light border-start-0"
                        placeholder="ពាក្យសម្ងាត់ថ្មី"
                      />
                      <button class="btn btn-light border-start-0" type="button" @click="showPwd[1] = !showPwd[1]">
                        <Eye v-if="!showPwd[1]" :size="14" />
                        <EyeOff v-else :size="14" />
                      </button>
                    </div>
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">បញ្ជាក់ពាក្យសម្ងាត់</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0">
                        <KeyRound :size="15" class="text-muted" />
                      </span>
                      <input 
                        v-model="passwords.password_confirmation" 
                        :type="showPwd[2] ? 'text' : 'password'" 
                        class="form-control bg-light border-start-0"
                        placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                      />
                      <button class="btn btn-light border-start-0" type="button" @click="showPwd[2] = !showPwd[2]">
                        <Eye v-if="!showPwd[2]" :size="14" />
                        <EyeOff v-else :size="14" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2 justify-content-end pt-3 border-top">
                  <button 
                    class="btn btn-outline-secondary btn-sm px-3 rounded-2"
                    :disabled="!passwords.current"
                    @click="savePassword"
                  >
                    <KeyRound :size="13" class="me-1" /> ប្ដូរពាក្យសម្ងាត់
                  </button>
                  <button class="btn btn-primary btn-sm px-4 rounded-2" :disabled="savingPro" @click="saveProfessional">
                    <Loader2 v-if="savingPro" :size="14" class="spin me-1" />
                    <Save v-else :size="14" class="me-1" />
                    {{ savingPro ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <Transition name="toast">
        <div v-if="toast.show" class="toast-notification position-fixed bottom-0 start-50 translate-middle-x mb-3 z-3" :class="toast.type">
          <CheckCircle2 v-if="toast.type === 'success'" :size="16" />
          <XCircle v-else :size="16" />
          <span class="small fw-semibold">{{ toast.msg }}</span>
        </div>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import {
  ArrowLeft, UserCog, User, CalendarDays, Phone,
  MapPin, Home, Globe, Briefcase, Building2, Save,
  Loader2, CheckCircle2, XCircle, KeyRound, Eye, EyeOff
} from "lucide-vue-next"
import { useAuthStores } from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const auth = useAuthStores()
const profileStore = useProfileStore()

// State
const personal = ref({
  full_name: "",
  dob: "",
  gender: 1,
  phone: "",
  current_city: "",
  home_town: "",
  portfolio_link: "",
})

const professional = ref({
  job_title: "",
  company_name: "",
  responsibility: "",
})

const passwords = ref({
  current: "",
  password: "",
  password_confirmation: "",
})

const showPwd = ref([false, false, false])
const savingPersonal = ref(false)
const savingPro = ref(false)
const toast = ref({ show: false, msg: "", type: "success" })

// Load existing data
onMounted(async () => {
  try {
    const res = await auth.profile()
    if (res.data.result) {
      const d = res.data.data
      personal.value = {
        full_name: d.full_name ?? "",
        dob: d.dob?.split("T")[0] ?? "",
        gender: d.gender ?? 1,
        phone: d.phone ?? "",
        current_city: d.current_city ?? "",
        home_town: d.home_town ?? "",
        portfolio_link: d.portfolio_link ?? "",
      }
      professional.value = {
        job_title: d.professional?.job_title ?? "",
        company_name: d.professional?.company_name ?? "",
        responsibility: d.professional?.responsibility ?? "",
      }
    }
  } catch (e) {
    console.error("Failed to load profile", e)
  }
})

// Save personal info
async function savePersonal() {
  savingPersonal.value = true
  try {
    const res = await profileStore.updatePersonalInfo(personal.value)
    if (res.data.result) {
      showToast("ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានរក្សាទុកដោយជោគជ័យ!", "success")
      await auth.fetchUser()
    } else {
      showToast(res.data.message || "មិនអាចរក្សាទុកបានទេ", "error")
    }
  } catch (e) {
    showToast("មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត", "error")
  } finally {
    savingPersonal.value = false
  }
}

// Save professional info
async function saveProfessional() {
  savingPro.value = true
  try {
    const res = await profileStore.updateProfessional(professional.value)
    if (res.data.result) {
      showToast("ព័ត៌មានវិជ្ជាជីវៈត្រូវបានរក្សាទុកដោយជោគជ័យ!", "success")
      await auth.fetchUser()
    } else {
      showToast(res.data.message || "មិនអាចរក្សាទុកបានទេ", "error")
    }
  } catch (e) {
    showToast("មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត", "error")
  } finally {
    savingPro.value = false
  }
}

// Change password
async function savePassword() {
  if (passwords.value.password !== passwords.value.password_confirmation) {
    showToast("ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ", "error")
    return
  }
  
  if (passwords.value.password && passwords.value.password.length < 6) {
    showToast("ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ", "error")
    return
  }
  
  try {
    const res = await profileStore.changePassword({
      current_password: passwords.value.current,
      password: passwords.value.password,
      password_confirmation: passwords.value.password_confirmation,
    })
    if (res.data.result) {
      showToast("ពាក្យសម្ងាត់ត្រូវបានប្ដូរដោយជោគជ័យ!", "success")
      passwords.value = { current: "", password: "", password_confirmation: "" }
    } else {
      showToast(res.data.message || "មិនអាចប្ដូរពាក្យសម្ងាត់បានទេ", "error")
    }
  } catch (e) {
    showToast("ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ", "error")
  }
}

// Toast helper
function showToast(msg, type = "success") {
  toast.value = { show: true, msg, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
.edit-profile-page {
  background: #f8f9fa;
}

/* Gender Options */
.gender-option {
  cursor: pointer;
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  transition: all 0.2s ease;
  color: #64748b;
}

.gender-option:hover {
  border-color: #6366f1;
  background: #eef2ff;
}

.gender-option.active {
  border-color: #6366f1;
  background: #eef2ff;
  color: #6366f1;
  font-weight: 600;
}

/* Form Controls */
.form-control:focus,
.input-group-text:focus,
.form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.15rem rgba(99, 102, 241, 0.1);
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #e2e8f0;
}

.form-control.bg-light {
  background-color: #f8f9fa;
}

.form-control.bg-light:focus {
  background-color: #ffffff;
}

/* Card Styles */
.card {
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important;
}

/* Toast Notification */
.toast-notification {
  background: #1e293b;
  color: white;
  padding: 10px 24px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1060;
}

.toast-notification.success {
  background: #10b981;
}

.toast-notification.error {
  background: #ef4444;
}

/* Animations */
.spin {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .gender-option {
    font-size: 0.75rem;
  }
  
  .btn-sm {
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .gender-option span:first-child {
    font-size: 1.1rem;
  }
  
  .gender-option span.small {
    font-size: 0.7rem;
  }
}
</style>