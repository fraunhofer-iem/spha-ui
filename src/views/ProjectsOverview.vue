<script setup lang="ts">

import {store} from "../store.ts";
import {computed} from "vue";

const products = store.products

const avgHealthScore = computed(() => {
  if (products.length === 0) return 0;
  const score = 0
  return products.reduce((acc, product) => {
    return acc + (product.results[product.results.length - 1]?.healthScore ?? 0)
  }, score) / products.length
})

</script>

<template>
  <div>
    This view is under construction. It'll display project overarching statistics like the average health score.
    Current average health score: {{ avgHealthScore }}
  </div>
</template>

<style scoped>

</style>