<script setup lang="ts">
import ProjectOverview from "./components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./components/RepoLanguagesPieChart.vue";
import HealthScore from "./components/HealthScore.vue";
import TopLevelKpiOverview from "./components/TopLevelKpiOverview.vue";

const repoLanguages = {
  Java: 40,
  Kotlin: 60
}

const score = 80;
const stars = 1000;
const contributors = 100;
const lastCommitDate = "2022-01-01";
const projectUrl = "https://github.com/SPHA/SPHA-Dashboard";
const projectName = "SPHA Dashboard";
</script>

<template>
  <div class="container mt-4">
    <div class="row align-items-stretch">
      <div class="col-md-4 mb-3 d-flex">
        <HealthScore :score="score" class="w-100"/>
      </div>
      <div class="col-md-4 mb-3 d-flex">
        <ProjectOverview :stars="stars" :last-commit-date="lastCommitDate" :project-name="projectName"
                         :project-url="projectUrl" :contributors="contributors" class="w-100"/>
      </div>
      <div class="col-md-4 mb-3 d-flex">
        <RepoLanguagesPieChart :languages="repoLanguages" class="w-100"/>
      </div>
    </div>

    <TopLevelKpiOverview
        :data="[
    { label: 'KPI A', values: [30, 20, 10] },
    { label: 'KPI B', values: [25, 15, 20] },
    { label: 'KPI C', values: [10, 30, 25] }
  ]"
        :subKpiLabels="['Efficiency', 'Quality', 'Speed']"
    />
  </div>

</template>

<style scoped>

</style>
