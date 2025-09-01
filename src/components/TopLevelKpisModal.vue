<template>
  <Modal 
    :show="show" 
    title="Top-Level KPI Details" 
    @close="handleClose"
  >
    <div class="kpi-list">
      <h6 class="mb-3 text-muted">Top Level KPIs</h6>
      <div v-if="rootKpi.children && rootKpi.children.length > 0">
        <div 
          v-for="kpi in rootKpi.children" 
          :key="kpi.id"
          class="kpi-item mb-3 p-3 border rounded"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div class="kpi-info">
              <h6 class="mb-1 fw-bold">{{ kpi.displayName }}</h6>
              <small class="text-muted">ID: {{ kpi.id }}</small>
            </div>
            <div class="kpi-score text-end">
              <span 
                class="badge fs-6 px-3 py-2"
                :class="{
                  'bg-success': kpi.score >= 80,
                  'bg-warning': kpi.score < 80 && kpi.score >= 50,
                  'bg-danger': kpi.score < 50
                }"
              >
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
        </div>
      </div>
      <div v-else class="text-muted text-center py-4">
        <p>No KPI data available</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import type { Kpi } from '../model/Result.ts';

interface Props {
  show: boolean;
  rootKpi: Kpi;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
.kpi-list {
  max-height: 500px;
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
