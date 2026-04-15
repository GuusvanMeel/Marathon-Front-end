<template>
  <nav class="toolbar">
    <RouterLink data-test="Home-link" to="/">Home</RouterLink>
    <RouterLink to="/trainingplans" data-test="TrainingPlans-link">Training Plans</RouterLink>
    <RouterLink to="/marathons" data-test="Marathons-link">Marathons</RouterLink>
    <RouterLink to="/about" data-test="About-link">About</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 20px;
  padding: 15px;
  background-color: #222;
}

.toolbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.toolbar a.router-link-exact-active {
  color: #42b983;
}
</style>
