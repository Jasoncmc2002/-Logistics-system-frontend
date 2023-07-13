import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { setupStore } from "@/store";
import { setupDirective } from "@/directive";

import "@/permission";

// 本地SVG图标
import "virtual:svg-icons-register";

// 国际化
import i18n from "@/lang/index";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
//eachart
import { plugin } from "echarts-for-vue";
import * as echarts from "echarts";
import Particles from "particles.vue3";
import ElementPlus from "element-plus";
const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);
app
  .use(router)
  .use(plugin, { echarts, h })
  .use(i18n)
  .use(Particles)
  .use(ElementPlus)
  .mount("#app");
