<script setup lang="ts">

import DashboardCard from "./DashboardCard.vue";
import {computed} from "vue";

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
      return "Last commit date not found"
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
  <DashboardCard title="Scan Results" icon="tools" :showButton="true"
                 buttonText="Download All"
                 @button-click="handleButtonClick">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Findings</th>
          <th scope="col">Scan Date</th>
          <th scope="col">Download</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(tool, idx) in props.tools" :key="tool.name">
          <tr>
            <td>{{ tool.name }}</td>
            <td>{{ tool.findings }}</td>
            <td>{{ formattedScanDates[idx] }}</td>
            <td>
              <button :href="tool.downloadLink" class="btn">
                <i class="bi bi-download"></i>
              </button>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </DashboardCard>
</template>

<style scoped>

</style>