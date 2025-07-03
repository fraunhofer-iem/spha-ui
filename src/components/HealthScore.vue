<script setup lang="ts">
import {computed} from 'vue';
import SphaIcon from './../assets/img/SPHA_Icon_Light.svg';
import DashboardCard from './DashboardCard.vue';

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
  <DashboardCard title="Project Health Score" icon="journal-code">
    <figure class="figure">
      <img :src="SphaIcon" alt="Project" class="figure-img img-fluid rounded"/>
    </figure>
    <div class="text-center">
      <div :class="['fs-3 fw-bold', scoreColorClass]">
        {{ score }} / 100
      </div>
      <div class="text-muted small">Score</div>
    </div>
  </DashboardCard>
</template>

<style scoped>
.figure {
  max-width: 50%;
  max-height: 250px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.figure img {
  max-height: 100%;
  width: auto;
  object-fit: contain;
}

</style>
