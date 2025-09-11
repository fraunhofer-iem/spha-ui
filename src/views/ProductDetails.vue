<script setup lang="ts">
import ProjectOverview from "./../components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./../components/RepoLanguagesPieChart.vue";
import HealthScore from "./../components/HealthScore.vue";
import TopLevelKpiOverview from "./../components/TopLevelKpiOverview.vue";
import KpiDetailsModal from "./../components/KpiDetailsModal.vue";
import ToolOverview from "./../components/ToolOverview.vue";
import EmptyKpiCard from "./../components/EmptyKpiCard.vue";

import type {Product} from "../model/Result.ts";
import {computed, ref} from "vue";
import {useKpiFilters} from "../composables/kpiUtils.ts";

const props = defineProps<Product>();

const lastResult = computed(() => props.results[props.results.length - 1]);
const rootComputed = computed(() => lastResult.value?.root);
const {criticalKpis, warningKpis} = useKpiFilters(rootComputed);

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
    <div>You have {{ criticalKpis.length }} critical KPIs. Click <a href="#" class="alert-link"
                                                                    @click.prevent="handleAlertClick">here</a> for
      details.
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <div v-if="hasWarnings" class="alert alert-warning alert-dismissible" role="alert">
    <div>You have {{ warningKpis.length }} warning KPIs. Click <a href="#" class="alert-link"
                                                                  @click.prevent="handleAlertClick">here</a> for
      details.
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <div class="row">
    <div class="col-md-3 mb-3">
      <HealthScore :score="lastResult!.healthScore" :root-kpi="lastResult!.root"/>
    </div>

    <div class="col-md-9 mb-3">
      <TopLevelKpiOverview v-bind="lastResult!.root"/>
    </div>
  </div>

  <div class="row">
    <div class="col-md-6 mb-3">
      <ProjectOverview v-bind="lastResult!.repoInfo"/>
    </div>
    <div class="col-md-3 mb-3">
      <RepoLanguagesPieChart :languages="lastResult!.repoInfo.repoLanguages"/>
    </div>
    <div class="col-md-3 mb-3">
      <EmptyKpiCard :root="lastResult!.root"/>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 mb-3">
      <ToolOverview :tools="lastResult!.tools"/>
    </div>
  </div>

  <!-- KPI Details Modal -->
  <KpiDetailsModal
      :root="lastResult!.root"
      :show="showModal"
      @close="handleModalClose"
  />
</template>
