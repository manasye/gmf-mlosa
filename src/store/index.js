import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  getters: {},
  actions: {
    goToPage(context, page) {
      return router.push(page);
    }
  },
  modules: {}
});
