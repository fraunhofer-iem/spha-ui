<script setup lang="ts">
import ProjectOverview from "./components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./components/RepoLanguagesPieChart.vue";
import HealthScore from "./components/HealthScore.vue";

const repoLanguages = {
  Java: 40,
  Kotlin: 60
}

const score = 80;
</script>

<template>
  <div class="container mt-4">
    <div class="row align-items-stretch">
      <div class="col-md-4 mb-3 d-flex">
        <HealthScore :score="score" class="w-100" />
      </div>
      <div class="col-md-4 mb-3 d-flex">
        <ProjectOverview class="w-100" />
      </div>
      <div class="col-md-4 mb-3 d-flex">
        <RepoLanguagesPieChart :languages="repoLanguages" class="w-100" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
