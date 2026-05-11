<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Notification = {
  id: number
  message: string
}

const notifications = ref<Notification[]>([])

onMounted(() => {
  const eventSource = new EventSource('http://localhost:8080/notifications/stream')
  eventSource.addEventListener('connected', (event) => {
    console.log('SSE connected event:', event.data)
  })
  eventSource.addEventListener('training-notification', (event) => {
    const id = Date.now()

    notifications.value.push({
      id,
      message: event.data,
    })

    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 5000)
  }

)
})
</script>

<template>
  <div class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  background: #222;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
}
</style>
