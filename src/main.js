import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios';
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
let app = createApp(App);
app.config.globalProperties.$http = axios;
app.use(BootstrapVue3);
app.mount('#app');

