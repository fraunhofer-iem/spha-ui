<script setup lang="ts">

</script>

<template>
  <div class="card dashboard-card h-100 d-flex flex-column">
    <div class="card-header p-3 d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0 fw-bold">
        <i class="bi bi-cloud-lightning-rain me-2"></i> Critical KPIs
      </h5>
      <button class="btn btn-outline-primary btn-sm">
        Details
      </button>
    </div>

    <div class="card-body">
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
    </div>

  </div>
</template>

<style scoped>

</style>