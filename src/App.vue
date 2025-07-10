<script setup lang="ts">
import {ref} from 'vue';
import Dashboard from "./views/Dashboard.vue";
import ResultSelection from "./views/ResultSelection.vue";
import Navbar from "./components/Navbar.vue";


// TODO: set default name and read actual name after file upload
const projectName: string | undefined = undefined

const hasResults = ref(false)
const result = ref(null);

const onJsonData = (data: any) => {
  result.value = data;
  hasResults.value = true;
};

</script>

<template>

  <Navbar :title="projectName"></Navbar>
  <div class="container mt-4">
    <div v-if="hasResults">
      <Dashboard/>
    </div>

    <div v-else>
      <ResultSelection @file-dropped="onJsonData"/>
    </div>
  </div>
</template>
