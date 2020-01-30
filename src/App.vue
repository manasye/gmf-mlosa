<template>
  <div id="app">
    <div id="nav" v-if="$route.name !== 'login'">
      <navbar></navbar>
    </div>
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar
  }
};
</script>

<style lang="scss">
.prev,
.next {
  opacity: 0;
  cursor: default !important;
}

.modal-calendar {
  .prev,
  .next {
    opacity: 1;
    cursor: pointer !important;
  }
}

@font-face {
  font-family: "circularstd";
  src: url("./assets/font/CircularStd-Book.otf");
}

@font-face {
  font-family: "circularstd";
  src: url("./assets/font/CircularStd-Bold.otf");
  font-weight: bold;
}

body {
  font-family: "circularstd", sans-serif !important;
  overflow-x: hidden;
  /* min-height: 100.1vh; */
}

img {
  max-width: 100%;
}

.container-app {
  margin: 0 2rem;
  padding: 1rem 0;
}

#nav {
  margin-top: 75px;
}

.calendar {
  div {
    width: 100% !important;
  }
}

.navbar {
  padding: 0.5rem 2rem;
}

.header-title {
  color: #13629a;
  font-weight: bold;
}

.primary-color {
  color: #13629a;
}

.slick-prev:before {
  color: #13629a !important;
}

.slick-next:before {
  color: #13629a !important;
}

.grey-text {
  color: #949699;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-underline {
  &:hover {
    text-decoration: underline;
  }
}

.status-badges {
  margin: 5px;
  text-transform: capitalize;
  color: white;
}

/*.apexcharts-canvas {*/
/*  max-width: 100%;*/
/*}*/
.breadcrumb {
  background-color: transparent !important;
  padding: 0 0 !important;
}

.btn-primary {
  background-color: #13629a !important;
  border-color: #13629a !important;
}

.badge-primary {
  background-color: #13629a !important;
}

#heading-premium {
  display: none !important;
}

@media (max-width: 700px) {
  .container-app {
    margin: 0 1rem;
  }
  .navbar {
    padding: 0.5rem 1rem !important;
  }
}
</style>
