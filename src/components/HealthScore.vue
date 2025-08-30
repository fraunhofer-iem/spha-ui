<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import {
    ArcElement,
    Chart,
    DoughnutController,
    Legend,
    Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import DashboardCard from "./DashboardCard.vue";
import HealthScoreModal from "./HealthScoreModal.vue";
import { blue_chart } from "../assets/styles/Colors.ts";
import type { Kpi } from "../model/Result.ts";

// https://www.chartjs.org/chartjs-plugin-annotation/3.1.0/guide/types/doughnutLabel.html
Chart.register(
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend,
    annotationPlugin,
);

const props = defineProps<{
    score: number;
    rootKpi: Kpi;
}>();

// Modal state management
const showModal = ref(false);

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const chartCanvas2 = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart<"doughnut"> | null = null;

const renderChart = () => {
    if (!chartCanvas2.value) return;

    const labels = [""];
    const data = [props.score, 100 - props.score];

    if (chartInstance) {
        chartInstance.destroy();
    }

    const annotation: any = {
        dLabel: {
            type: "doughnutLabel",
            content: () => [`${props.score}/100`, "score"],
            font: [{ size: 40, weight: "bold" }, { size: 25 }],
            color: ["black", "grey"],
        },
    };

    chartInstance = new Chart(chartCanvas2.value, {
        type: "doughnut",
        data: {
            labels,
            datasets: [
                {
                    data,
                    borderWidth: 0,
                    backgroundColor(ctx) {
                        if (ctx.dataIndex == 1) {
                            return "rgba(230, 230, 230, 0.5)";
                        }
                        return blue_chart;
                    },
                },
            ],
        },
        options: {
            layout: {
                padding: 10,
            },
            responsive: true,
            aspectRatio: 0,
            maintainAspectRatio: true,
            cutout: "80%",
            circumference: 240,
            rotation: -120,
            interaction: {
                intersect: false,
                mode: false as any,
            },
            hover: {
                mode: undefined,
            },
            plugins: {
                annotation: {
                    annotations: annotation,
                },
                legend: {
                    display: false,
                },
            },
        },
    });
};

onMounted(renderChart);

watch(() => props.score, renderChart, { deep: true });

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.destroy();
    }
});
</script>

<template>
    <DashboardCard title="Project Health Score">
        <div class="chart-container">
            <canvas ref="chartCanvas2"></canvas>
        </div>
        <footer>
            <div class="d-grid ps-4 pe-4 pt-4 pb-3">
                <button
                    type="button"
                    class="text-primary-emphasis fw-bold bg-primary-subtle btn btn-lg"
                    @click="openModal"
                >
                    Details
                </button>
            </div>
        </footer>
    </DashboardCard>
    
    <HealthScoreModal 
        :show="showModal" 
        :root-kpi="rootKpi" 
        @close="closeModal"
    />
</template>

<style scoped>
.chart-container {
    height: 220px;
}
</style>
