<script setup lang="ts">
import {onMounted, ref} from "vue";
import Dashboard from "./views/Dashboard.vue";
import Navbar from "./components/Navbar.vue";
import type {Result} from "./model/Result.ts";
import {parse} from "./util/Parser.ts";

const projectName: string | undefined = undefined;

const result = ref<Result | null>(null);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  console.log(data);
  result.value = data;
};

// Check for programmatic file loading on mount
onMounted(async () => {
  try {
    // Load demo file from public folder
    const response = await fetch('/kpi-results.json');
    if (!response.ok) {
      throw new Error(`Failed to load demo file: ${response.status}`);
    }
    
    const rawData = await response.json();
    const parsedResult = parse(rawData);
    
    if (parsedResult) {
      onJsonData(parsedResult);
      console.log('Demo file loaded successfully:', parsedResult);
    } else {
      console.error('Failed to parse demo file data');
    }
  } catch (error) {
    console.error('Error loading demo file:', error);
  }
});


</script>

<template>
  <Navbar
      :title="projectName"
  ></Navbar>
  <div class="container mt-4">
    <Dashboard v-if="result" v-bind="result"/>
  </div>
</template>
