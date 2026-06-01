<template>
  <nav class="toolbar">
    <RouterLink data-test="Home-link" to="/">Home</RouterLink>
    <RouterLink to="/trainingplans" data-test="TrainingPlans-link">Training Plans</RouterLink>
    <RouterLink to="/marathons" data-test="Marathons-link">Marathons</RouterLink>
    <RouterLink to="/about" data-test="About-link">About</RouterLink>

    <button
      v-if="isLoggedIn"
      class="logout-button"
      @click="logout"
    >
      Logout
    </button>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)

async function checkLogin() {
  try {
    const response = await fetch("http://localhost:8080/users/me", {
      credentials: "include",
    })

    isLoggedIn.value = response.ok
  } catch {
    isLoggedIn.value = false
  }
}

onMounted(checkLogin)

watch(
  () => route.fullPath,
  () => checkLogin()
)

async function logout() {
  await fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
  })

  isLoggedIn.value = false
  await router.push("/login")
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
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

.logout-button {
  margin-left: auto;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #d9534f;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #c9302c;
}
</style>
