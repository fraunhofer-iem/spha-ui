<script setup lang="ts">
import {ref} from "vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import type {Result} from "./model/Result.ts";
import ProductDetails from "./views/ProductDetails.vue";
import ProjectsOverview from "./views/ProjectsOverview.vue";
import ResultUpload from "./views/ResultUpload.vue";
import ProductList from "./views/ProductList.vue";

const projectName: string | undefined = undefined;

const hasResults = ref(false);
const result = ref<Result | null>(null);
const activeView = ref<string>('result-upload');
const sidebarCollapsed = ref(false);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  console.log(data);
  result.value = data;
  hasResults.value = true;
  activeView.value = 'product-details';
};

const onNavigateTo = (view: string) => {
  activeView.value = view;
  if (view === 'product-details' && !hasResults.value) {
    // If navigating to product details but no results, go to upload instead
    activeView.value = 'result-upload';
  }
};

const onUploadClicked = () => {
  activeView.value = 'result-upload';
  hasResults.value = false;
};

const onBackClicked = () => {
  if (hasResults.value) {
    activeView.value = 'product-details';
  } else {
    activeView.value = 'result-upload';
  }
};

const onSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};

</script>

<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar
        :active-view="activeView"
        @navigate-to="onNavigateTo"
        @sidebar-toggle="onSidebarToggle"
    />

    <!-- Main Content Area -->
    <div class="flex-grow-1 main-content" :style="`margin-left: ${sidebarCollapsed ? '80px' : '250px'};`">
      <Navbar
          :title="projectName"
          :show-on-dashboard="hasResults"
          @upload-clicked="onUploadClicked"
          @back-clicked="onBackClicked"
      ></Navbar>

      <div class="container-fluid mt-4">

        <!-- Projects Overview View -->
        <div v-if="activeView === 'projects-overview'">
          <ProjectsOverview/>
        </div>

        <!-- Product Details View -->
        <div v-else-if="activeView === 'product-details'">
          <ProductDetails v-bind="result"/>
        </div>

        <!-- Result Upload View -->
        <div v-else-if="activeView === 'result-upload'">
          <ResultUpload @file-dropped="onJsonData"/>
        </div>

        <!-- Product List -->
        <div v-else-if="activeView === 'product-list'">
          <ProductList/>
        </div>

        <!-- Fallback: Show upload if trying to access product details without data -->
        <div v-else>
          <div class="alert alert-info" role="alert">
            <i class="bi bi-info-circle me-2"></i>
            Please upload a result file to view product details.
          </div>
          <ResultUpload @file-dropped="onJsonData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}
</style>
