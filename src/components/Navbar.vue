<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

const formattedTime = ref<string>('');

withDefaults(defineProps<{ title?: string, showOnDashboard?: boolean }>(), {
  title: 'Software Product Health Assistant',
  showOnDashboard: false
})


const updateTime = () => {
  const now = new Date();
  formattedTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

let intervalId: number;

onMounted(() => {
  updateTime();
  intervalId = window.setInterval(updateTime, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <nav class="navbar">
    <div class="container mt-2 d-flex justify-content-between align-items-center">

      <h3 class="fw-bold mx-auto">{{ title }}</h3>
      <div class="d-flex align-items-center">
        <div class="me-3 time-display p-3">
          <p class="h5">{{ formattedTime }}</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>