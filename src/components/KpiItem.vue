<script setup lang="ts">
import type {Kpi} from '../model/Result.ts';

interface Props {
  kpi: Kpi;
}

const props = defineProps<Props>();

// Get the lowest threshold value for a KPI
const getLowestThreshold = (kpi: Kpi): number | null => {
  if (!kpi.thresholds || kpi.thresholds.length === 0) {
    return null;
  }
  return Math.min(...kpi.thresholds.map(t => t.value));
};

// Get badge class based on KPI score and thresholds
const getBadgeClass = (kpi: Kpi): string => {
  if (kpi.score === -1) {
    return 'bg-secondary';
  }
  
  const threshold = getLowestThreshold(kpi);
  const criticalThreshold = threshold !== null ? threshold - 10 : 20;
  const warningThreshold = threshold !== null ? threshold + 10 : 50;
  
  if (kpi.score < criticalThreshold) {
    return 'bg-danger';
  } else if (kpi.score < warningThreshold) {
    return 'bg-warning';
  } else {
    return 'bg-success';
  }
};
</script>

<template>
  <div class="kpi-item mb-3 p-3 border rounded">
    <div class="d-flex justify-content-between align-items-center">
      <div class="kpi-info">
        <h6 class="mb-1 fw-bold">{{ kpi.displayName }}</h6>
        <div v-if="kpi.description" class="mt-1">
          <small class="text-muted">{{ kpi.description }}</small>
        </div>
      </div>
      <div class="kpi-score text-end">
        <span v-if="kpi.score === -1" class="badge bg-secondary fs-6 px-3 py-2">
          Insufficient Data
        </span>
        <span v-else :class="`badge ${getBadgeClass(kpi)} fs-6 px-3 py-2`">
          {{ Math.round(kpi.score) }}/100
        </span>
      </div>
    </div>
    <div v-if="kpi.thresholds && kpi.thresholds.length > 0" class="mt-2">
      <small class="text-muted">Thresholds:</small>
      <div class="mt-1">
        <span
            v-for="threshold in kpi.thresholds"
            :key="threshold.name"
            class="badge bg-light text-dark me-1"
        >
          {{ threshold.name }}: {{ threshold.value }}
        </span>
      </div>
    </div>
    <div v-if="kpi.tags && kpi.tags.length > 0" class="mt-2">
      <small class="text-muted">Tags:</small>
      <div class="mt-1">
        <span
            v-for="tag in kpi.tags"
            :key="tag"
            class="badge bg-secondary me-1"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-item {
  transition: all 0.2s ease;
}

.kpi-item:hover {
  background-color: #f8f9fa;
}

.kpi-score .badge {
  min-width: 80px;
}
</style>