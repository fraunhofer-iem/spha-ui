<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {ArcElement, Chart, DoughnutController, Legend, Tooltip} from 'chart.js';

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
  <div class="card dashboard-card h-100 d-flex flex-column">
    <div class="card-header p-3">
      <h5 class="card-title mb-0 fw-bold">
        <i class="bi bi-braces me-2"></i> Programming Languages
      </h5>
    </div>

    <div class="card-body p-3 chart-container">
      <canvas ref="chartCanvas" class="w-100 h-100"></canvas>
    </div>
  </div>
</template>

<style scoped>

.chart-container {
  height: 200px;
}
</style>