<script setup lang="ts">
import DashboardCard from './DashboardCard.vue';

const handleButtonClick = () => {
  // Handle button click event
  console.log('Details button clicked');
};
</script>

<template>
  <DashboardCard 
    title="Critical KPIs" 
    icon="cloud-lightning-rain" 
    :showButton="true" 
    buttonText="Details" 
    flexColumn
    @button-click="handleButtonClick"
  >
    <div class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Warning!</strong> There are critical KPIs that need attention.
    </div>
    <div class="alert alert-warning" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Warning!</strong> There are critical KPIs that need attention.
    </div>
    <div class="alert alert-warning" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <strong>Warning!</strong> There are critical KPIs that need attention.
    </div>
  </DashboardCard>
</template>

<style scoped>

</style>
