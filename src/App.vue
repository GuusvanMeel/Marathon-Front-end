<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import Notification from './components/Notification.vue';

</script>

<template>
<Notification/>
  <ToolBar />
  <RouterView />

</template>
