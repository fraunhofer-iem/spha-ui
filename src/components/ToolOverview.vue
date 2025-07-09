<script setup lang="ts">

import DashboardCard from "./DashboardCard.vue";
import {computed} from "vue";
import {background_light_grey} from "../assets/styles/Colors.ts";

interface Tool {
  name: string;
  scanDate: string;
  downloadLink: string;
  findings: number;
  icon: string;
}

const props = defineProps<{
  tools: Array<Tool>
}>();

const formattedScanDates = computed(() => {
  return props.tools.map((tool) => {
    if (!tool.scanDate) {
      return "Last scan date not found"
    }

    const date = new Date(tool.scanDate);
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });
});

const handleButtonClick = () => {
  // Handle button click event
  console.log('Details button clicked');
};

</script>

<template>
  <DashboardCard title-style="start" title="Tool Results" icon="tools" :showButton="true"
                 buttonText="Download All"
                 @button-click="handleButtonClick">
    <div class="list-group list-group-flush">

      <template v-for="(tool, idx) in props.tools" :key="tool.name">
        <div class="list-group-item d-flex justify-content-between w-100"
             :style="`background-color: ${background_light_grey}`">
          <div class="row">
            <div class="col align-items-end d-flex justify-content-center align-self-center">
              <img
                  :src="`${tool.icon}`"
                  alt="Software Product Health Assistant"
                  width="60">
            </div>
            <div class="col">
              <div class="text-muted">{{ tool.name }}</div>
              <div class="fw-bold fs-5">{{ tool.findings }} Findings</div>
              <div class="text-muted">Last Updated: {{ formattedScanDates[idx] }}</div>
            </div>
          </div>
          <div class="align-self-center">
            <button type="button" class="text-primary-emphasis bg-primary-subtle btn"><i
                class="bi bi-download pe-2"></i> Download
            </button>
          </div>

        </div>

      </template>

    </div>
  </DashboardCard>
</template>

<style scoped>
.bi {
  font-size: 1.5rem; /* Make icons larger */
}
</style>
