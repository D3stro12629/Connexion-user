<template>
  <DashboardLayout>
    <div class="edit-profile-page min-vh-100 py-4" style="background-color: #f5f7fa;">
      <div class="container" style="max-width: 800px;">
        
        <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom" style="border-color: #e9ecef !important;">
          <button class="back-btn btn bg-white d-flex align-items-center justify-content-center" @click="$router.back()">
            <ArrowLeft :size="20" />
          </button>
          <div class="header-icon d-flex align-items-center justify-content-center rounded-4">
            <UserCog :size="22" />
          </div>
          <div>
            <h1 class="h4 fw-bold m-0" style="color: #1a1a2e;">កែសម្រួលប្រវត្តិរូប</h1>
            <p class="small m-0" style="color: #6c757d;">ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួន និងវិជ្ជាជីវៈរបស់អ្នក</p>
          </div>
        </div>

        <div class="tabs p-1 bg-white rounded-pill shadow-sm mb-4 row mx-0 text-center">
          <div class="col p-0">
            <button 
              class="tab-btn w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fs-6 border-0"
              :class="{ active: activeTab === 'personal' }"
              @click="activeTab = 'personal'"
            >
              <User :size="18" />
              <span class="d-none d-sm-inline">ព័ត៌មានផ្ទាល់ខ្លួន</span>
            </button>
          </div>
          <div class="col p-0">
            <button 
              class="tab-btn w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fs-6 border-0"
              :class="{ active: activeTab === 'professional' }"
              @click="activeTab = 'professional'"
            >
              <Briefcase :size="18" />
              <span class="d-none d-sm-inline">ព័ត៌មានវិជ្ជាជីវៈ</span>
            </button>
          </div>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'personal'" class="card border-0 rounded-4 shadow-sm overflow-hidden bg-white">
            <div class="card-header border-bottom px-4 py-3 d-flex align-items-center gap-3" style="background-color: #fafbfc; border-color: #eef2f6 !important;">
              <div class="header-badge primary d-flex align-items-center justify-content-center rounded-3">
                <User :size="16" />
              </div>
              <div>
                <h3 class="h6 fw-bold m-0" style="color: #1a1a2e;">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                <p class="small m-0" style="color: #6c757d;">ព័ត៌មានលម្អិតជាមូលដ្ឋានអំពីអ្នក</p>
              </div>
            </div>

            <div class="card-body p-4">
              <!-- Full Name -->
              <div class="mb-3">
                <label class="form-label small fw-bold" style="color: #2c3e50;">ឈ្មោះពេញ <span class="text-danger">*</span></label>
                <input 
                  v-model="personal.full_name"
                  type="text"
                  class="form-control form-control-lg rounded-3 fs-6 custom-input"
                  :class="{ 'is-invalid': validationErrors.full_name }"
                  placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក"
                  @blur="validateField('full_name')"
                />
                <div v-if="validationErrors.full_name" class="invalid-feedback d-block">
                  {{ validationErrors.full_name }}
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <label class="form-label small fw-bold" style="color: #2c3e50;">ថ្ងៃខែឆ្នាំកំណើត <span class="text-danger">*</span></label>
                  <input 
                    v-model="personal.dob"
                    type="date"
                    class="form-control form-control-lg rounded-3 fs-6 custom-input"
                    :class="{ 'is-invalid': validationErrors.dob }"
                    @blur="validateField('dob')"
                  />
                  <div v-if="validationErrors.dob" class="invalid-feedback d-block">
                    {{ validationErrors.dob }}
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label small fw-bold" style="color: #2c3e50;">លេខទូរស័ព្ទ <span class="text-danger">*</span></label>
                  <input 
                    v-model="personal.phone"
                    type="tel"
                    class="form-control form-control-lg rounded-3 fs-6 custom-input"
                    :class="{ 'is-invalid': validationErrors.phone }"
                    placeholder="0123456789"
                    @blur="validateField('phone')"
                  />
                  <div v-if="validationErrors.phone" class="invalid-feedback d-block">
                    {{ validationErrors.phone }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold" style="color: #2c3e50;">ភេទ</label>
                <div class="row g-2">
                  <div class="col-4">
                    <label class="gender-radio w-100 d-flex align-items-center justify-content-center gap-2 px-3 py-2 border rounded-3 position-relative" 
                          :class="{ active: personal.gender === 'MALE' }">
                      <input type="radio" v-model="personal.gender" value="MALE" class="position-absolute opacity-0" />
                      <span class="fs-5">♂</span>
                      <span class="small text-label">ប្រុស</span>
                    </label>
                  </div>
                  <div class="col-4">
                    <label class="gender-radio w-100 d-flex align-items-center justify-content-center gap-2 px-3 py-2 border rounded-3 position-relative" 
                          :class="{ active: personal.gender === 'FEMALE' }">
                      <input type="radio" v-model="personal.gender" value="FEMALE" class="position-absolute opacity-0" />
                      <span class="fs-5">♀</span>
                      <span class="small text-label">ស្រី</span>
                    </label>
                  </div>
                  <div class="col-4">
                    <label class="gender-radio w-100 d-flex align-items-center justify-content-center gap-2 px-3 py-2 border rounded-3 position-relative" 
                          :class="{ active: personal.gender === 'OTHER' }">
                      <input type="radio" v-model="personal.gender" value="OTHER" class="position-absolute opacity-0" />
                      <span class="fs-5">⚬</span>
                      <span class="small text-label">ផ្សេងទៀត</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <label class="form-label small fw-bold" style="color: #2c3e50;">ទីក្រុងបច្ចុប្បន្ន <span class="text-danger">*</span></label>
                  <input 
                    v-model="personal.current_city"
                    type="text"
                    class="form-control form-control-lg rounded-3 fs-6 custom-input"
                    :class="{ 'is-invalid': validationErrors.current_city }"
                    placeholder="ទីក្រុង"
                    @blur="validateField('current_city')"
                  />
                  <div v-if="validationErrors.current_city" class="invalid-feedback d-block">
                    {{ validationErrors.current_city }}
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label small fw-bold" style="color: #2c3e50;">ទីកំណើត <span class="text-danger">*</span></label>
                  <input 
                    v-model="personal.home_town"
                    type="text"
                    class="form-control form-control-lg rounded-3 fs-6 custom-input"
                    :class="{ 'is-invalid': validationErrors.home_town }"
                    placeholder="ស្រុកកំណើត"
                    @blur="validateField('home_town')"
                  />
                  <div v-if="validationErrors.home_town" class="invalid-feedback d-block">
                    {{ validationErrors.home_town }}
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold" style="color: #2c3e50;">ផលប័ត្រ / គេហទំព័រ <span class="text-danger">*</span></label>
                <input 
                  v-model="personal.portfolio_link"
                  type="url"
                  class="form-control form-control-lg rounded-3 fs-6 custom-input"
                  :class="{ 'is-invalid': validationErrors.portfolio_link }"
                  placeholder="https://example.com"
                  @blur="validateField('portfolio_link')"
                />
                <div v-if="validationErrors.portfolio_link" class="invalid-feedback d-block">
                  {{ validationErrors.portfolio_link }}
                </div>
              </div>

              <div class="d-flex flex-column-reverse flex-sm-row justify-content-sm-end gap-2 pt-3 border-top" style="border-color: #eef2f6 !important;">
                <button class="btn-cancel btn px-4 py-2 rounded-pill" @click="$router.back()">បោះបង់</button>
                <button class="btn-save btn px-4 py-2 rounded-pill d-inline-flex align-items-center justify-content-center gap-2 fw-semibold" :disabled="savingPersonal" @click="savePersonal">
                  <Loader2 v-if="savingPersonal" :size="14" class="spin" />
                  <Save v-else :size="14" />
                  {{ savingPersonal ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'professional'" class="card border-0 rounded-4 shadow-sm overflow-hidden bg-white">
            <div class="card-header border-bottom px-4 py-3 d-flex align-items-center gap-3" style="background-color: #fafbfc; border-color: #eef2f6 !important;">
              <div class="header-badge accent d-flex align-items-center justify-content-center rounded-3">
                <Briefcase :size="16" />
              </div>
              <div>
                <h3 class="h6 fw-bold m-0" style="color: #1a1a2e;">ព័ត៌មានវិជ្ជាជីវៈ</h3>
                <p class="small m-0" style="color: #6c757d;">ព័ត៌មានលម្អិតអំពីការងារ និងអាជីពរបស់អ្នក</p>
              </div>
            </div>

            <div class="card-body p-4">
              <div class="mb-3">
                <label class="form-label small fw-bold" style="color: #2c3e50;">ចំណងជើងការងារ <span class="text-danger">*</span></label>
                <input 
                  v-model="professional.job_title"
                  type="text"
                  class="form-control form-control-lg rounded-3 fs-6 custom-input"
                  :class="{ 'is-invalid': validationErrors.job_title }"
                  placeholder="ឧ. អ្នកអភិវឌ្ឍន៍ Frontend"
                  @blur="validateField('job_title')"
                />
                <div v-if="validationErrors.job_title" class="invalid-feedback d-block">
                  {{ validationErrors.job_title }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold" style="color: #2c3e50;">ក្រុមហ៊ុន <span class="text-danger">*</span></label>
                <input 
                  v-model="professional.company_name"
                  type="text"
                  class="form-control form-control-lg rounded-3 fs-6 custom-input"
                  :class="{ 'is-invalid': validationErrors.company_name }"
                  placeholder="ឈ្មោះក្រុមហ៊ុន"
                  @blur="validateField('company_name')"
                />
                <div v-if="validationErrors.company_name" class="invalid-feedback d-block">
                  {{ validationErrors.company_name }}
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold" style="color: #2c3e50;">ទំនួលខុសត្រូវ <span class="text-danger">*</span></label>
                <textarea 
                  v-model="professional.responsibility"
                  rows="5"
                  class="form-control rounded-3 fs-6 custom-input"
                  :class="{ 'is-invalid': validationErrors.responsibility }"
                  placeholder="ពណ៌នាអំពីទំនួលខុសត្រូវសំខាន់ៗ..."
                  maxlength="500"
                  @blur="validateField('responsibility')"
                ></textarea>
                <div class="text-end text-muted small mt-1" style="font-size: 0.7rem; color: #94a3b8 !important;">
                  {{ professional.responsibility?.length || 0 }} / 500
                </div>
                <div v-if="validationErrors.responsibility" class="invalid-feedback d-block">
                  {{ validationErrors.responsibility }}
                </div>
              </div>

              <div class="d-flex flex-column-reverse flex-sm-row justify-content-sm-end gap-2 pt-3 border-top" style="border-color: #eef2f6 !important;">
                <button class="btn-cancel btn px-4 py-2 rounded-pill" @click="$router.back()">បោះបង់</button>
                <button class="btn-save btn px-4 py-2 rounded-pill d-inline-flex align-items-center justify-content-center gap-2 fw-semibold" :disabled="savingPro" @click="saveProfessional">
                  <Loader2 v-if="savingPro" :size="14" class="spin" />
                  <Save v-else :size="14" />
                  {{ savingPro ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition name="toast">
        <div v-if="toast.show" 
             class="toast-notification position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 rounded-pill d-flex align-items-center gap-2 text-white shadow-lg" 
             :class="toast.type"
             style="z-index: 1050; font-size: 0.85rem;">
          <CheckCircle2 v-if="toast.type === 'success'" :size="16" />
          <XCircle v-else :size="16" />
          <span>{{ toast.msg }}</span>
        </div>
      </Transition>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue"
import {
  ArrowLeft, UserCog, User, Briefcase, Save, Loader2, CheckCircle2, XCircle
} from "lucide-vue-next"
import { useAuthStores } from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const auth = useAuthStores()
const profileStore = useProfileStore()

const activeTab = ref('personal')

const personal = ref({
  full_name: "",
  dob: "",
  gender: "MALE",
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

const savingPersonal = ref(false)
const savingPro = ref(false)
const toast = ref({ show: false, msg: "", type: "success" })

const validationErrors = reactive({
  full_name: "",
  dob: "",
  phone: "",
  current_city: "",
  home_town: "",
  portfolio_link: "",
  job_title: "",
  company_name: "",
  responsibility: ""
})

function showToast(msg, type = "success") {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ── Validators ───────────────────────────────────────────────

function validateFullName(name) {
  if (!name || name.trim() === "") return "សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក"
  return ""
}

function validateDOB(dob) {
  if (!dob || dob.trim() === "") return "សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើត"
  return ""
}

function validatePhone(phone) {
  if (!phone || phone.trim() === "") return "សូមបញ្ចូលលេខទូរស័ព្ទ"
  return ""
}

function validateCity(city) {
  if (!city || city.trim() === "") return "សូមបញ្ចូលទីក្រុងបច្ចុប្បន្ន"
  return ""
}

function validateHomeTown(town) {
  if (!town || town.trim() === "") return "សូមបញ្ចូលទីកំណើត"
  return ""
}

function validatePortfolioLink(url) {
  if (!url || url.trim() === "") return "សូមបញ្ចូលផលប័ត្រ ឬ URL គេហទំព័រ"
  return ""
}

function validateJobTitle(title) {
  if (!title || title.trim() === "") return "សូមបញ្ចូលចំណងជើងការងារ"
  return ""
}

function validateCompanyName(name) {
  if (!name || name.trim() === "") return "សូមបញ្ចូលឈ្មោះក្រុមហ៊ុន"
  return ""
}

function validateResponsibility(resp) {
  if (!resp || resp.trim() === "") return "សូមបញ្ចូលទំនួលខុសត្រូវ"
  return ""
}

function validateField(fieldName) {
  switch (fieldName) {
    case 'full_name':      validationErrors.full_name      = validateFullName(personal.value.full_name); break
    case 'dob':            validationErrors.dob            = validateDOB(personal.value.dob); break
    case 'phone':          validationErrors.phone          = validatePhone(personal.value.phone); break
    case 'current_city':   validationErrors.current_city   = validateCity(personal.value.current_city); break
    case 'home_town':      validationErrors.home_town      = validateHomeTown(personal.value.home_town); break
    case 'portfolio_link': validationErrors.portfolio_link = validatePortfolioLink(personal.value.portfolio_link); break
    case 'job_title':      validationErrors.job_title      = validateJobTitle(professional.value.job_title); break
    case 'company_name':   validationErrors.company_name   = validateCompanyName(professional.value.company_name); break
    case 'responsibility': validationErrors.responsibility = validateResponsibility(professional.value.responsibility); break
  }
}

function validateAllPersonal() {
  ['full_name', 'dob', 'phone', 'current_city', 'home_town', 'portfolio_link'].forEach(f => validateField(f))
  return !['full_name', 'dob', 'phone', 'current_city', 'home_town', 'portfolio_link'].some(f => validationErrors[f])
}

function validateAllProfessional() {
  ['job_title', 'company_name', 'responsibility'].forEach(f => validateField(f))
  return !['job_title', 'company_name', 'responsibility'].some(f => validationErrors[f])
}


onMounted(async () => {
  try {
    const res = await auth.profile()
    if (res.data.result) {
      const d = res.data.data
      personal.value = {
        full_name:      d.full_name ?? "",
        dob:            d.dob?.split("T")[0] ?? "",
        gender:         d.gender ?? "MALE",
        phone:          d.phone ?? "",
        current_city:   d.current_city ?? "",
        home_town:      d.home_town ?? "",
        portfolio_link: d.portfolio_link ?? "",
      }
      professional.value = {
        job_title:      d.professional?.job_title ?? "",
        company_name:   d.professional?.company_name ?? "",
        responsibility: d.professional?.responsibility ?? "",
      }
    }
  } catch (e) {
    console.error("Failed to load profile", e)
    showToast("មិនអាចផ្ទុកទិន្នន័យប្រវត្តិរូបបានទេ", "error")
  }
})


async function savePersonal() {
  if (!validateAllPersonal()) {
    showToast("សូមបំពេញព័ត៌មានទាំងអស់ឱ្យបានត្រឹមត្រូវ", "error")
    return
  }
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
    console.error("Save error:", e)
    showToast("មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត", "error")
  } finally {
    savingPersonal.value = false
  }
}

async function saveProfessional() {
  if (!validateAllProfessional()) {
    showToast("សូមបំពេញព័ត៌មានទាំងអស់ឱ្យបានត្រឹមត្រូវ", "error")
    return
  }
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
    console.error("Save error:", e)
    showToast("មានបញ្ហាកើតឡើង សូមព្យាយាមម្តងទៀត", "error")
  } finally {
    savingPro.value = false
  }
}
</script>

<style scoped>
.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  color: #495057;
  transition: all 0.2s;
}
.back-btn:hover {
  background: #f8f9fa;
  border-color: #534AB7;
  color: #534AB7;
}

.header-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #EEEDFE 0%, #E8E6FD 100%);
  color: #534AB7;
}

.tabs {
  background: white;
  border-radius: 60px;
}
.tab-btn {
  background: transparent;
  color: #6c757d;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: #534AB7;
  background: #f8f9fa;
}
.tab-btn.active {
  background: #534AB7;
  color: white;
  box-shadow: 0 4px 12px rgba(83, 74, 183, 0.25);
}

.header-badge.primary {
  width: 36px;
  height: 36px;
  background: #EEEDFE;
  color: #534AB7;
}
.header-badge.accent {
  width: 36px;
  height: 36px;
  background: #FFF3E0;
  color: #ED8936;
}

.custom-input {
  border: 1.5px solid #e2e8f0;
  background: #fefefe;
  transition: all 0.2s;
}
.custom-input:focus {
  outline: none;
  border-color: #534AB7;
  box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
}
.custom-input.is-invalid {
  border-color: #dc2626;
}
.custom-input.is-invalid:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.gender-radio {
  background: #f8f9fa;
  border: 1.5px solid #e2e8f0 !important;
  cursor: pointer;
  transition: all 0.2s;
}
.gender-radio .text-label {
  color: #6c757d;
}
.gender-radio:hover,
.gender-radio.active {
  border-color: #534AB7 !important;
  background: #EEEDFE;
}
.gender-radio.active .text-label {
  color: #534AB7;
  font-weight: 500;
}

.btn-cancel {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  color: #6c757d;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: #e9ecef;
  border-color: #ced4da;
}

.btn-save {
  background: #534AB7;
  color: white;
  border: none;
  transition: all 0.2s;
}
.btn-save:hover:not(:disabled) {
  background: #3C3489;
  transform: translateY(-1px);
}
.btn-save:disabled {
  opacity: 0.6;
}

.invalid-feedback {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #dc2626;
}

.toast-notification.success { background: #534AB7; }
.toast-notification.error   { background: #dc2626; }

.spin {
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px) !important;
}
</style>