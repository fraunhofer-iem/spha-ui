<script setup lang="ts">
import ProjectOverview from "./../components/ProjectOverview.vue";
import RepoLanguagesPieChart from "./../components/RepoLanguagesPieChart.vue";
import HealthScore from "./../components/HealthScore.vue";
import TopLevelKpiOverview from "./../components/TopLevelKpiOverview.vue";
import KpiWarning from "./../components/KpiWarning.vue";
import ToolOverview from "./../components/ToolOverview.vue";

import type { Result } from "../model/Result.ts";

const props = defineProps<Result>();
</script>

<template>
    <div class="row">
        <div class="col-md-3 mb-3">
            <HealthScore :score="props.healthScore" :root-kpi="props.root" />
        </div>
        <div class="col-md-6 mb-3">
            <ProjectOverview v-bind="props.repoInfo" />
        </div>
        <div class="col-md-3 mb-3">
            <RepoLanguagesPieChart :languages="props.repoInfo.repoLanguages" />
        </div>
    </div>

    <div class="row">
        <div class="col-md-9 mb-3">
            <TopLevelKpiOverview v-bind="props.root" />
        </div>
        <div class="col-md-3 mb-3">
            <KpiWarning :root="props.root" />
        </div>
    </div>
    <div class="row">
        <div class="col-md-12 mb-3">
            <ToolOverview :tools="props.tools" />
        </div>
    </div>
</template>
