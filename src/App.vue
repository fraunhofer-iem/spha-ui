<script setup lang="ts">
import {ref} from "vue";
import Dashboard from "./views/Dashboard.vue";
import ResultSelection from "./views/ResultSelection.vue";
import Navbar from "./components/Navbar.vue";
import type {Result} from "./model/Result.ts";

const projectName: string | undefined = undefined;

const hasResults = ref(false);
const result = ref<Result | null>(null);

const onJsonData = (data: Result | null) => {
  if (data === null) {
    return;
  }
  result.value = data;
  hasResults.value = true;
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
