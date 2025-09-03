<script setup lang="ts">
import ProjectOverview from "./../components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./../components/RepoLanguagesPieChart.vue";
import HealthScore from "./../components/HealthScore.vue";
import TopLevelKpiOverview from "./../components/TopLevelKpiOverview.vue";
import KpiDetailsModal from "./../components/KpiDetailsModal.vue";
import ToolOverview from "./../components/ToolOverview.vue";
import EmptyKpiCard from "./../components/EmptyKpiCard.vue";

import type {Result} from "../model/Result.ts";
import { computed, ref } from "vue";
import { useKpiFilters } from "../composables/kpiUtils.ts";

const props = defineProps<Result>();

const rootComputed = computed(() => props.root);
const { criticalKpis, warningKpis } = useKpiFilters(rootComputed);

const hasCritical = computed(() => criticalKpis.value.length > 0);
const hasWarnings = computed(() => warningKpis.value.length > 0);

// Modal state
const showModal = ref(false);

const handleAlertClick = () => {
  showModal.value = true;
};

const handleModalClose = () => {
  showModal.value = false;
};
</script>

<template>
  <div v-if="hasCritical" class="alert alert-danger alert-dismissible" role="alert">
    <div>You have {{ criticalKpis.length }} critical KPIs. Click <a href="#" class="alert-link" @click.prevent="handleAlertClick">here</a> for details.</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <div v-if="hasWarnings" class="alert alert-warning alert-dismissible" role="alert">
    <div>You have {{ warningKpis.length }} warning KPIs. Click <a href="#" class="alert-link" @click.prevent="handleAlertClick">here</a> for details.</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <div class="row">
    <div class="col-md-3 mb-3">
      <HealthScore :score="props.healthScore" :root-kpi="props.root"/>
    </div>

    <div class="col-md-9 mb-3">
      <TopLevelKpiOverview v-bind="props.root"/>
    </div>
  </div>

  <div class="row">
    <div class="col-md-6 mb-3">
      <ProjectOverview v-bind="props.repoInfo"/>
    </div>
    <div class="col-md-3 mb-3">
      <RepoLanguagesPieChart :languages="props.repoInfo.repoLanguages"/>
    </div>
    <div class="col-md-3 mb-3">
      <EmptyKpiCard :root="props.root"/>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 mb-3">
      <ToolOverview :tools="props.tools"/>
    </div>
  </div>

  <!-- KPI Details Modal -->
  <KpiDetailsModal
      :root="props.root"
      :show="showModal"
      @close="handleModalClose"
  />
</template>
