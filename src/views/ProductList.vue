<script setup lang="ts">
import type { Product } from '../model/Result.ts';

interface Props {
  products?: Product[];
}

const props = withDefaults(defineProps<Props>(), {
  products: () => []
});

const getNewestVersion = (product: Product): string => {
  if (product.results.length === 0) return 'Unknown';
  const lastResult = product.results[product.results.length - 1];
  return lastResult?.repoInfo.version || 'Unknown';
};

const getUsedLanguages = (product: Product): string => {
  if (product.results.length === 0) return 'Unknown';
  const lastResult = product.results[product.results.length - 1];
  return lastResult?.repoInfo.repoLanguages.map(lang => lang.name).join(', ') || 'Unknown';
};

const getProjectUrl = (product: Product): string => {
  if (product.results.length === 0) return '#';
  const lastResult = product.results[product.results.length - 1];
  return lastResult?.repoInfo.projectUrl || '#';
};
</script>

<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <h2 class="mb-4">Product List</h2>
      
      <div v-if="props.products.length === 0" class="alert alert-info" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        No products available. Upload some result files to see products here.
      </div>
      
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Newest Version</th>
              <th scope="col">Used Languages</th>
              <th scope="col">URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in props.products" :key="product.id">
              <td>
                <strong>{{ product.name }}</strong>
              </td>
              <td>
                <span class="badge bg-primary">{{ getNewestVersion(product) }}</span>
              </td>
              <td>
                <small class="text-muted">{{ getUsedLanguages(product) }}</small>
              </td>
              <td>
                <a 
                  v-if="getProjectUrl(product) !== '#'" 
                  :href="getProjectUrl(product)" 
                  target="_blank" 
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-link-45deg"></i> View Repository
                </a>
                <span v-else class="text-muted">No URL available</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.table th {
  border-top: none;
}

.badge {
  font-size: 0.75em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>