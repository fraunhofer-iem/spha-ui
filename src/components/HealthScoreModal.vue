<script setup lang="ts">
import Modal from './Modal.vue';
import KpiItem from './KpiItem.vue';
import type {Kpi} from '../model/Result.ts';
import { computed, ref } from 'vue';

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

// Get badge class based on KPI score and thresholds (for accordion headers only)
const getBadgeClass = (kpi: Kpi): string => {
  if (kpi.score === -1) {
    return 'bg-secondary';
  }
  
  const threshold = kpi.thresholds && kpi.thresholds.length > 0 
    ? Math.min(...kpi.thresholds.map(t => t.value)) 
    : null;
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

// Sort KPIs: move items with score -1 to the end
const sortedKpis = computed(() => {
  if (!props.rootKpi.children || props.rootKpi.children.length === 0) {
    return [];
  }
  
  const validKpis = props.rootKpi.children.filter(kpi => kpi.score !== -1);
  const insufficientDataKpis = props.rootKpi.children.filter(kpi => kpi.score === -1);
  
  return [...validKpis, ...insufficientDataKpis];
});

// Accordion state management
const expandedAccordions = ref<Set<string>>(new Set());

const toggleAccordion = (kpiId: string) => {
  if (expandedAccordions.value.has(kpiId)) {
    expandedAccordions.value.delete(kpiId);
  } else {
    expandedAccordions.value.add(kpiId);
  }
};

const isAccordionExpanded = (kpiId: string) => {
  return expandedAccordions.value.has(kpiId);
};

// Sort children KPIs the same way as top-level KPIs
const sortChildren = (children: Kpi[] | undefined) => {
  if (!children || children.length === 0) {
    return [];
  }
  
  const validKpis = children.filter(kpi => kpi.score !== -1);
  const insufficientDataKpis = children.filter(kpi => kpi.score === -1);
  
  return [...validKpis, ...insufficientDataKpis];
};
</script>

<template>
  <Modal
      :show="show"
      title="Health Score Details"
      @close="handleClose"
  >
    <div class="kpi-list">
      <h6 class="mb-3 text-muted">Top Level KPIs</h6>
      <div v-if="sortedKpis.length > 0" class="accordion" id="kpiAccordion">
        <div
            v-for="kpi in sortedKpis"
            :key="kpi.id"
            class="accordion-item mb-3"
        >
          <h2 class="accordion-header">
            <button
                class="accordion-button collapsed kpi-header"
                type="button"
                @click="toggleAccordion(kpi.id)"
                :aria-expanded="isAccordionExpanded(kpi.id)"
                :aria-controls="`collapse-${kpi.id}`"
            >
              <div class="d-flex justify-content-between align-items-center w-100 me-3">
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
            </button>
          </h2>
          <div
              :id="`collapse-${kpi.id}`"
              class="accordion-collapse collapse"
              :class="{ 'show': isAccordionExpanded(kpi.id) }"
          >
            <div class="accordion-body">
              <!-- KPI Metadata -->
              <div v-if="kpi.thresholds && kpi.thresholds.length > 0" class="mb-3">
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
              <div v-if="kpi.tags && kpi.tags.length > 0" class="mb-3">
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