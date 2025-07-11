<script setup lang="ts">
import ProjectOverview from "./../components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./../components/RepoLanguagesPieChart.vue";
import HealthScore from "./../components/HealthScore.vue";
import TopLevelKpiOverview from "./../components/TopLevelKpiOverview.vue";
import KpiWarning from "./../components/KpiWarning.vue";
import ToolOverview from "./../components/ToolOverview.vue";
import truffleHogUrl from './../assets/img/supportedTools/trufflehog.svg';
import osvUrl from './../assets/img/supportedTools/osv.svg';
import ghUrl from './../assets/img/supportedTools/github-mark.svg';
import type {Result} from "../model/Result.ts";

const props = defineProps<Result>()


const topLevelKpis = [
  {name: 'Security', score: 85, description: 'Based on CVE scan and secrets detection.'},
  {name: 'Quality', score: 72, description: 'Includes linting and test coverage.'},
  {name: 'Compliance', score: 90, description: 'Assessed via SPDX and license checks.'},
  {name: 'Traceability', score: 65, description: 'Based on issue-commit linkage.'},
  {name: 'Sustainability', score: 78, description: 'Considers activity over time and contributor bus factor.'}
]

const tools = [
  {name: 'Trufflehog', scanDate: '2025-06-10', findings: 10, downloadLink: '', icon: truffleHogUrl},
  {name: 'OSV', scanDate: '2025-06-10', findings: 2, downloadLink: '', icon: osvUrl},
  {name: 'GitHub', scanDate: '2025-06-10', findings: 20, downloadLink: '', icon: ghUrl},
]


</script>

<template>
  <div class="row">
    <div class="col-md-3 mb-3">
      <HealthScore :score="props.healthScore"/>
    </div>
    <div class="col-md-6 mb-3">
      <ProjectOverview
          v-bind="props.repoInfo"
      />
    </div>
    <div class="col-md-3 mb-3">
      <RepoLanguagesPieChart :languages="props.repoInfo.repoLanguages"/>
    </div>
  </div>

  <div class="row">
    <div class="col-md-9 mb-3">
      <TopLevelKpiOverview
          :kpis="topLevelKpis"
      />
    </div>
    <div class="col-md-3 mb-3">
      <KpiWarning :kpis="[]"/>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 mb-3">
      <ToolOverview :tools="tools"/>
    </div>
  </div>
</template>
