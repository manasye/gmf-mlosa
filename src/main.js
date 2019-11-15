import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faChartLine,
  faCalendar,
  faFile,
  faArchive,
  faDownload,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// require styles
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

library.add(faHome);
library.add(faChartLine);
library.add(faCalendar);
library.add(faFile);
library.add(faArchive);
library.add(faDownload);
library.add(faQuestionCircle);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
