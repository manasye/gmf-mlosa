import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    role: ''
  },
  mutations: {
    changeRole(state, role) {
      state.role = role;
    }
  },
  getters: {role: state => state.role},
  actions: {
    goToPage(context, page) {
      return router.push(page);
    }
  },
  modules: {}
});
