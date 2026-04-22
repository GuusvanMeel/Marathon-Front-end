<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import type { MarathonDTO } from '@/types/marathon'
const marathons = ref<MarathonDTO[]>([])

onMounted(async () => {
  const res = await fetch('http://localhost:8080/marathons')
  marathons.value = await res.json()
})



const dayOptions = [
  'MONDAY','TUESDAY','WEDNESDAY',
  'THURSDAY','FRIDAY','SATURDAY','SUNDAY'
]
const fitnessLevel = ref<number | null>(null)

const marathonId = ref('')
const targetTime = ref('')
const trainingsPerWeek = ref<number | null>(null)
const availableDays = ref<string[]>([])


const submit = async () => {
  const data = {
    fitnessLevel: fitnessLevel.value,
    marathonId: marathonId.value,
    targetTime: targetTime.value,
    trainingsPerWeek: trainingsPerWeek.value,
    availableDays: availableDays.value
  }

  console.log(data)
  await fetch("http://localhost:8080/trainingplans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}
</script>

<template>
  <div class="box">
    <p>Fitness level (1-5):</p>
    <input type="number" v-model.number="fitnessLevel" min="1" max="5" />
<p></p>
<select v-model="marathonId">
  <option disabled value="">-- select a marathon --</option>

  <option
    v-for="marathon in marathons"
    :key="marathon.id"
    :value="marathon.id"
  >
    {{ marathon.name }} - {{ marathon.city }} ({{ marathon.distance }} km, {{ marathon.date }})
  </option>
</select>

    <p>Target time (HH:mm:ss):</p>
    <input v-model="targetTime" placeholder="04:00:00" />

    <p>Trainings per week:</p>
    <input type="number" v-model.number="trainingsPerWeek" min="1" max="7" />

    <p>Available days (optional):</p>
    <div>
    <multiselect
  v-model="availableDays"
  :options="dayOptions"
  :multiple="true"
  :close-on-select="false"
  :clear-on-select="false"
  placeholder="Select training days"
/>
</div>
<p></p>
    <button @click="submit">Submit</button>
  </div>
</template>

<style scoped>
.box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;

  /* zorgt dat hij meegroeit met content */
  display: inline-block;
}
</style>
