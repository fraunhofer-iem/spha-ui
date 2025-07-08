<script setup lang="ts">
import ProjectOverview from "./components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./components/RepoLanguagesPieChart.vue";
import HealthScore from "./components/HealthScore.vue";
import TopLevelKpiOverview from "./components/TopLevelKpiOverview.vue";
import KpiWarning from "./components/KpiWarning.vue";
import ToolOverview from "./components/ToolOverview.vue";
import {onMounted, onUnmounted, ref} from "vue";

const repoLanguages = {
  Java: 40,
  Kotlin: 60,
}

const score = 80;
const stars = 1000;
const contributors = 100;
const lastCommitDate = "2022-01-01";
const projectUrl = "https://github.com/SPHA/SPHA-Dashboard";
const projectName = "SPHA Dashboard";

const formattedTime = ref<string>('');

const updateTime = () => {
  const now = new Date();
  formattedTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

let intervalId: number;

onMounted(() => {
  updateTime();
  intervalId = window.setInterval(updateTime, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <nav class="navbar">
    <div class="container mt-2 d-flex justify-content-between align-items-center">
      <a class="navbar-brand" href="#">
        <img
            src="./assets/img/SPHA_Logo_Secondary.svg"
            alt="Software Product Health Assistant"
            width="250">
      </a>
      <h3 class="fw-bold mx-auto">{{projectName}}</h3>
      <div class="d-flex align-items-center">
        <div class="me-3 time-display p-3">
          <p class="h5">{{formattedTime}}</p>
        </div>
        <button type="button" class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg">Settings</button>
      </div>
    </div>
  </nav>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-3 mb-3">
        <HealthScore :score="score"/>
      </div>
      <div class="col-md-6 mb-3">
        <ProjectOverview
            :stars="stars"
            :last-commit-date="lastCommitDate"
            :project-name="projectName"
            :project-url="projectUrl"
            :contributors="contributors"

        />
      </div>
      <div class="col-md-3 mb-3">
        <RepoLanguagesPieChart :languages="repoLanguages"/>
      </div>
    </div>

    <div class="row">
      <div class="col-md-9 mb-3">
        <TopLevelKpiOverview
            :kpis="[
            { name: 'Security', score: 85, description: 'Based on CVE scan and secrets detection.' },
            { name: 'Quality', score: 72, description: 'Includes linting and test coverage.' },
            { name: 'Compliance', score: 90, description: 'Assessed via SPDX and license checks.' },
            { name: 'Traceability', score: 65, description: 'Based on issue-commit linkage.' },
            { name: 'Sustainability', score: 78, description: 'Considers activity over time and contributor bus factor.' }
          ]"
        />
      </div>
      <div class="col-md-3 mb-3">
        <KpiWarning/>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 mb-3">
        <ToolOverview :tools="[
            { name: 'Trufflehog',scanDate: '2025-06-10', findings: 10, downloadLink: '', icon: ''},
            { name: 'OSV',scanDate: '2025-06-10', findings: 2, downloadLink: '', icon: ''},
            { name: 'GitHub',scanDate: '2025-06-10', findings: 20, downloadLink: '', icon: ''},
            ]"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
