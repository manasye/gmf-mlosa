import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import VueQuillEditor from "vue-quill-editor";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/froala_editor.min.js";
import "froala-editor/css/froala_style.min.css";
import CKEditor from "@ckeditor/ckeditor5-vue";
import axios from "axios";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faChartLine,
  faCalendar,
  faFile,
  faArchive,
  faDownload,
  faQuestionCircle,
  faEye,
  faEyeSlash,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueFroala from "vue-froala-wysiwyg";

// require styles
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import {
  shortenText,
  convertSnakeCaseToText,
  getUsername,
  getPhoto,
  getFullname
} from "@/utility/func.js";

library.add(faHome);
library.add(faChartLine);
library.add(faCalendar);
library.add(faFile);
library.add(faArchive);
library.add(faDownload);
library.add(faQuestionCircle);
library.add(faEye);
library.add(faEyeSlash);
library.add(faTrash);

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    shortenText,
    convertSnakeCaseToText,
    getUsername,
    getPhoto,
    getFullname
  }
});

Vue.use(BootstrapVue);
Vue.use(VueApexCharts);
Vue.use(VueQuillEditor /* { default global options } */);
Vue.use(CKEditor);
Vue.use(VueFroala);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("apexchart", VueApexCharts);
Vue.component("VueCtkDateTimePicker", VueCtkDateTimePicker);

axios.defaults.baseURL = "http://172.16.41.172:8080/api";
axios.defaults.withCredentials = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
