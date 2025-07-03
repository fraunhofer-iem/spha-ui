<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {ArcElement, Chart, DoughnutController, Legend, Tooltip} from 'chart.js';
import DashboardCard from './DashboardCard.vue';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps<{
  languages: Record<string, number>;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const renderChart = () => {
  if (!chartCanvas.value) return;

  const labels = Object.keys(props.languages);
  const data = Object.values(props.languages);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2',
            '#20c997', '#fd7e14', '#6c757d', '#17a2b8', '#e83e8c'
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
};

onMounted(renderChart);

watch(() => props.languages, renderChart, {deep: true});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <DashboardCard title="Programming Languages" icon="braces">
    <div class="p-3 chart-container">
      <canvas ref="chartCanvas" class="w-100 h-100"></canvas>
    </div>
  </DashboardCard>
</template>

<style scoped>

.chart-container {
  height: 220px;
}
</style>
