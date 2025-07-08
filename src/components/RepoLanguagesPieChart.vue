<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {ArcElement, Chart, DoughnutController, Legend, Tooltip} from 'chart.js';
import DashboardCard from './DashboardCard.vue';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps<{
  languages: Record<string, number>;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'doughnut'> | null = null;
const legendRef = ref<HTMLDivElement | null>(null);
// Using Bootstrap grid system for layout

// Update grid layout when container size changes
let resizeObserver: ResizeObserver | null = null;

// Get color for a language based on its index
const getColorForLanguage = (language: string) => {
  const colors = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2',
    '#20c997', '#fd7e14', '#6c757d', '#17a2b8', '#e83e8c'
  ];
  const index = Object.keys(props.languages).indexOf(language);
  return colors[index % colors.length];
};

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
          borderRadius: 20,
          borderWidth: 5,
          borderColor: '#F7F9FB',
          data,
          backgroundColor: [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2',
            '#20c997', '#fd7e14', '#6c757d', '#17a2b8', '#e83e8c'
          ],
        },
      ],
    },
    options: {
      layout: {
        padding: 10
      },
      responsive: true,
      aspectRatio: 0,
      maintainAspectRatio: true,
      cutout: '80%',
      plugins: {
        legend: {
          display: false
        }
      }
    },
  });

};

onMounted(() => {
  renderChart();

  // Setup resize observer to ensure Bootstrap grid adapts to container size changes
  nextTick(() => {
    if (legendRef.value) {
      resizeObserver = new ResizeObserver(() => {
        // Force re-render when container size changes
        nextTick();
      });
      resizeObserver.observe(legendRef.value);
    }
  });
});

watch(() => props.languages, renderChart, {deep: true});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Clean up resize observer
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<template>
  <DashboardCard title="Programming Languages">
    <div class="p-3 chart-container">
      <canvas ref="chartCanvas"></canvas>

    </div>
    <hr class="my-3"/>
    <div ref="legendRef" class="container text-start">
      <div class="row">
        <div v-for="language in Object.keys(props.languages)" :key="language" class="col-sm-4 mb-1">
          <div>
            <span class="legend-color" :style="{ backgroundColor: getColorForLanguage(language) }"></span>
            <span class="legend-label">{{ language }}</span>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<style scoped>
.chart-container {
  height: 220px;
}


/* Using Bootstrap grid instead of custom grid */

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend-label {
  font-size: 0.85rem;
}
</style>
