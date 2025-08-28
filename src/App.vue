<script setup lang="ts">
import {ref, onMounted} from "vue";
import Dashboard from "./views/Dashboard.vue";
import ResultSelection from "./views/ResultSelection.vue";
import Navbar from "./components/Navbar.vue";
import type {Result} from "./model/Result.ts";
import { parse } from "./util/Parser";

const projectName: string | undefined = undefined;

const hasResults = ref(false);
const result = ref<Result | null>(null);
const isLoadingProgrammaticFile = ref(false);
const programmaticFileError = ref<string | null>(null);

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
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const fileParam = urlParams.get('file');
  
  // Check environment variables (Vite prefixed with VITE_)
  const envFile = import.meta.env.VITE_DEFAULT_FILE;
  
  const filePath = fileParam || envFile;
  
  if (filePath) {
    await loadProgrammaticFile(filePath);
  }
});

const loadProgrammaticFile = async (filePath: string) => {
  isLoadingProgrammaticFile.value = true;
  programmaticFileError.value = null;
  
  try {
    console.log(`Loading programmatic file: ${filePath}`);
    
    // Try to fetch the file
    let response: Response;
    
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // Remote file
      response = await fetch(filePath);
    } else {
      // Local file - try to fetch from public directory or relative to current location
      const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
      response = await fetch(normalizedPath);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    const jsonData = await response.json();
    const parsedResult = parse(jsonData);
    
    if (!parsedResult) {
      throw new Error('Invalid result format in the programmatic file.');
    }
    
    console.log('Programmatic file loaded successfully');
    result.value = parsedResult;
    hasResults.value = true;
  } catch (error) {
    console.error('Error loading programmatic file:', error);
    programmaticFileError.value = `Failed to load programmatic file "${filePath}": ${error instanceof Error ? error.message : 'Unknown error'}`;
  } finally {
    isLoadingProgrammaticFile.value = false;
  }
};
</script>

<template>
  <Navbar :title="projectName"></Navbar>
  <div class="container mt-4">
    <div v-if="hasResults">
      <Dashboard v-if="result" v-bind="result"/>
    </div>

    <div v-else>
      <ResultSelection @file-dropped="onJsonData"/>
    </div>
  </div>
</template>
