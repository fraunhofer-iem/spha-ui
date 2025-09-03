<script setup lang="ts">
import {ref} from "vue";
import Navbar from "./components/Navbar.vue";
import type {Result} from "./model/Result.ts";
import ProductDetails from "./views/ProductDetails.vue";
import ResultUpload from "./views/ResultUpload.vue";

const projectName: string | undefined = undefined;

const hasResults = ref(false);
const result = ref<Result | null>(null);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  console.log(data);
  result.value = data;
  hasResults.value = true;
};

const onUploadClicked = () => {
  hasResults.value = false;
};

const onBackClicked = () => {
  hasResults.value = true;
};

</script>

<template>
  <Navbar
      :title="projectName"
      :show-on-dashboard="hasResults"
      @upload-clicked="onUploadClicked"
      @back-clicked="onBackClicked"
  ></Navbar>
  <div class="container mt-4">
    <div v-if="hasResults">
      <ProductDetails v-if="result" v-bind="result"/>
    </div>

    <div v-else>
      <ResultUpload @file-dropped="onJsonData"/>
    </div>
  </div>
</template>
