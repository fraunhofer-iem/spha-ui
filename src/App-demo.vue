<script setup lang="ts">
import {onMounted, ref} from "vue";
import Dashboard from "./views/Dashboard.vue";
import Navbar from "./components/Navbar.vue";
import type {Result} from "./model/Result.ts";
import {parse} from "./util/Parser.ts";
import ResultSelection from "./views/ResultSelection.vue";

const projectName: string | undefined = undefined;

const result = ref<Result | null>(null);
const hasResults = ref(false);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  console.log(data);
  result.value = data;
  hasResults.value = true;
};

// Check for programmatic file loading on mount
onMounted(async () => {
  try {
    // Load demo file from public folder
    const response = await fetch('https://raw.githubusercontent.com/fraunhofer-iem/spha-ui/refs/heads/main/example/kpi-results.json');
    if (!response.ok) {
      throw new Error(`Failed to load demo file: ${response.status}`);
    }

    const rawData = await response.json();
    const parsedResult = parse(rawData);

    if (parsedResult) {
      onJsonData(parsedResult);
      console.log('Demo file loaded successfully:', parsedResult);
      hasResults.value = true;
    } else {
      console.error('Failed to parse demo file data');
    }
  } catch (error) {
    console.error('Error loading demo file:', error);
  }
});


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
      <Dashboard v-if="result" v-bind="result"/>
    </div>
    <div v-else>
      <ResultSelection @file-dropped="onJsonData"/>
    </div>
  </div>
</template>
