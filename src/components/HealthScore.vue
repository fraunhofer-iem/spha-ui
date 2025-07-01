<script setup lang="ts">
import {computed} from 'vue';
import SphaIcon from './../assets/img/SPHA_Icon_Light.svg';

interface ScoreCardProps {
  score: number; // must be between 0 and 100
}

const props = defineProps<ScoreCardProps>();

// Compute the score color
const scoreColorClass = computed(() => {
  if (props.score >= 80) return 'text-success'; // green
  if (props.score >= 50) return 'text-warning'; // yellow
  return 'text-danger'; // red
});
</script>

<template>
  <div class="card dashboard-card h-100 d-flex flex-column">
    <!-- Card Header -->
    <div class="card-header p-3">
      <h5 class="card-title mb-0 fw-bold">
        <i class="bi bi-journal-code me-2"></i> Project Health Score
      </h5>
    </div>

    <!-- Card Body -->
    <div class="card-body align-items-center p-4 text-center justify-content-center">
      <figure class="figure">
        <img :src="SphaIcon" alt="Project" class="img-fluid"/>
      </figure>
      <div class="text-center">
        <div :class="['fs-3 fw-bold', scoreColorClass]">
          {{ score }} / 100
        </div>
        <div class="text-muted small">Score</div>
      </div>
    </div>
  </div>
</template>>

<style scoped>
.figure {
  max-width: 80%;
  max-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.5rem auto;
}

.figure img {
  max-height: 100%;
  width: auto;
  object-fit: contain;
}
</style>
