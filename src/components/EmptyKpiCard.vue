<script setup lang="ts">
import { computed } from "vue";
import DashboardCard from "./DashboardCard.vue";
import type { Kpi } from "../model/Result.ts";

const props = defineProps<{
  root: Kpi;
}>();

/**
 * Recursively traverse KPI hierarchy and collect unique KPI types with their result types
 */
const getUniqueKpiResults = (kpi: Kpi): Map<string, string> => {
  const resultMap = new Map<string, string>();
  
  // Add current KPI's result type if it exists, using id (typeId) as key
  if (kpi.resultType && kpi.id) {
    resultMap.set(kpi.id, kpi.resultType);
  }
  
  // Recursively process children
  if (kpi.children && kpi.children.length > 0) {
    kpi.children.forEach((child) => {
      const childResults = getUniqueKpiResults(child);
      // Merge child results, but don't overwrite existing entries (first occurrence wins)
      childResults.forEach((resultType, id) => {
        if (!resultMap.has(id)) {
          resultMap.set(id, resultType);
        }
      });
    });
  }
  
  return resultMap;
};

/**
 * Calculate the percentage of empty KPI results based on unique typeIds
 */
const emptyKpiPercentage = computed(() => {
  const uniqueResults = getUniqueKpiResults(props.root);
  
  if (uniqueResults.size === 0) {
    return 0;
  }
  
  const emptyCount = Array.from(uniqueResults.values()).filter(
    resultType => resultType === "de.fraunhofer.iem.spha.model.kpi.hierarchy.KpiCalculationResult.Empty"
  ).length;
  
  return Math.round((emptyCount / uniqueResults.size) * 100);
});

/**
 * Get the count of empty results for display (unique typeIds only)
 */
const emptyCount = computed(() => {
  const uniqueResults = getUniqueKpiResults(props.root);
  return Array.from(uniqueResults.values()).filter(
    resultType => resultType === "de.fraunhofer.iem.spha.model.kpi.hierarchy.KpiCalculationResult.Empty"
  ).length;
});

/**
 * Get the total count of unique KPI types
 */
const totalCount = computed(() => {
  return getUniqueKpiResults(props.root).size;
});
</script>

<template>
  <DashboardCard title="Empty KPI Results">
    <div class="text-center">
      <div class="display-4 fw-bold text-warning mb-2">
        {{ emptyKpiPercentage }}%
      </div>
      <div class="text-muted mb-3">
        {{ emptyCount }} of {{ totalCount }} KPIs have empty results
      </div>
      <div class="progress" style="height: 10px;">
        <div 
          class="progress-bar bg-warning" 
          role="progressbar" 
          :style="`width: ${emptyKpiPercentage}%`"
          :aria-valuenow="emptyKpiPercentage" 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  </DashboardCard>
</template>

<style scoped>
.display-4 {
  font-size: 2.5rem;
}
</style>