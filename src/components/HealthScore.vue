<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {ArcElement, Chart, DoughnutController, Legend, Tooltip} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import DashboardCard from './DashboardCard.vue';

// https://www.chartjs.org/chartjs-plugin-annotation/3.1.0/guide/types/doughnutLabel.html
Chart.register(DoughnutController, ArcElement, Tooltip, Legend, annotationPlugin);

const props = defineProps<{
  score: number;
}>();

const chartCanvas2 = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<'doughnut'> | null = null;

const renderChart = () => {
  if (!chartCanvas2.value) return;

  const labels = [''];
  const data = [props.score, 100 - props.score];

  if (chartInstance) {
    chartInstance.destroy();
  }

  const scoreColorClass = computed(() => {
    if (props.score >= 80) return 'green'; // green
    if (props.score >= 50) return 'yellow'; // yellow
    return 'red'; // red
  });

  const annotation = {
    dLabel: {
      type: 'doughnutLabel',
      content: () => [
        `${props.score} / 100`,
        'score'
      ],
      position: {
        y: '-55%'
      },
      font: [{size: 80, weight: 'bold'}, {size: 40}],
      color: [scoreColorClass.value, 'grey']
    }
  };

  const plugin = {
    annotation: {
      annotations: annotation
    },
    legend: {
      display: false,
    }
  }

  chartInstance = new Chart(chartCanvas2.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          borderWidth: 1,
          borderColor: 'rgba(1, 1, 1, 1)',
          backgroundColor(ctx) {
            if (ctx.dataIndex == 1) {
              return 'rgba(230, 230, 230, 0.5)'
            }
            if (props.score >= 80) return 'green'; // green
            if (props.score >= 50) return 'yellow'; // yellow
            return 'red'; // red
          },
        },
      ],
    },
    options: {
      aspectRatio: 2,
      cutout: 66,
      circumference: 180,
      rotation: -90,
      plugins: plugin,
    },
  });
};


onMounted(renderChart);

watch(() => props.score, renderChart, {deep: true});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <DashboardCard title="Project Health Score" icon="journal-code">
    <div class="chart-container d-flex align-items-center justify-content-center">
      <canvas ref="chartCanvas2" class="w-75"></canvas>
    </div>
  </DashboardCard>
</template>

<style scoped>

</style>
