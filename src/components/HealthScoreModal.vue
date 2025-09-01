<script setup lang="ts">
import Modal from './Modal.vue';
import type {Kpi} from '../model/Result.ts';
import { computed } from 'vue';

interface Props {
  show: boolean;
  rootKpi: Kpi;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClose = () => {
  emit('close');
};

// Sort KPIs: move items with score -1 to the end
const sortedKpis = computed(() => {
  if (!props.rootKpi.children || props.rootKpi.children.length === 0) {
    return [];
  }
  
  const validKpis = props.rootKpi.children.filter(kpi => kpi.score !== -1);
  const insufficientDataKpis = props.rootKpi.children.filter(kpi => kpi.score === -1);
  
  return [...validKpis, ...insufficientDataKpis];
});
</script>

<template>
  <Modal
      :show="show"
      title="Health Score Details"
      @close="handleClose"
  >
    <div class="kpi-list">
      <h6 class="mb-3 text-muted">Top Level KPIs</h6>
      <div v-if="sortedKpis.length > 0">
        <div
            v-for="kpi in sortedKpis"
            :key="kpi.id"
            class="kpi-item mb-3 p-3 border rounded"
        >
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
              <span v-else class="badge bg-primary fs-6 px-3 py-2">
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
      </div>
      <div v-else class="text-muted text-center py-4">
        <p>No KPI data available</p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.kpi-list {
  max-height: 700px;
  overflow-y: auto;
}

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