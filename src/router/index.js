import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
  },
  {
    path: "/global-plan",
    name: "global plan",
    component: () =>
      import(/* webpackChunkName: "global-plan" */ "../views/GlobalPlan.vue")
  },
  {
    path: "/observation-list",
    name: "observation list",
    component: () =>
      import(
        /* webpackChunkName: "observation-list" */ "../views/ObservationList.vue"
      )
  },
  {
    path: "/observation-form",
    name: "observation form",
    component: () =>
      import(
        /* webpackChunkName: "observation-form" */ "../views/ObservationForm.vue"
      )
  },
  {
    path: "/report-list",
    name: "report list",
    component: () =>
      import(/* webpackChunkName: "report-list" */ "../views/ReportList.vue")
  },
  {
    path: "/report-recommendation",
    name: "report recommendation",
    component: () =>
      import(
        /* webpackChunkName: "recommendation" */ "../views/Recommendation.vue"
      )
  }
];

const router = new VueRouter({
  routes
});

export default router;
