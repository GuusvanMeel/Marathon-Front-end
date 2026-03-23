<template>
  <div>
    <h1>Training Plans</h1>

    <button @click="fetchPlans">Load Training Plans</button>

    <ul v-if="plans.length">
      <li v-for="plan in plans" :key="plan.id">
        User: {{ plan.userId }} | Weeks: {{ plan.weeks }}
      </li>
    </ul>

    <p v-else>No plans loaded</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plans = ref<any[]>([])

const fetchPlans = async () => {
  try {
    console.log('fetch called')
    const response = await fetch('http://localhost:8080/trainingplans')
    const data = await response.json()
    console.log(data)
    plans.value = data
  } catch (error) {
    console.error('Error fetching plans:', error)
  }
}
</script>
