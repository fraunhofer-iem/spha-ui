<script setup lang="ts">
import {onMounted, ref} from "vue";
import Dashboard from "./views/Dashboard.vue";
import Navbar from "./components/Navbar.vue";
import type {Result} from "./model/Result.ts";

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
