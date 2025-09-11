import {createApp} from 'vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/dashboard-card.scss';
import router from './router'

declare var __DEMO_MODE__: string;

async function main() {
    let App;
    if (__DEMO_MODE__) {
        console.log('Running in demo mode');
        App = await import("./App-demo.vue");
    } else {
        console.log('Running in default mode');
        App = await import("./App.vue");
    }
    createApp(App.default).use(router).mount('#app')
}

main();
