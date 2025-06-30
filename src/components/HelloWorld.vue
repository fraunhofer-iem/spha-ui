<script setup lang="ts">
import {ref} from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="container py-4 px-3 mx-auto">
    <h1>Hello, Bootstrap and Vite!</h1>
    <button class="btn btn-primary">Primary button</button>
  </div>
  <p class="d-inline-flex gap-1">
    <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false"
       aria-controls="collapseExample">
      Link with href
    </a>
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
            aria-expanded="false" aria-controls="collapseExample">
      Button with data-bs-target
    </button>
  </p>
  <div class="collapse" id="collapseExample">
    <div class="card card-body">
      Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user
      activates the relevant trigger.
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
