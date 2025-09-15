import {createRouter, createWebHistory} from 'vue-router'
import ProjectsOverview from '../views/ProjectsOverview.vue'
import ProductDetails from '../views/ProductDetails.vue'
import ResultUpload from '../views/ResultUpload.vue'
import ProductList from '../views/ProductList.vue'

const routes = [
    {
        path: '/',
        redirect: '/upload'
    },
    {
        path: '/projects',
        name: 'projects-overview',
        component: ProjectsOverview
    },
    {
        path: '/products',
        name: 'product-list',
        component: ProductList
    },
    {
        path: '/product/:id',
        name: 'product-details',
        component: ProductDetails,
        props: true
    },
    {
        path: '/upload',
        name: 'result-upload',
        component: ResultUpload
    }
]

const router = createRouter({
    history: createWebHistory('/spha-ui/'),
    routes
})

export default router