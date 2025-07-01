<template>
  <div class="card dashboard-card">
    <div class="card-header">
      <h5 class="mb-0">KPI Breakdown</h5>
    </div>
    <div class="card-body">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { onMounted, onUnmounted, ref, watch } from 'vue';

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

interface KpiData {
  label: string;
  values: number[]; // Each value is a sub-KPI
}

const props = defineProps<{
  data: KpiData[];
  subKpiLabels: string[]; // Should match length of values in each KPI
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const datasets = props.subKpiLabels.map((subLabel, idx) => ({
    label: subLabel,
    data: props.data.map(kpi => kpi.values[idx]),
    backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 60%)`
  }));

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: props.data.map(kpi => kpi.label),
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true
        }
      }
    }
  });
}

onMounted(() => {
  renderChart();
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});

watch(() => props.data, renderChart, { deep: true });
</script>
