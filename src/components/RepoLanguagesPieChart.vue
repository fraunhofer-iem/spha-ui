<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {ArcElement, Chart, DoughnutController, Legend, Tooltip} from 'chart.js';
import DashboardCard from './DashboardCard.vue';
import annotationPlugin from "chartjs-plugin-annotation";
import {blue_chart} from "../assets/styles/Colors.ts";
import type {Language} from "../model/Result.ts";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, annotationPlugin);

const languages = defineProps<Language[]>()

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'doughnut'> | null = null;
const legendRef = ref<HTMLDivElement | null>(null);

let resizeObserver: ResizeObserver | null = null;

const colors = [
  blue_chart, 'purple', '#28a745', '#ffc107', '#dc3545', '#6610f2',
  '#20c997', '#fd7e14', '#6c757d', '#17a2b8', '#e83e8c'
];

// Get color for a language based on its index
const getColorForLanguage = (language: string) => {
  const index = Object.keys(props.languages).indexOf(language);
  return colors[index % colors.length];
};

const renderChart = () => {
  if (!chartCanvas.value) return;

  const labels = languages.map((lang) => lang.name);
  const data = languages.map((lang) => lang.size);

  if (chartInstance) {
    chartInstance.destroy();
  }

  const annotation: any = {
    dLabel: {
      type: 'doughnutLabel',
      content: '</>',
      font: [{size: 40}]
    }
  };

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
          backgroundColor: (ctx) => {
            return colors[ctx.dataIndex]
          },
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
        annotation: {
          annotations: annotation
        },
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
    <div class="ps-3 pe-3 chart-container">
      <canvas ref="chartCanvas"></canvas>

    </div>
    <hr class="my-3"/>
    <div ref="legendRef" class="legend-container d-flex flex-wrap flex-column text-start align-content-start">
      <div v-for="language in Object.keys(props.languages)" :key="language" class="ps-2 pe-2">
        <div>
          <span class="legend-color" :style="{ backgroundColor: getColorForLanguage(language) }"></span>
          <span class="legend-label">{{ language }}</span>
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

.legend-container {
  max-height: 80px;
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
