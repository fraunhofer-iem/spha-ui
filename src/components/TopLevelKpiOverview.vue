<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartData,
  type ChartOptions,
  type Color,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import DashboardCard from './DashboardCard.vue';
import {background_grey, blue_chart} from "../assets/styles/Colors.ts";

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

  const colors: Array<Color> = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2',
  ]

  const data: ChartData<'bar'> = {
    labels: props.kpis.map(kpi => kpi.name),
    datasets: [

      {
        label: 'KPI Score',
        data: props.kpis.map(kpi => kpi.score),
        backgroundColor: blue_chart,
        borderWidth: 0,
        stack: 'stack1',
        borderRadius: 8,
      },
      {
        label: 'Track',
        data: props.kpis.map(() => 100),
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
    barThickness: 60,
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
            return props.kpis[context.dataIndex]?.description || '';
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
watch(() => props.kpis, () => {
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
      icon="bar-chart-line"
      :showButton="true"
      buttonText="Details"
      @button-click="handleButtonClick"
  >
    <div class="container">
      <div class="row">
        <div class="col col-md-9 h-100">
          <div class="chart-container" style="position: relative; height: 300px;">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
        <div class="col col-md-3">
          <div class="d-flex flex-column justify-content-between h-100">
            <div>
              <p class="text-start text-muted">
                Three out of five KPIs are above the threshold. The project is in good shape.
                Click Details below to see more.
              </p>
            </div>
            <div class="mt-auto">
              <div class="d-grid">
                <button type="button" class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg">Details</button>
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
