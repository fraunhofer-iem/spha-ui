<script setup lang="ts">

interface Props {
  activeView?: string;
}

withDefaults(defineProps<Props>(), {
  activeView: 'product-details'
});

const emit = defineEmits<{
  navigateTo: [view: string];
}>();

const handleNavigation = (view: string) => {
  emit('navigateTo', view);
};
</script>

<template>
  <div class="sidebar border-end vh-100 position-fixed" :style="`width: 250px; z-index: 1000;`">
    <div class="mt-2 p-3">
      <img
          src="./../assets/img/SPHA_Logo_Secondary.svg"
          alt="Software Product Health Assistant"
          width="220">
    </div>
    <div class="p-3">
      <nav class="nav flex-column">

        <a
            href="#"
            class="nav-link d-flex align-items-center py-3 px-3 mb-2 rounded"
            :class="{
            'bg-primary text-white': activeView === 'projects-overview',
            'text-dark': activeView !== 'projects-overview'
          }"
            @click.prevent="handleNavigation('projects-overview')"
        >
          <i class="bi bi-list-ul me-3"></i>
          Projects Overview
        </a>

        <a
            href="#"
            class="nav-link d-flex align-items-center py-3 px-3 mb-2 rounded"
            :class="{
            'bg-primary text-white': activeView === 'product-details',
            'text-dark': activeView !== 'product-details'
          }"
            @click.prevent="handleNavigation('product-details')"
        >
          <i class="bi bi-graph-up me-3"></i>
          Product Details
        </a>


        <a
            href="#"
            class="nav-link d-flex align-items-center py-3 px-3 mb-2 rounded"
            :class="{
            'bg-primary text-white': activeView === 'result-upload',
            'text-dark': activeView !== 'result-upload'
          }"
            @click.prevent="handleNavigation('result-upload')"
        >
          <i class="bi bi-cloud-upload me-3"></i>
          Result Upload
        </a>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  top: 0;
  left: 0;
}

.nav-link {
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(13, 110, 253, 0.1) !important;
  transform: translateX(5px);
}

.nav-link.bg-primary:hover {
  background-color: rgba(13, 110, 253, 0.9) !important;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>