import {reactive} from "vue";
import type {Product, Result} from "./model/Result.ts";

export const store = reactive({
    products: [] as Product[],
    addResult(result: Result) {
        return addResult(result)
    },
    getProductById(id: string) {
        return this.products.find(product => product.id === id)
    },
    hasProducts() {
        return store.products.length > 0
    }
})


function addResult(result: Result) {
    // Create a new product for this result
    const productName = result.repoInfo.projectName || `Product ${store.products.length + 1}`;
    const idx = store.products.findIndex(product => product.name === productName);
    let product: Product
    if (idx == -1) {
        product = {
            id: `product-${Date.now()}`,
            name: productName,
            description: `Analysis results for ${productName}`,
            version: result.repoInfo.version,
            results: [result],
            createdAt: new Date().toISOString()
        };

        store.products.push(product);

    } else {
        product = store.products[idx]!!;
        product.results.push(result);
    }

    return product;

}