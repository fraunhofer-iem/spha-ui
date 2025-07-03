<script setup lang="ts">
import {computed} from 'vue';

interface DashboardCardProps {
  title: string;
  icon?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonVariant?: string;
  fullHeight?: boolean;
  flexColumn?: boolean;
}

const props = withDefaults(defineProps<DashboardCardProps>(), {
  icon: '',
  showButton: false,
  buttonText: 'Details',
  buttonVariant: 'primary',
  fullHeight: true,
  flexColumn: false
});

const emit = defineEmits<{
  (e: 'button-click'): void
}>();

const cardClasses = computed(() => {
  const classes = ['card', 'dashboard-card'];
  if (props.fullHeight) classes.push('h-100');
  if (props.flexColumn) classes.push('n');
  return classes.join(' ');
});

const handleButtonClick = () => {
  emit('button-click');
};
</script>

<template>
  <div class="card dashboard-card h-100">
    <!-- Card Header -->
    <div class="card-header p-3 d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0 fw-bold">
        <i v-if="icon" :class="`bi bi-${icon} me-2`"></i>{{ title }}
      </h5>
      <button
          v-if="showButton"
          class="btn btn-sm"
          :class="`btn-outline-${buttonVariant}`"
          @click="handleButtonClick"
      >
        {{ buttonText }}
      </button>
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