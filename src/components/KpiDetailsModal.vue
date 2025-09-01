<script setup lang="ts">
import Modal from './Modal.vue';
import KpiItem from './KpiItem.vue';
import type {Kpi} from '../model/Result.ts';
import {computed} from 'vue';
import {getBadgeClass, isCriticalKpi, isWarningKpi, sortChildren, useKpiFilters} from '../composables/kpiUtils.ts';

interface Props {
  root: Kpi;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClose = () => {
  emit('close');
};

const rootComputed = computed(() => props.root);
const {sortedKpisBySeverity} = useKpiFilters(rootComputed);

const getCriticalCount = computed(() => {
  return sortedKpisBySeverity.value.filter(kpi => isCriticalKpi(kpi)).length;
});

const getWarningCount = computed(() => {
  return sortedKpisBySeverity.value.filter(kpi => isWarningKpi(kpi)).length;
});
</script>

<template>
  <Modal
      title="Critical & Low Value KPIs"
      :show="show"
      @close="handleClose"
  >
    <div class="kpi-list">
      <div v-if="sortedKpisBySeverity.length > 0" class="accordion" id="kpiDetailsAccordion">
        <!-- Summary -->
        <div class="mb-4">
          <div v-if="getCriticalCount > 0" class="alert alert-danger mb-2">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>{{ getCriticalCount }}</strong> KPI{{ getCriticalCount !== 1 ? 's' : '' }} with critical values
          </div>
          <div v-if="getWarningCount > 0" class="alert alert-warning mb-2">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>{{ getWarningCount }}</strong> KPI{{ getWarningCount !== 1 ? 's' : '' }} with low values
          </div>
        </div>

        <!-- KPI List -->
        <div v-for="(kpi) in sortedKpisBySeverity" :key="kpi.id" class="accordion-item mb-3">
          <h2 class="accordion-header" :id="`heading-${kpi.id}`">
            <button
                class="accordion-button collapsed kpi-header"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#collapse-${kpi.id}`"
                aria-expanded="false"
                :aria-controls="`collapse-${kpi.id}`"
            >
              <div class="d-flex justify-content-between align-items-center w-100 me-3">
                <div class="kpi-info">
                  <h6 class="mb-1 fw-bold">{{ kpi.displayName }}</h6>
                  <div v-if="kpi.description" class="mt-1">
                    <small class="text-muted">{{ kpi.description }}</small>
                  </div>
                  <div v-if="kpi.tags && kpi.tags.length > 0" class="mt-1">
                    <span
                        v-for="tag in kpi.tags"
                        :key="tag"
                        class="badge bg-secondary me-1"
                        style="font-size: 0.7em;"
                    >
                      {{ tag }}
                    </span>
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
            </button>
          </h2>
          <div
              :id="`collapse-${kpi.id}`"
              class="accordion-collapse collapse"
              :aria-labelledby="`heading-${kpi.id}`"
              data-bs-parent="#kpiDetailsAccordion"
          >
            <div class="accordion-body">
              <!-- KPI Metadata -->
              <div v-if="kpi.thresholds && kpi.thresholds.length > 0" class="mb-3">
                <small class="text-muted">Thresholds:</small>
                <div class="mt-1">
                  <span
                      v-for="threshold in kpi.thresholds"
                      :key="threshold.name"
                      class="badge bg-info me-1"
                      style="font-size: 0.8em;"
                  >
                    {{ threshold.name }}: {{ threshold.value }}
                  </span>
                </div>
              </div>

              <!-- Children KPIs -->
              <div v-if="sortChildren(kpi.children).length > 0">
                <h6 class="mb-3 text-muted">Sub-KPIs</h6>
                <KpiItem
                    v-for="childKpi in sortChildren(kpi.children)"
                    :key="childKpi.id"
                    :kpi="childKpi"
                />
              </div>
              <div v-else-if="kpi.children && kpi.children.length === 0" class="text-muted text-center py-2">
                <small>No sub-KPIs available</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-muted text-center py-4">
        <p>No KPIs with critical or low values found</p>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.kpi-list {
  max-height: 700px;
  overflow-y: auto;
}

/* Accordion customizations to match original styling */
.accordion-item {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem !important;
}

.accordion-button.kpi-header {
  background-color: white;
  border: none;
  padding: 1rem;
  transition: all 0.2s ease;
}

.accordion-button.kpi-header:hover {
  background-color: #f8f9fa;
}

.accordion-button.kpi-header:focus {
  box-shadow: none;
  border-color: transparent;
}

.accordion-button.kpi-header:not(.collapsed) {
  background-color: white;
  color: inherit;
}

.accordion-button.kpi-header::after {
  margin-left: auto;
  flex-shrink: 0;
}

.accordion-collapse {
  border-top: 1px solid #dee2e6;
}

.accordion-body {
  padding: 1rem;
  background-color: #fafafa;
}
</style>