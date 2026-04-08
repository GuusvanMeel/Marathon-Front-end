<template>
  <div class="dashboard">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1>🏃 Marathon <span class="highlight">Pro</span></h1>
        <button @click="fetchPlans" :disabled="loading" class="refresh-btn">
          <span v-if="loading">⏳ Loading...</span>
          <span v-else>🔄 Refresh Plans</span>
        </button>
      </div>
    </header>

    <main class="container">
      <!-- Empty State -->
      <div v-if="plans.length === 0 && !loading" class="empty-state">
        <div class="icon">👟</div>
        <h2>No training plans found</h2>
        <p>Click the refresh button to load your data from the API.</p>
      </div>

      <!-- Plans Grid -->
      <div v-else class="plans-grid">
        <div v-for="plan in plans" :key="plan.id" class="plan-card">

          <!-- Card Header: Marathon Info -->
          <div class="card-header">
            <div class="marathon-info">
              <span class="marathon-tag">Marathon</span>
              <h3>{{ plan.marathonName || 'Unnamed Marathon' }}</h3>
              <p class="marathon-meta">📅 {{ formatDate(plan.startDate) }} — {{ formatDate(plan.endDate) }}</p>
            </div>
            <div :class="['status-badge', plan.status.toLowerCase()]">
              {{ plan.status }}
            </div>
          </div>

          <!-- Progress Overview -->
          <div class="progress-section">
            <div class="progress-stats">
              <span>Overall Progress</span>
              <span>{{ calculateProgress(plan.items) }}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: calculateProgress(plan.items) + '%' }"></div>
            </div>
          </div>

          <!-- Training Items List -->
          <div class="items-section">
            <h4>Training Schedule</h4>
            <div class="items-list">
              <div v-for="item in plan.items" :key="item.id" class="training-item">
                <div class="item-date">
                  <span class="day">{{ getDay(item.date) }}</span>
                  <span class="month">{{ getMonth(item.date) }}</span>
                </div>

                <div class="item-details">
                  <div class="item-main">
                    <span class="distance-target">{{ item.targetDistance || 0 }} km</span>
                    <span :class="['item-status-dot', item.status.toLowerCase()]"></span>
                  </div>
                  <div class="item-sub">
                    <span v-if="item.actualDistance">Done: {{ item.actualDistance }}km</span>
                    <span v-else>Pending</span>
                    <span class="time-meta">⏱️ {{ formatTime(item.targetTime) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!plan.items || plan.items.length === 0" class="no-items">
                No items scheduled yet.
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button class="details-btn">View Full Details</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const plans = ref<any[]>([])
const loading = ref(false)

const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/trainingplans')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()

    const plansWithItems = await Promise.all(
      data.map(async (plan: any) => {
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

// Helpers
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getDay = (dateStr: string) => new Date(dateStr).getDate()
const getMonth = (dateStr: string) => new Date(dateStr).toLocaleString('default', { month: 'short' })

const formatTime = (time: string | null) => time && time !== '00:00:00' ? time.substring(0, 5) : '--:--'

const calculateProgress = (items: any[]) => {
  if (!items || items.length === 0) return 0
  const completed = items.filter(i => i.status === 'COMPLETED' || i.actualDistance > 0).length
  return Math.round((completed / items.length) * 100)
}
</script>

<style scoped>
/* Modern CSS Reset/Styles */
.dashboard {
  min-height: 100vh;
  background-color: #f0f2f5;
  color: #1a1a1a;
  font-family: 'Inter', -apple-system, sans-serif;
}

.dashboard-header {
  background: #1e293b;
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.highlight {
  color: #38bdf8;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
}

/* Button Styles */
.refresh-btn {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #7dd3fc;
  transform: translateY(-1px);
}

/* Grid Layout */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Plan Card */
.plan-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.5rem;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.marathon-tag {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  font-weight: 700;
}

.marathon-info h3 {
  margin: 0.25rem 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.marathon-meta {
  font-size: 0.85rem;
  color: #64748b;
}

/* Badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.planned { background: #e0f2fe; color: #075985; }

/* Progress Section */
.progress-section {
  padding: 1rem 1.5rem;
  background: #f8fafc;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.progress-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #10b981;
  transition: width 0.5s ease-out;
}

/* Training Items List */
.items-section {
  padding: 1.5rem;
  flex-grow: 1;
}

.items-section h4 {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #64748b;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.training-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
}

.item-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 40px;
  line-height: 1;
}

.item-date .day { font-weight: 700; font-size: 1.1rem; }
.item-date .month { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; }

.item-details {
  flex-grow: 1;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distance-target {
  font-weight: 600;
  color: #334155;
}

.item-sub {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  gap: 10px;
}

.item-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.item-status-dot.completed { background: #10b981; box-shadow: 0 0 5px #10b981; }
.item-status-dot.todo { background: #cbd5e1; }

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.details-btn {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
}

.details-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  color: #94a3b8;
}

.empty-state .icon { font-size: 4rem; margin-bottom: 1rem; }
</style>
