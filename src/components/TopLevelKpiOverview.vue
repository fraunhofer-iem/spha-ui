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
        backgroundColor: props.kpis.map((_kpi, idx) => {
          if (idx >= colors.length) {
            return colors[idx % colors.length];
          }
          return colors[idx]
        }),
        borderWidth: 1,
        borderColor: 'rgba(1, 1, 1, 1)',
        stack: 'stack1',
        borderRadius: 5,
      },
      {
        label: 'Track',
        data: props.kpis.map(() => 100),
        backgroundColor: 'rgba(230, 230, 230, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(1, 1, 1, 1)',
        stack: 'stack1',
        borderRadius: 5,
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
          labelColor(tooltipItem) {
            return {
              borderColor: 'rgba(1, 1, 1, 1)',
              backgroundColor: colors[tooltipItem.dataIndex],
            }
          },
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
    <div class="chart-container" style="position: relative; height: 300px;">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </DashboardCard>
</template>


<style scoped>
.chart-container {
  width: 100%;
}
</style>
