import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/dashboard/:type",
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
    path: "/observation-type/:id",
    name: "observation type",
    component: () =>
      import(
        /* webpackChunkName: "observation-type" */ "../views/ObservationType.vue"
      )
  },
  {
    path: "/observation-create/:id",
    name: "observation detail",
    component: () =>
      import(
        /* webpackChunkName: "observation-list-detail-type" */ "../views/ObservationDetail.vue"
      )
  },
  {
    path: "/observation/form",
    name: "observation form",
    component: () =>
      import(
        /* webpackChunkName: "observation-form" */ "../views/ObservationForm.vue"
      )
  },
  {
    path: "/observation-new",
    name: "observation new",
    component: () =>
      import(
        /* webpackChunkName: "observation-new-form" */ "../views/ObservationNew.vue"
      )
  },
  {
    path: "/observation-new/:type",
    name: "observation new type",
    component: () =>
      import(
        /* webpackChunkName: "observation-new-form-type" */ "../views/ObservationNew.vue"
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
  },
  {
    path: "/report-form",
    name: "report form",
    component: () =>
      import(/* webpackChunkName: "report-form" */ "../views/ReportForm.vue")
  },
  {
    path: "/report/:id",
    name: "report detail",
    component: () =>
      import(
        /* webpackChunkName: "report-detail" */ "../views/ReportDetail.vue"
      )
  }
];

const router = new VueRouter({
  routes
});

export default router;
