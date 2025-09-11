<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";

const formattedTime = ref<string>('');

const props = withDefaults(defineProps<{ title?: string, showOnDashboard?: boolean, selectedProductName?: string, currentView?: string }>(), {
  title: '',
  showOnDashboard: false,
  selectedProductName: '',
  currentView: ''
})

// Compute the display title based on selected product or current view
const displayTitle = computed(() => {
  if (props.selectedProductName) {
    return props.selectedProductName;
  }
  
  if (props.title) {
    return props.title;
  }
  
  // Default view titles
  switch (props.currentView) {
    case 'projects-overview':
      return 'Projects Overview';
    case 'product-details':
      return 'Product Details';
    case 'result-upload':
      return 'Upload Results';
    case 'product-list':
      return 'Product List';
    default:
      return 'Software Product Health Assistant';
  }
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

      <h3 class="fw-bold mx-auto">{{ displayTitle }}</h3>
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