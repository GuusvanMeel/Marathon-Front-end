<template>
  <div class="dashboard-root">
    <main class="container">
      <!-- Action Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Your <span class="highlight">Training Plans</span></h1>
          <p class="page-subtitle">Track your progress and upcoming milestones.</p>
        </div>
        <button @click="fetchPlans" :disabled="loading" class="refresh-btn">
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          <span v-else class="loader"></span>
          {{ loading ? 'Updating...' : 'Refresh Data' }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="plans.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M18.8 6c.4 0 .7.3.7.7v10.7c0 .4-.3.7-.7.7H5.2c-.4 0-.7-.3-.7-.7V6.7c0-.4.3-.7.7-.7h13.6z"/><path d="M9 12v.01"/><path d="M15 12v.01"/><path d="M12 16v.01"/></svg>
        </div>
        <h2>No plans found</h2>
        <p>Sync with the API to see your scheduled marathons.</p>
      </div>

      <!-- Plans Grid -->
      <div v-else class="plans-grid">
        <div v-for="plan in plans" :key="plan.id" class="plan-card">

          <!-- Card Header -->
          <div class="card-top">
            <div class="marathon-info">
              <span class="category-tag">Goal Race</span>
              <h3>{{ plan.marathonName || 'Unnamed Marathon' }}</h3>
              <div class="date-range">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                {{ formatDate(plan.startDate) }} — {{ formatDate(plan.endDate) }}
              </div>
            </div>
            <div :class="['status-pill', plan.status.toLowerCase()]">
              {{ plan.status }}
            </div>
          </div>

          <!-- Progress -->
          <div class="progress-box">
            <div class="progress-label">
              <span>Overall Completion</span>
              <span class="percentage">{{ calculateProgress(plan.items) }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: calculateProgress(plan.items) + '%' }"></div>
            </div>
          </div>

          <!-- Training Items -->
          <div class="schedule-section">
            <label>Upcoming Schedule</label>
            <div class="items-container">
              <div v-for="item in plan.items" :key="item.id" class="workout-row">
                <div class="workout-date">
                  <span class="day">{{ getDay(item.date) }}</span>
                  <span class="month">{{ getMonth(item.date) }}</span>
                </div>

                <div class="workout-main">
                  <div class="workout-title">
                    <span class="distance">{{ item.targetDistance || 0 }} km</span>
                    <span :class="['dot', item.status.toLowerCase()]"></span>
                  </div>
                  <div class="workout-meta">
                    <span v-if="item.actualDistance" class="done">Completed: {{ item.actualDistance }}km</span>
                    <span v-else>Planned Session</span>
                    <span class="time">⏱ {{ formatTime(item.targetTime) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!plan.items || plan.items.length === 0" class="empty-items">
                No sessions generated yet.
              </div>
            </div>
          </div>

          <!-- Footer Action -->
          <div class="card-footer">
            <button class="view-btn">
              Open Full Plan
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { TrainingItemListDTO } from '@/types/trainingitem'
import type { TrainingPlanListDTO } from '@/types/trainingplan'
import { ref } from 'vue'

const plans = ref<TrainingPlanListDTO[]>([])
const loading = ref(false)

const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/trainingplans')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()

    const plansWithItems = await Promise.all(
      data.map(async (plan: TrainingPlanListDTO) => {
        try {
          const res = await fetch(`http://localhost:8080/trainingitems/${plan.id}/item`)
          const items = res.ok ? await res.json() : []
          return { ...plan, items }
        } catch {
          return { ...plan, items: [] }
        }
      })
    )
    plans.value = plansWithItems
  } catch (error) {
    console.error('Error fetching plans:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
const getDay = (dateStr: string) => new Date(dateStr).getDate()
const getMonth = (dateStr: string) => new Date(dateStr).toLocaleString('default', { month: 'short' })
const formatTime = (time: string | null) => time && time !== '00:00:00' ? time.substring(0, 5) : '--:--'

const calculateProgress = (items: TrainingItemListDTO[]) => {
  if (!items || items.length === 0) return 0
  const completed = items.filter(i => i.status === 'COMPLETED' || (i.actualDistance ?? 0) > 0).length
  return Math.round((completed / items.length) * 100)
}
</script>

<style scoped>
.dashboard-root {
  min-height: 100vh;
  background-color: #0f172a; /* Same as Home */
  color: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.highlight { color: #22c55e; }

.page-subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
}

/* Refresh Button */
.refresh-btn {
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #4ade80;
  transform: translateY(-2px);
}

.refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

/* Plan Card */
.plan-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease;
}

.plan-card:hover { border-color: #22c55e; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.category-tag {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #22c55e;
  letter-spacing: 1px;
}

.marathon-info h3 {
  font-size: 1.4rem;
  margin: 4px 0;
}

.date-range {
  font-size: 0.85rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Status Pill */
.status-pill {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}
.status-pill.active { background: #064e3b; color: #34d399; }
.status-pill.planned { background: #1e3a8a; color: #93c5fd; }

/* Progress */
.progress-box {
  background: #0f172a;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 8px;
  color: #94a3b8;
}

.percentage { color: #f8fafc; font-weight: 700; }

.progress-track {
  height: 6px;
  background: #334155;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 10px;
  transition: width 0.8s ease;
}

/* Schedule Section */
.schedule-section label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 12px;
}

.items-container {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.workout-row {
  background: #273549;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.workout-date {
  text-align: center;
  min-width: 45px;
  border-right: 1px solid #334155;
  padding-right: 12px;
}

.workout-date .day { display: block; font-size: 1.1rem; font-weight: 800; }
.workout-date .month { font-size: 0.65rem; text-transform: uppercase; color: #94a3b8; }

.workout-main { flex: 1; }

.workout-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distance { font-weight: 700; color: #f8fafc; }

.dot { width: 8px; height: 8px; border-radius: 50%; background: #475569; }
.dot.completed { background: #22c55e; box-shadow: 0 0 8px #22c55e; }

.workout-meta {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}

/* Footer */
.card-footer {
  margin-top: auto;
  padding-top: 24px;
}

.view-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #334155;
  border-color: #475569;
}

/* Loader Simple */
.loader {
  width: 16px;
  height: 16px;
  border: 2px solid #052e16;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 100px 0;
  color: #64748b;
}

.empty-icon { margin-bottom: 20px; opacity: 0.5; }
</style>
