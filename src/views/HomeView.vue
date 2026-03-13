<script setup lang="ts">
import { ref, onMounted } from "vue"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const marathons = ref<any[]>([])

onMounted(async () => {
  const response = await fetch("/api/marathons")
  const data = await response.json()
  marathons.value = data
})
</script>

<template>
  <main>
    <h1>Marathons</h1>

    <ul>
      <li v-for="marathon in marathons" :key="marathon.id">
        {{ marathon.name }} - {{ marathon.location }} ({{ marathon.distance }} km)
      </li>
    </ul>
  </main>
</template>
