import {createApp} from 'vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/dashboard-card.scss';
import router from './router'
import {parse} from "./util/Parser.ts";
import {store} from "./store.ts";

declare var __DEMO_MODE__: string;

async function main() {

    const App = await import("./App.vue");
    createApp(App.default).use(router).mount('#app')


    try {
        // Load demo file from public folder
        const response = await fetch('https://raw.githubusercontent.com/fraunhofer-iem/spha-ui/refs/heads/main/example/kpi-results.json');
        if (response.ok) {

            const rawData = await response.json();
            const parsedResult = parse(rawData);

            if (parsedResult) {
                store.addResult(parsedResult);
            } else {
                console.error('Failed to parse demo file data');
            }
        }
    } catch (error) {
        console.error('Error loading demo file:', error);
    }
}

main();
