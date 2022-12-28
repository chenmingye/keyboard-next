import "./_BASE_.less";
import App from "./app.vue";
import { createApp } from "vue";
import keyBoard from "../packages";
import Antd from 'ant-design-vue'; 
import 'ant-design-vue/dist/antd.css';
createApp(App)
.use(Antd)
  .use(keyBoard)
  .mount("#app");
