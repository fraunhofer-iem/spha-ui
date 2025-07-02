<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartData,
  type ChartOptions,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title);

interface Kpi {
  name: string;
  score: number; // 0-100
  description: string; // Tooltip content
}

const props = defineProps<{
  kpis: Kpi[];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value) return;

  const data: ChartData<'bar'> = {
    labels: props.kpis.map(kpi => kpi.name),
    datasets: [{
      label: 'KPI Score',
      data: props.kpis.map(kpi => kpi.score),
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score',
        },
      },
      x: {
        grid: {
          display: false
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const index = context.dataIndex;
            return props.kpis[index]?.description || '';
          },
        },
      },
      title: {
        display: false,
        text: 'Top-Level KPI Overview',
      },
    },
  };

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data,
    options,
  });
};

onMounted(() => {
  createChart();
});

onUnmounted(() => {
  chartInstance?.destroy();
});

// Redraw if props change
watch(() => props.kpis, () => {
  chartInstance?.destroy();
  createChart();
}, {deep: true});
</script>

<template>
  <div class="card dashboard-card shadow-sm">
    <div class="card-header p-3">
      <h5 class="card-title mb-0 fw-bold">
        <i class="bi bi-bar-chart-line me-2"></i> Top-Level KPI Overview
      </h5>
    </div>
    <div class="card-body">
      <div class="chart-container" style="position: relative; height: 400px;">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
}
</style>
