<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import type {Product, Result} from "./model/Result.ts";

const router = useRouter();

const projectName: string | undefined = undefined;

const products = ref<Product[]>([]);
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
  router.push({name: 'product-details', params: {id: product.id}});
};

const onNavigateTo = (view: string) => {
  if (view !== 'product-details') {
    selectedProduct.value = null;
  }

  router.push({name: view});
};

const onUploadClicked = () => {
  router.push({name: 'result-upload'});
};


const onSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};

const onProductSelected = (productId: string) => {
  const product = products.value.find(p => p.id === productId);
  if (product) {
    selectedProduct.value = product;
    router.push({name: 'product-details', params: {id: product.id}});
  }
};

</script>

<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar
        :products="products"
        :selected-product="selectedProduct"
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
          @upload-clicked="onUploadClicked"
      ></Navbar>

      <div class="container-fluid mt-4">
        <router-view
            :selected-product="selectedProduct"
            @file-dropped="onJsonData"
            @product-selected="onProductSelected"
        />
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
