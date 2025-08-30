<script setup lang="ts">
import DashboardCard from "./DashboardCard.vue";
import {computed} from "vue";
import type {Kpi} from "../model/Result.ts";

const props = defineProps<{
  root: Kpi;
}>();

const getAllKpis = (kpi: Kpi): Kpi[] => {
  const result = [kpi];
  if (kpi.children && kpi.children.length > 0) {
    kpi.children.forEach((child) => {
      result.push(...getAllKpis(child));
    });
  }
  return result;
};

const allKpis = computed(() => getAllKpis(props.root));

const getLowestThreshold = (kpi: Kpi): number | null => {
  if (!kpi.thresholds || kpi.thresholds.length === 0) {
    return null;
  }
  return Math.min(...kpi.thresholds.map(t => t.value));
};

const warningKpis = computed(() =>
    allKpis.value.filter((kpi) => {
      if (!kpi.children || kpi.children.length === 0) {
        return false;
      }
      const threshold = getLowestThreshold(kpi);
      const warningThreshold = threshold !== null ? threshold + 10 : 50;
      const isAlreadyCritical = criticalKpis.value.includes(kpi);
      return (kpi.score < warningThreshold) && !isAlreadyCritical;
    }),
);

const criticalKpis = computed(() =>
    allKpis.value.filter((kpi) => {
      if (!kpi.children || kpi.children.length === 0) {
        return false;
      }
      const threshold = getLowestThreshold(kpi);
      const criticalThreshold = threshold !== null ? threshold - 10 : 20;
      return kpi.score < criticalThreshold;
    }),
);

const warnings = computed(
    () => warningKpis.value.length != 0 || criticalKpis.value.length != 0,
);

const handleButtonClick = () => {
  // Handle button click event
  console.log("Details button clicked");
};
</script>

<template>
  <DashboardCard title="Critical KPIs">
    <div v-if="warnings">
      <div class="align-items-start text-start">
        <div v-if="warningKpis.length > 0" class="alert alert-warning" role="alert">
          <div class="warning-header">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Warning!</strong>
          </div>
          <div class="warning-content">
            {{ warningKpis.length }} KPIs have low values.
          </div>
        </div>
        <div v-if="criticalKpis.length > 0" class="alert alert-danger" role="alert">
          <div class="warning-header">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Warning!</strong>
          </div>
          <div class="warning-content">
            {{ criticalKpis.length }} KPIs have critical values.
          </div>
        </div>
      </div>

      <footer>
        <div class="d-grid ps-4 pe-4 pt-4">
          <button
              type="button"
              @click="handleButtonClick"
              class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg"
          >
            Details
          </button>
        </div>
      </footer>
    </div>
    <div v-else>
      <div class="align-items-start text-start">
        <div class="alert alert-success" role="alert">
          <div class="warning-header">
            <i class="bi bi-check-circle-fill me-2"></i>
            <strong>No critical KPIs detected</strong>
          </div>
        </div>
      </div>
    </div>
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
