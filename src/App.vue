<script setup lang="ts">
import ProjectOverview from "./components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./components/RepoLanguagesPieChart.vue";
import HealthScore from "./components/HealthScore.vue";
import TopLevelKpiOverview from "./components/TopLevelKpiOverview.vue";
import KpiWarning from "./components/KpiWarning.vue";
import ToolOverview from "./components/ToolOverview.vue";

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
  <nav class="navbar bg-body-tertiary">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img
            src="./assets/img/SPHA_Logo_Secondary.svg"
            alt="Software Product Health Assistant"
            width="250">
      </a>
    </div>
  </nav>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-4 mb-3">
        <HealthScore :score="score"/>
      </div>
      <div class="col-md-4 mb-3">
        <ProjectOverview
            :stars="stars"
            :last-commit-date="lastCommitDate"
            :project-name="projectName"
            :project-url="projectUrl"
            :contributors="contributors"

        />
      </div>
      <div class="col-md-4 mb-3">
        <RepoLanguagesPieChart :languages="repoLanguages"/>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 mb-3">
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
      <div class="col-md-4 mb-3">
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
