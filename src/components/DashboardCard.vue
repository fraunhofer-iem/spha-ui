<script setup lang="ts">

interface DashboardCardProps {
  title: string;
  fullHeight?: boolean;
  flexColumn?: boolean;
}

withDefaults(defineProps<DashboardCardProps>(), {
  fullHeight: true,
  flexColumn: false
});


</script>

<template>
  <div class="card text-center dashboard-card h-100">
    <div class="card-header">
      <h5 class="card-title pt-4 fw-bold">
        {{ title }}
      </h5>
    </div>
    <!-- Card Body -->
    <div class="card-body">
      <slot></slot>
    </div>

    <!-- Card Footer (optional) -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>