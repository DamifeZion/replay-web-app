import "./assets/index.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import pinia from "./plugins/pinia";
import { MotionPlugin } from "@vueuse/motion";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(MotionPlugin);

app.mount("#app");
