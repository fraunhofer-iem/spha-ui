<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

const formattedTime = ref<string>('');

withDefaults(defineProps<{title?: string}>(), {
  title: 'Software Product Health Assistant'
})

const emit = defineEmits<{
  uploadClicked: []
}>();

const handleUploadClick = () => {
  emit('uploadClicked');
};

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
      <a class="navbar-brand" href="#">
        <img
            src="./../assets/img/SPHA_Logo_Secondary.svg"
            alt="Software Product Health Assistant"
            width="250">
      </a>
      <h3 class="fw-bold mx-auto">{{ title }}</h3>
      <div class="d-flex align-items-center">
        <div class="me-3 time-display p-3">
          <p class="h5">{{ formattedTime }}</p>
        </div>
        <button type="button" class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg" @click="handleUploadClick">Upload</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>