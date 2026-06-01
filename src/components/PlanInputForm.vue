<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import type { MarathonDTO } from '@/types/marathon'

const emit = defineEmits(['plan-created'])

const marathons = ref<MarathonDTO[]>([])
const loading = ref(false)

onMounted(async () => {
  const res = await fetch('http://localhost:8080/marathons')
  marathons.value = await res.json()
})

const dayOptions = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
]

const fitnessLevel = ref<number | null>(null)
const marathonId = ref('')
const targetTime = ref('')
const trainingsPerWeek = ref<number | null>(null)
const availableDays = ref<string[]>([])

const submit = async () => {
  loading.value = true
  const data = {
    fitnessLevel: fitnessLevel.value,
    marathonId: marathonId.value,
    targetTime: targetTime.value,
    trainingsPerWeek: trainingsPerWeek.value,
    availableDays: availableDays.value
  }

  try {
    const res = await fetch("http://localhost:8080/trainingplans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      // Reset form
      fitnessLevel.value = null
      marathonId.value = ''
      targetTime.value = ''
      trainingsPerWeek.value = null
      availableDays.value = []

      // Vertel de parent dat er een nieuw plan is
      emit('plan-created')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-card">
    <div class="card-header">
      <span class="category-tag">Create New Plan</span>
      <h2 class="form-title">Start your journey</h2>
    </div>

    <div class="form-grid">
      <!-- Row 1 -->
      <div class="input-group">
        <label>Marathon Goal</label>
        <select v-model="marathonId" class="custom-input">
          <option disabled value="">Select a marathon</option>
          <option v-for="marathon in marathons" :key="marathon.id" :value="marathon.id">
            {{ marathon.name }} ({{ marathon.city }})
          </option>
        </select>
      </div>

      <div class="input-group">
        <label>Fitness Level (1-5)</label>
        <input type="number" v-model.number="fitnessLevel" min="1" max="5" class="custom-input" placeholder="e.g. 3" />
      </div>

      <!-- Row 2 -->
      <div class="input-group">
        <label>Target Time (HH:mm:ss)</label>
        <input v-model="targetTime" placeholder="04:00:00" class="custom-input" />
      </div>

      <div class="input-group">
        <label>Workouts per week</label>
        <input type="number" v-model.number="trainingsPerWeek" min="1" max="7" class="custom-input" placeholder="e.g. 4" />
      </div>

      <!-- Row 3: Multiselect span 2 columns -->
      <div class="input-group full-width">
        <label>Available Days</label>
        <multiselect
          v-model="availableDays"
          :options="dayOptions"
          :multiple="true"
          :close-on-select="false"
          placeholder="Choose your training days"
          class="dark-multiselect"
        />
      </div>
    </div>

    <div class="form-actions">
      <button @click="submit" class="submit-btn" :disabled="loading || !marathonId">
        <span v-if="!loading">Generate Training Plan</span>
        <span v-else class="loader"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.card-header {
  margin-bottom: 24px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.5px;
}

.custom-input {
  background: #0f172a;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.custom-input:focus {
  outline: none;
  border-color: #22c55e;
}

.form-actions {
  margin-top: 32px;
}

.submit-btn {
  width: 100%;
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #4ade80;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom styling for vue-multiselect om in donker thema te passen */
:deep(.multiselect__tags) {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 8px 40px 0 12px;
}

:deep(.multiselect__input), :deep(.multiselect__single) {
  background: transparent !important;
  color: white !important;
}

:deep(.multiselect__content-wrapper) {
  background: #1e293b;
  border: 1px solid #334155;
}

:deep(.multiselect__option--highlight) {
  background: #22c55e;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #052e16;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
}
</style>
