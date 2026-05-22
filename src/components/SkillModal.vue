<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-icon-wrap">
            <Zap :size="18" />
          </div>
          <div>
            <h6 class="modal-title">គ្រប់គ្រងជំនាញ</h6>
            <p class="modal-sub">ជ្រើសរើសពីជំនាញដែលមានស្រាប់ ឬបន្ថែមជំនាញថ្មី។</p>
          </div>
          <button class="close-btn" @click="$emit('close')"><X :size="16" /></button>
        </div>

        <div class="modal-body">
          <!-- Selected skills preview -->
          <div class="selected-wrap" v-if="selected.length">
            <label class="field-label">Selected ({{ selected.length }})</label>
            <div class="tags-row">
              <span class="skill-tag" v-for="id in selected" :key="id">
                {{ skillName(id) }}
                <button class="tag-remove" @click="toggleSkill(id)"><X :size="10" /></button>
              </span>
            </div>
          </div>

          <!-- Search/filter -->
          <div class="search-wrap">
            <Search :size="14" class="search-icon" />
            <input
              v-model="search"
              type="text"
              class="search-input"
              placeholder="ជំនាញស្វែងរក…"
            />
          </div>

          <!-- Skill list -->
          <div class="skills-grid" v-if="!loadingSkills">
            <button
              v-for="skill in filteredSkills"
              :key="skill.id"
              class="skill-chip"
              :class="{ active: selected.includes(skill.id) }"
              @click="toggleSkill(skill.id)"
            >
              <Check v-if="selected.includes(skill.id)" :size="12" />
              {{ skill.name }}
            </button>
          </div>
          <div v-else class="loading-row">
            <Loader2 :size="18" class="spin" /> Loading…
          </div>

          <!-- Add new skill -->
          <div class="add-skill-row">
            <div class="input-wrap">
              <Plus :size="14" class="input-icon" />
              <input
                v-model="newSkillName"
                type="text"
                class="f-input"
                placeholder="បន្ថែមជំនាញថ្មី…"
                @keydown.enter="addNewSkill"
              />
            </div>
            <button class="btn-add" :disabled="!newSkillName.trim() || addingSkill" @click="addNewSkill">
              <Loader2 v-if="addingSkill" :size="13" class="spin" />
              <Plus v-else :size="13" />
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">បោះបង់</button>
          <button class="btn-save" :disabled="saving" @click="save">
            <Loader2 v-if="saving" :size="14" class="spin" />
            <Check v-else :size="14" />
            {{ saving ? 'Saving…' : 'រក្សាទុកជំនាញ' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Zap, Search, Check, Plus, Loader2 } from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profile'
import { useAuthStores } from '@/stores/auth'

const props = defineProps({
  currentSkills: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'saved'])

const profileStore = useProfileStore()
const auth = useAuthStores()

const search = ref('')
const selected = ref([])
const loadingSkills = ref(true)
const saving = ref(false)
const newSkillName = ref('')
const addingSkill = ref(false)

onMounted(async () => {
  selected.value = props.currentSkills.map(s => s.id)
  try {
    await profileStore.getAllSkills()
  } catch (e) {
    console.error(e)
  } finally {
    loadingSkills.value = false
  }
})

const filteredSkills = computed(() => {
  const q = search.value.toLowerCase()
  return profileStore.availableSkills.filter(s =>
    s.name.toLowerCase().includes(q)
  )
})

function skillName(id) {
  return profileStore.availableSkills.find(s => s.id === id)?.name ?? '?'
}

function toggleSkill(id) {
  const idx = selected.value.indexOf(id)
  if (idx === -1) selected.value = [...selected.value, id]
  else selected.value = selected.value.filter(x => x !== id)
}

async function addNewSkill() {
  const name = newSkillName.value.trim()
  if (!name) return
  addingSkill.value = true
  try {
    const res = await profileStore.addNewSkill(name)
    if (res.data.result) {
      const skill = res.data.data
      selected.value = [...selected.value, skill.id]
      newSkillName.value = ''
    }
  } catch (e) {
    console.error(e)
  } finally {
    addingSkill.value = false
  }
}

async function save() {
  saving.value = true
  try {
    await profileStore.updateSkills(selected.value)
    await auth.fetchUser()
    emit('saved')
    emit('close')
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ── COLOR TOKENS ─────────────────────────
   --purple-main : #534AB7
   --purple-dark : #3C3489
   --purple-light: #7F77DD
   --purple-tint : #EEEDFE
   --border      : rgba(83, 74, 183, 0.15)
───────────────────────────────────────── */

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: #fff;
  border-radius: 18px;
  width: 480px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(83, 74, 183, 0.18);
  overflow: hidden;
  animation: popIn .22s cubic-bezier(.22,1,.36,1);
}

@keyframes popIn {
  from { transform: scale(.93); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

/* ── HEADER ──────────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(83, 74, 183, 0.12);
  flex-shrink: 0;
}

.modal-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #EEEDFE;
  color: #534AB7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: .92rem;
  font-weight: 700;
  color: #2C2C2A;
  margin: 0;
}

.modal-sub {
  font-size: .74rem;
  color: #9ca3af;
  margin: 0;
}

.close-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  margin-left: auto;
  flex-shrink: 0;
  transition: background .15s, color .15s;
}
.close-btn:hover { background: #EEEDFE; color: #534AB7; }

/* ── BODY ────────────────────────────────── */
.modal-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  flex: 1;
}

.field-label {
  font-size: .7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #7F77DD;
  display: block;
  margin-bottom: 6px;
}

.selected-wrap { margin-bottom: 2px; }

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #534AB7;
  color: #fff;
  font-size: .76rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  display: flex;
  padding: 0;
  transition: color .15s;
}
.tag-remove:hover { color: #fff; }

/* ── SEARCH ──────────────────────────────── */
.search-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: .86rem;
  color: #2C2C2A;
  background: #f3f4f6;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.search-input:focus {
  border-color: #7F77DD;
  box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
  background: #fff;
}

/* ── SKILLS GRID ─────────────────────────── */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 2px;
}

.skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  font-size: .8rem;
  font-weight: 500;
  cursor: pointer;
  color: #374151;
  font-family: inherit;
  transition: all .15s;
}
.skill-chip:hover {
  border-color: #7F77DD;
  color: #534AB7;
  background: #EEEDFE;
}
.skill-chip.active {
  background: #534AB7;
  color: #fff;
  border-color: #534AB7;
  font-weight: 600;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: .84rem;
  justify-content: center;
  padding: 20px 0;
}

/* ── ADD SKILL ROW ───────────────────────── */
.add-skill-row {
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid rgba(83, 74, 183, 0.12);
  padding-top: 12px;
}

.input-wrap { position: relative; flex: 1; }

.input-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.f-input {
  width: 100%;
  padding: 9px 12px 9px 32px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: .86rem;
  color: #2C2C2A;
  background: #f3f4f6;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color .15s, box-shadow .15s, background .15s;
}
.f-input:focus {
  border-color: #7F77DD;
  box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
  background: #fff;
}

.btn-add {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: none;
  background: #534AB7;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background .15s;
}
.btn-add:hover:not(:disabled) { background: #3C3489; }
.btn-add:disabled { opacity: .4; cursor: not-allowed; }

/* ── FOOTER ──────────────────────────────── */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid rgba(83, 74, 183, 0.12);
  flex-shrink: 0;
}

.btn-cancel {
  background: #f3f4f6;
  border: none;
  border-radius: 9px;
  padding: 8px 18px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  color: #6b7280;
  font-family: inherit;
  transition: background .15s, color .15s;
}
.btn-cancel:hover { background: #EEEDFE; color: #534AB7; }

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #534AB7;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 8px 20px;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s, transform .1s;
}
.btn-save:hover:not(:disabled) { background: #3C3489; }
.btn-save:active:not(:disabled) { transform: scale(0.98); }
.btn-save:disabled { opacity: .4; cursor: not-allowed; }

/* ── SPINNER ─────────────────────────────── */
.spin { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>