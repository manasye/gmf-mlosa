<template>
  <div id="app">
    <div id="nav">
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
.slick-prev:before {
  color: #13629a !important;
}
.slick-next:before {
  color: #13629a !important;
}
.grey-text {
  color: #949699;
}
.status-badges {
  margin: 5px;
  text-transform: capitalize;
  color: white;
}
/*.apexcharts-canvas {*/
/*  max-width: 100%;*/
/*}*/
@media (max-width: 700px) {
  .container-app {
    margin: 0 1rem;
  }
  .navbar {
    padding: 0.5rem 1rem !important;
  }
}
</style>
