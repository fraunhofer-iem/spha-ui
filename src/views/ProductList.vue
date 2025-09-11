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

      <!-- Empty State -->
      <div v-if="props.products.length === 0" class="text-center py-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body py-5">
            <i class="bi bi-inbox display-1 text-muted mb-3"></i>
            <h4 class="text-muted mb-3">No Products Available</h4>
            <p class="text-muted mb-4">Upload some result files to see your products here.</p>
            <div class="alert alert-info border-0" role="alert">
              <i class="bi bi-info-circle me-2"></i>
              Get started by uploading your first analysis result
            </div>
          </div>
        </div>
      </div>
      
      <!-- Products Table -->
      <div v-else class="card border-0 shadow-sm">
        <div class="card-header bg-gradient bg-primary text-white py-3">
          <h5 class="mb-0 fw-semibold">
            <i class="bi bi-list-ul me-2"></i>
            Products Overview
          </h5>
        </div>
        
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="fw-semibold text-dark py-3 ps-4">
                  <i class="bi bi-box me-2 text-primary"></i>
                  Product Name
                </th>
                <th scope="col" class="fw-semibold text-dark py-3">
                  <i class="bi bi-tag me-2 text-success"></i>
                  Version
                </th>
                <th scope="col" class="fw-semibold text-dark py-3">
                  <i class="bi bi-code-slash me-2 text-warning"></i>
                  Languages
                </th>
                <th scope="col" class="fw-semibold text-dark py-3 pe-4">
                  <i class="bi bi-link-45deg me-2 text-info"></i>
                  Repository
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in props.products" :key="product.id" class="border-bottom">
                <td class="py-4 ps-4">
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-box text-primary"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1 text-dark">{{ product.name }}</h6>
                      <small class="text-muted">{{ product.description || 'No description available' }}</small>
                    </div>
                  </div>
                </td>
                <td class="py-4 align-middle">
                  <span class="badge bg-success bg-gradient px-3 py-2 fs-6 fw-normal">
                    <i class="bi bi-tag-fill me-1"></i>
                    {{ getNewestVersion(product) }}
                  </span>
                </td>
                <td class="py-4 align-middle">
                  <div class="language-tags">
                    <span class="badge bg-warning bg-gradient text-dark px-2 py-1 me-1 mb-1" 
                          v-for="lang in getUsedLanguages(product).split(', ').slice(0, 3)" 
                          :key="lang">
                      {{ lang }}
                    </span>
                    <span v-if="getUsedLanguages(product).split(', ').length > 3" 
                          class="badge bg-light text-dark px-2 py-1">
                      +{{ getUsedLanguages(product).split(', ').length - 3 }} more
                    </span>
                  </div>
                </td>
                <td class="py-4 pe-4 align-middle">
                  <a 
                    v-if="getProjectUrl(product) !== '#'" 
                    :href="getProjectUrl(product)" 
                    target="_blank" 
                    class="btn btn-outline-info btn-sm px-3 py-2 fw-semibold"
                  >
                    <i class="bi bi-box-arrow-up-right me-1"></i>
                    View Repository
                  </a>
                  <span v-else class="badge bg-light text-muted px-3 py-2">
                    <i class="bi bi-x-circle me-1"></i>
                    No URL
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="card-footer bg-light border-0 py-3">
          <div class="row align-items-center">
            <div class="col">
              <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                Showing all {{ props.products.length }} products
              </small>
            </div>
            <div class="col-auto">
              <small class="text-muted">
                Last updated: {{ new Date().toLocaleDateString() }}
              </small>
            </div>
          </div>
        </div>
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