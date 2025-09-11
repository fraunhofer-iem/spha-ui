<script setup lang="ts">
import {ref} from "vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import type {Product, Result} from "./model/Result.ts";
import ProductDetails from "./views/ProductDetails.vue";
import ProjectsOverview from "./views/ProjectsOverview.vue";
import ResultUpload from "./views/ResultUpload.vue";
import ProductList from "./views/ProductList.vue";

const projectName: string | undefined = undefined;

const products = ref<Product[]>([]);
const activeView = ref<string>('result-upload');
const sidebarCollapsed = ref(false);

const hasProducts = ref(false);
const selectedProduct = ref<Product | null>(null);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  console.log(data);

  // Create a new product for this result
  const productName = data.repoInfo.projectName || `Product ${products.value.length + 1}`;
  const idx = products.value.findIndex(product => product.name === productName);
  let product: Product
  if (idx == -1) {
    product = {
      id: `product-${Date.now()}`,
      name: productName,
      description: `Analysis results for ${productName}`,
      version: data.repoInfo.version,
      results: [data],
      createdAt: new Date().toISOString()
    };

    products.value.push(product);

  } else {
    product = products.value[idx]!!;
    product.results.push(data);
  }

  selectedProduct.value = product;
  hasProducts.value = true;
  activeView.value = 'product-details';
};

const onNavigateTo = (view: string) => {
  if (view !== 'product-details') {
    selectedProduct.value = null;
  }
  activeView.value = view;
  if (view === 'product-details' && !hasProducts.value) {
    // If navigating to product details but no products, go to upload instead
    activeView.value = 'result-upload';
  }
};

const onUploadClicked = () => {
  activeView.value = 'result-upload';
};


const onSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};

const onProductSelected = (productId: string) => {
  const product = products.value.find(p => p.id === productId);
  if (product) {
    selectedProduct.value = product;
    activeView.value = 'product-details';
  }
};

</script>

<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar
        :active-view="activeView"
        :products="products"
        @navigate-to="onNavigateTo"
        @product-selected="onProductSelected"
        @sidebar-toggle="onSidebarToggle"
    />

    <!-- Main Content Area -->
    <div class="flex-grow-1 main-content" :style="`margin-left: ${sidebarCollapsed ? '80px' : '250px'};`">
      <Navbar
          :title="projectName"
          :show-on-dashboard="hasProducts"
          :selected-product-name="selectedProduct?.name"
          :current-view="activeView"
          @upload-clicked="onUploadClicked"
      ></Navbar>

      <div class="container-fluid mt-4">

        <!-- Projects Overview View -->
        <div v-if="activeView === 'projects-overview'">
          <ProjectsOverview/>
        </div>

        <!-- Product Details View -->
        <div v-else-if="activeView === 'product-details' && selectedProduct">
          <ProductDetails v-bind="selectedProduct"/>
        </div>

        <!-- Result Upload View -->
        <div v-else-if="activeView === 'result-upload'">
          <ResultUpload @file-dropped="onJsonData"/>
        </div>

        <!-- Product List -->
        <div v-else-if="activeView === 'product-list'">
          <ProductList :products="products" @product-selected="onProductSelected"/>
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
