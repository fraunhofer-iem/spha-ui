<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import type {Product, Result} from "./model/Result.ts";
import {store} from "./store.ts";

const router = useRouter();

const products = store.products;
const sidebarCollapsed = ref(false);

const selectedProduct = ref<Product | null>(null);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  console.log(data);

  const product = store.addResult(data);
  // ToDo: calls tore
  selectedProduct.value = product;
  router.push({name: 'product-details', params: {id: product.id}});
};

const onNavigateTo = (view: string) => {
  if (view !== 'product-details') {
    selectedProduct.value = null;
  }

  router.push({name: view});
};

// ToDo: check if it can be removed
// const onUploadClicked = () => {
//   router.push({name: 'result-upload'});
// };


const onSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};

const onProductSelected = (productId: string) => {
  const product = products.find(p => p.id === productId);
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
          :title="selectedProduct?.name ?? ''"
      ></Navbar>

      <div class="container-fluid mt-4">
        <router-view
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
