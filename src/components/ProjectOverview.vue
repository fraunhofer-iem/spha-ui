<script setup lang="ts">
import {computed} from "vue";
import DashboardCard from "./DashboardCard.vue";

interface ProjectOverviewProps {
  projectUrl?: string
  projectName?: string
  contributors?: number
  lastCommitDate?: string
  stars?: number
}

const props = withDefaults(defineProps<ProjectOverviewProps>(), {
  projectUrl: 'Project URL not found',
  projectName: 'Project Name not found',
})

const formattedContributors = computed(() => {
  // Access props via the 'props' object.
  if (props.contributors === undefined) {
    return "Number of Contributors not found"
  }
  return props.contributors.toLocaleString();
});

const formattedStars = computed(() => {
  if (props.stars === undefined) {
    return "Number of Stars not found"
  }
  return props.stars.toLocaleString();
});

// Format last commit date
const formattedLastCommitDate = computed(() => {
  if (!props.lastCommitDate) {
    return "Last commit date not found"
  }

  const date = new Date(props.lastCommitDate);
  if (isNaN(date.getTime())) {
    return "Invalid date"
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

</script>
<template>
  <DashboardCard :title="projectName">
    <div class="container text-center h-100 d-flex justify-content-center align-items-center">
      <div class="grid-container">
        <div class="row border-bottom">
          <!-- Stars -->
          <div class="col border-end stat-item">
            <i class="bi bi-star-fill text-warning me-2"></i>
            <div>
              <div class="fs-5 fw-semibold">{{ formattedStars }}</div>
              <div class="text-muted small">Stars</div>
            </div>
          </div>
          <!-- Last Commit -->
          <div class="col stat-item">
            <i class="bi bi-clock-history text-secondary me-2"></i>
            <div>
              <div class="fs-6 fw-semibold">{{ formattedLastCommitDate }}</div>
              <div class="text-muted small">Last Commit</div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Contributors -->
          <div class="col border-end stat-item">
            <i class="bi bi-people-fill text-primary me-2"></i>
            <div>
              <div class="fs-5 fw-semibold">{{ formattedContributors }}</div>
              <div class="text-muted small">Contributors</div>
            </div>
          </div>

          <div class="col">
            <label for="projectUrlInput" class="form-label text-muted small">URL</label>
            <div class="input-group">
              <input type="text" id="projectUrlInput" class="form-control" :value="projectUrl" readonly>
              <a :href="projectUrl" target="_blank" class="btn btn-outline-secondary" role="button">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DashboardCard>
</template>

<style scoped>
.grid-container {
  width: 100%;
  max-width: 100%;
}
</style>
