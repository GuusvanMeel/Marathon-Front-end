<script setup lang="ts">
import ToolBar from './components/ToolBar.vue';
import PlanInputForm from './components/PlanInputForm.vue';
import Notification from './components/Notification.vue';

</script>

<template>
<Notification/>
  <ToolBar />
  <PlanInputForm></PlanInputForm>
  <RouterView />

</template>
