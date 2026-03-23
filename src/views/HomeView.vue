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

  <div>
    <h1>Home</h1>

    <router-link to="/trainingplans">
      <button>Go to Training Plans</button>
    </router-link>
  </div>
  </main>
</template>
