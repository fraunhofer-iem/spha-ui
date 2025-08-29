import {createApp} from 'vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/dashboard-card.scss';

async function main() {
    if (__DEMO_MODE__) {
        console.log('Running in demo mode');
        const App = await import("./App-demo.vue");
        createApp(App.default).mount('#app')
    } else {
        console.log('Running in default mode');
        const App = await import("./App.vue");
        createApp(App.default).mount('#app')
    }
}

main();
