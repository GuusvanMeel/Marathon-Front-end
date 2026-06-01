<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");

async function login() {
  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email.value,
      password: password.value,
    }),
  });

  if (response.ok) {
    await router.push("/");
  } else {
    message.value = "Login mislukt";
  }
}

</script>

<template>
  <main class="login-container">
    <div class="login-card">
      <h1>Login</h1>



      <form @submit.prevent="login" class="login-form">
  <div class="form-group">
    <label>Email</label>
    <input
      v-model="email"
      type="email"
      placeholder="Email"
    />
  </div>

  <div class="form-group">
    <label>Wachtwoord</label>
    <input
      v-model="password"
      type="password"
      placeholder="Wachtwoord"
    />
  </div>

  <button type="submit" class="login-button">
    Login
  </button>
</form>

      <p class="message">{{ message }}</p>
    </div>
  </main>
</template>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-card h1 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #42b883;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.login-button:hover {
  opacity: 0.9;
}

.message {
  margin-top: 1rem;
  text-align: center;
}
</style>
