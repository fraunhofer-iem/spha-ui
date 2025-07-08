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
    <div class="align-items-start text-start">
      <div class="alert alert-danger" role="alert">
        <div class="warning-header">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Warning!</strong>
        </div>
        <div class="warning-content">5 KPIs have low values.</div>
      </div>
      <div class="alert alert-warning" role="alert">
        <div class="warning-header">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Warning!</strong>
        </div>
        <div class="warning-content">2 KPIs have critical values.</div>
      </div>
    </div>

    <footer>
      <div class="d-grid ps-4 pe-4 pt-4">
        <button type="button" class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg">Details</button>
      </div>
    </footer>
  </DashboardCard>
</template>

<style scoped>
.bi {
  font-size: 1.5rem; /* Make icons larger */
}

.warning-content {
  padding-left: 2.2rem; /* Align with the text after the icon */
}
</style>
