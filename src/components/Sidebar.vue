<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue';
import {Popover} from 'bootstrap';

interface Props {
  activeView?: string;
}

withDefaults(defineProps<Props>(), {
  activeView: 'product-details'
});

const emit = defineEmits<{
  navigateTo: [view: string];
}>();

const isCollapsed = ref(false);

const handleNavigation = (view: string) => {
  emit('navigateTo', view);
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleImageClick = () => {
  if (isCollapsed.value) {
    isCollapsed.value = false;
  }
};

let popovers: Popover[] = [];

const initializePopovers = () => {
  // Dispose existing popovers
  popovers.forEach(popover => popover.dispose());
  popovers = [];

  // if (isCollapsed.value) {
    // Initialize popovers for all elements with data-bs-toggle="popover"
    const popoverElements = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverElements.forEach(element => {
      const popover = new Popover(element as Element);
      popovers.push(popover);
    });
  // }
};

onMounted(() => {
  nextTick(() => {
    initializePopovers();
  });
});

watch(isCollapsed, () => {
  nextTick(() => {
    initializePopovers();
  });
});
</script>

<template>
  <div class="sidebar border-end vh-100 position-fixed"
       :style="`width: ${isCollapsed ? '80px' : '250px'}; z-index: 1000;`">
    <div class="mt-2 p-3 d-flex align-items-center justify-content-between">
      <img
          src="./../assets/img/SPHA_Icon_Light.svg"
          alt="Software Product Health Assistant"
          width="50"
          class="sidebar-logo"
          @click="handleImageClick"
          :style="{ cursor: isCollapsed ? 'e-resize' : 'default' }"
          :data-bs-toggle="isCollapsed ? 'popover' : ''"
          :data-bs-placement="isCollapsed ? 'right' : ''"
          :data-bs-trigger="isCollapsed ? 'hover' : ''"
          :data-bs-content="isCollapsed ? 'Open Sidebar' : ''">

      <a class="btn  btn-sm ms-2"
         v-if="!isCollapsed"
         style="cursor:w-resize"
         @click="toggleSidebar"
         :data-bs-toggle="!isCollapsed ? 'popover' : ''"
         :data-bs-placement="!isCollapsed ? 'bottom' : ''"
         :data-bs-trigger="!isCollapsed ? 'hover' : ''"
         :data-bs-content="!isCollapsed ? 'Collapse Sidebar' : ''">
        <i class="bi bi-layout-sidebar" style="font-size: 1.5rem"></i>
      </a>
    </div>
    <div class="p-3">
      <nav class="nav flex-column">

        <a
            href="#"
            class="nav-link d-flex align-items-center py-3 mb-2 rounded"
            :class="{
            'bg-primary text-white': activeView === 'projects-overview',
            'text-dark': activeView !== 'projects-overview',
            'justify-content-center': isCollapsed,
            'px-3': !isCollapsed
          }"
            @click.prevent="handleNavigation('projects-overview')"
            :data-bs-toggle="isCollapsed ? 'popover' : ''"
            :data-bs-placement="isCollapsed ? 'right' : ''"
            :data-bs-trigger="isCollapsed ? 'hover' : ''"
            :data-bs-content="isCollapsed ? 'Projects Overview' : ''"
        >
          <i class="bi bi-list-ul" :class="{ 'me-3': !isCollapsed }"></i>
          <span v-if="!isCollapsed">Projects Overview</span>
        </a>

        <a
            href="#"
            class="nav-link d-flex align-items-center py-3 mb-2 rounded"
            :class="{
            'bg-primary text-white': activeView === 'product-details',
            'text-dark': activeView !== 'product-details',
            'justify-content-center': isCollapsed,
            'px-3': !isCollapsed
          }"
            @click.prevent="handleNavigation('product-details')"
            :data-bs-toggle="isCollapsed ? 'popover' : ''"
            :data-bs-placement="isCollapsed ? 'right' : ''"
            :data-bs-trigger="isCollapsed ? 'hover' : ''"
            :data-bs-content="isCollapsed ? 'Product Details' : ''"
        >
          <i class="bi bi-graph-up" :class="{ 'me-3': !isCollapsed }"></i>
          <span v-if="!isCollapsed">Product Details</span>
        </a>

        <a
            href="#"
            class="nav-link d-flex align-items-center py-3 mb-2 rounded"
            :class="{
            'bg-primary text-white': activeView === 'result-upload',
            'text-dark': activeView !== 'result-upload',
            'justify-content-center': isCollapsed,
            'px-3': !isCollapsed
          }"
            @click.prevent="handleNavigation('result-upload')"
            :data-bs-toggle="isCollapsed ? 'popover' : ''"
            :data-bs-placement="isCollapsed ? 'right' : ''"
            :data-bs-trigger="isCollapsed ? 'hover' : ''"
            :data-bs-content="isCollapsed ? 'Result Upload' : ''"
        >
          <i class="bi bi-cloud-upload" :class="{ 'me-3': !isCollapsed }"></i>
          <span v-if="!isCollapsed">Result Upload</span>
        </a>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  top: 0;
  left: 0;
  transition: width 0.3s ease;
}

.sidebar-logo {
  transition: all 0.3s ease;
}

.nav-link {
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
}

.nav-link span {
  transition: opacity 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(13, 110, 253, 0.1) !important;
  transform: translateX(5px);
}

.nav-link.bg-primary:hover {
  background-color: rgba(13, 110, 253, 0.9) !important;
  transform: translateX(0);
}

.nav-link.justify-content-center:hover {
  transform: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease, width 0.3s ease;
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>