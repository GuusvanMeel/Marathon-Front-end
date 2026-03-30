<template>
  <div class="container">
    <h1 style="color: aliceblue;">🏃 Training Plans</h1>

    <button @click="fetchPlans" class="load-btn">
      Load Training Plans
    </button>

    <div v-if="plans.length" class="plans">
      <div v-for="plan in plans" :key="plan.id" class="plan-card">
        <p1>marathon id: {{ plan.marathonId }}</p1>
        <div class="plan-header">
          <span class="status" :class="plan.status">
            {{ plan.status }}
          </span>
        </div>

        <div class="plan-body">
          <p><strong>Start:</strong> {{ formatDate(plan.startDate) }}</p>
          <p><strong>End:</strong> {{ formatDate(plan.endDate) }}</p>
        </div>
        <div>
          <h4>🏃 Training Items:</h4>

          <div v-if="plan.items?.length" class="items">
            <div v-for="item in plan.items" :key="item.id" class="item-card">

              <div class="item-header">
                <span class="status" :class="item.status">
                  {{ item.status }}
                </span>
              </div>

              <div class="item-body">
                <p><strong>Date:</strong> {{ formatDate(item.date) }}</p>

                <p><strong>Target Distance:</strong> {{ item.targetDistance ?? '-' }} km</p>
                <p><strong>Actual Distance:</strong> {{ item.actualDistance ?? '-' }} km</p>

                <p><strong>Target Time:</strong> {{ formatTime(item.targetTime) }}</p>
                <p><strong>Actual Time:</strong> {{ formatTime(item.actualTime) }}</p>
              </div>

            </div>
          </div>

          <!-- 🔥 dit is de fallback -->
          <p v-else>No training items</p>
        </div>

      </div>
    </div>

    <p v-else>No plans loaded</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 🔹 hier komt je data (frontend state)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plans = ref<any[]>([])

// 🔹 DIT is je backend koppeling
const fetchPlans = async () => {
  try {
    const response = await fetch('http://localhost:8080/trainingplans/test')

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()

    // 🔥 voor elk plan items ophalen
    const plansWithItems = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map(async (plan: any) => {
        const res = await fetch(`http://localhost:8080/trainingitems/${plan.id}/item`)

        if (!res.ok) {
          console.error('Failed to load items for plan', plan.id)
          return { ...plan, items: [] }
        }

        const items = await res.json()

        return {
          ...plan,
          items
        }
      })
    )

    plans.value = plansWithItems

  } catch (error) {
    console.error('Error fetching plans:', error)
  }
}
// 🔹 helper voor datum
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
const formatTime = (time: string | null) => {
  if (!time) return '-'
  return time // "00:30:00" is al netjes
}

</script>

<style scoped>
.container {
  max-width: 1200px;
  /* of 1400px */
  margin: auto;
  padding: 20px;
}

.load-btn {
  margin-bottom: 20px;
  padding: 10px 16px;
  cursor: pointer;
}

.plans {
  display: flex;
  flex-wrap: wrap;
  /* 🔥 zorgt dat het naar volgende regel gaat */
  gap: 16px;
  justify-content: center;
  /* optioneel: centreert alles */
}

.plan-card {
  flex: 1 1 300px;
  /* 🔥 minimaal 300px, groeit mee */
  max-width: 350px;
  /* voorkomt dat ze te breed worden */

  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  background: #f9f9f9;
}

.plan-header {
  display: flex;
  justify-content: flex-end;
}

.status {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  text-transform: capitalize;
}

.status.active {
  background: #d4f5d4;
  color: #2e7d32;
}

.status.completed {
  background: #e0e0e0;
}

.plan-body p {
  margin: 4px 0;
}
</style>
