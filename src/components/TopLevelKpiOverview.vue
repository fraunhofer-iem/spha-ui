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
import DashboardCard from './DashboardCard.vue';
import {background_grey, blue_chart} from "../assets/styles/Colors.ts";
import type {Kpi} from "../model/Result.ts";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title);

interface KpiView {
  name: string;
  score: number; // 0-100
  description: string; // Tooltip content
}

const root = defineProps<Kpi>();
const kpis: KpiView[] = root.children.map((child) => {
  return {
    name: child.displayName,
    score: child.score,
    description: ' '
  }
})

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const createChart = () => {
  if (!chartCanvas.value) return;

  const data: ChartData<'bar'> = {
    labels: kpis.map(kpi => kpi.name),
    datasets: [
      {
        label: 'KPI Score',
        barThickness: 60,
        data: kpis.map(kpi => kpi.score),
        backgroundColor: blue_chart,
        borderWidth: 0,
        stack: 'stack1',
        borderRadius: 8,
      },
      {
        label: 'Track',
        barThickness: 60,
        data: kpis.map(() => 100),
        backgroundColor: background_grey,
        borderWidth: 0,
        stack: 'stack1',
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: false,
        display: false,
        grid: {
          display: false,
        },
        beginAtZero: true,
        max: 101,
        title: {
          display: true,
          text: 'Score',
        },
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 16
          }
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return kpis[context.dataIndex]?.description || '';
          }
        }
      },
      legend: {
        display: false,
      }
    }
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
watch(() => root, () => {
  chartInstance?.destroy();
  createChart();
}, {deep: true});

const handleButtonClick = () => {
  // Handle button click event
  console.log('Details button clicked');
};
</script>

<template>
  <DashboardCard
      title="Top-Level KPI Overview"
  >
    <div class="container">
      <div class="row">
        <div class="col col-md-10 h-100">
          <div class="chart-container" style="position: relative; height: 300px;">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
        <div class="col col-md-2">
          <div class="d-flex flex-column justify-content-between h-100">
            <div>
              <p class="text-start text-muted">
                Three out of five KPIs are above the threshold. The project is in good shape.
                Click Details below to see more.
              </p>
            </div>
            <div class="mt-auto">
              <div class="d-grid mb-2">
                <button type="button" @click="handleButtonClick"
                        class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg">Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>


<style scoped>
.chart-container {
  width: 100%;
}
</style>
