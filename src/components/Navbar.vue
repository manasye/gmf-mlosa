<template>
  <div>
    <b-navbar toggleable="md" type="dark" class="navbar" fixed="top">
      <b-navbar-brand style="margin-right: 30px;">
        <img
          src="../assets/img/logo.png"
          alt
          class="logo-img d-inline-block align-top "
        />
        <span class="ml-3 logo-name">MLOSA</span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <div v-for="nav in navItems" :key="nav.name" :data-intro="nav.intro">
            <b-nav-item
              v-if="!nav.childrens"
              :href="nav.route"
              class="navbar-item"
              :class="{
                'navbar-item-active': activeRoutes
                  .toLowerCase()
                  .includes(nav.name.toLowerCase())
              }"
            >
              <font-awesome-icon :icon="nav.icon" class="mr-1" />
              {{ nav.name }}
            </b-nav-item>

            <b-nav-item-dropdown
              v-else
              :class="{
                'navbar-dropdown-item-active': activeRoutes
                  .toLowerCase()
                  .includes(nav.name.toLowerCase())
              }"
              class="mr-1"
            >
              <template v-slot:button-content>
                <font-awesome-icon :icon="nav.icon" class="mr-1" />
                {{ nav.name }}
              </template>
              <b-dropdown-item
                v-for="children in nav.childrens"
                :href="children.route"
                :key="children.name"
                >{{ children.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </div>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto nav-search">
          <b-nav-item-dropdown right class="no-icon-dropdown">
            <template v-slot:button-content>
              <img src="../assets/img/help.png" class="navbar-img" alt
            /></template>
            <b-dropdown-item v-for="h in hints" :key="h.name" :href="h.href">
              {{ h.name }}
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right class="no-icon-dropdown">
            <template v-slot:button-content>
              <img src="../assets/img/notif.png" class="navbar-img" alt
            /></template>
            <b-dropdown-item v-for="n in notifs" :key="n.name" :href="n.href">
              {{ n.name }}
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right class="user-navbar">
            <template v-slot:button-content>
              <img
                src="https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png"
                alt
                class="navbar-img"
              />
            </template>
            <div style="margin: 15px 15px 0 15px">
              <img
                src="https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png"
                alt
                class="navbar-img-expand mb-3"
              />
              <p class="mb-2 text-center">Hi</p>
              <b-button
                variant="primary"
                size="sm"
                class="d-block mx-auto mb-3"
                @click="logout"
                >LOG OUT</b-button
              >
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal v-model="showModal" centered title="Explore CRM Digital Marketing"
      >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet
      consequatur debitis dolorem eaque illo impedit iure mollitia numquam quis
      rem sed similique suscipit totam, voluptatibus. Blanditiis ipsum libero
      tenetur.

      <template v-slot:modal-footer="{ ok, cancel, hide }">
        <b-button size="sm" variant="secondary" @click="showModal = false">
          Skip
        </b-button>
        <b-button
          size="sm"
          variant="primary"
          @click="
            () => {
              startWalkthrough();
              showModal = false;
            }
          "
        >
          Explore
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
// import moment from "moment";

export default {
  data() {
    return {
      showModal: false,
      navItems: [
        { name: "Home", route: "/#/home", icon: "home" },
        { name: "Dashboard", route: "/#/dashboard/safety", icon: "chart-line" },
        { name: "Global Plan", route: "/#/global-plan", icon: "calendar" },
        {
          name: "Observation",
          route: "/#/observation-list",
          icon: "file",
          childrens: [
            { name: "Observation List", route: "/#/observation-list" },
            { name: "Observation Form", route: "/#/observation-form" }
          ]
        },
        {
          name: "Report",
          route: "/#/report-list",
          icon: "archive",
          childrens: [
            { name: "Report List", route: "/#/report-list" },
            { name: "Recommendation", route: "/#/report-recommendation" }
          ]
        },
        {
          name: "Download",
          route: "/#/download-db",
          icon: "download",
          childrens: [
            { name: "MLOSA Database", route: "/#/download-db" },
            { name: "Mobile Apps", route: "/#/download-app" }
          ]
        }
      ],
      hints: [
        {
          name: "Overview",
          href: ""
        },
        {
          name: "Flow Process",
          href: ""
        },
        {
          name: "Risk Index",
          href: ""
        }
      ],
      notifs: [
        {
          name: "Observation",
          href: ""
        },
        {
          name: "Report",
          href: ""
        },
        {
          name: "Recommendation",
          href: ""
        }
      ]
    };
  },
  methods: {
    startWalkthrough() {
      this.$store.commit("changeWalkthrough", true);
      const introJS = require("intro.js");
      introJS
        .introJs()
        .setOption("doneLabel", "Next page")
        .start()
        .oncomplete(function() {
          window.location.href = "/#/project-customer/a";
        });
    },
    logout() {
      axios
        .get("/logout")
        .then(() => {
          localStorage.removeItem("role");
          this.$store.dispatch("goToPage", "/login");
        })
        .catch(() => {});
    }
  },
  computed: {
    activeRoutes() {
      return this.$route.name || "";
    }
  }
};
</script>

<style scoped>
.logo-name {
  font-weight: bold;
  font-size: 28px;
}
.navbar {
  background-color: #022f46;
}
.logo-img {
  height: 40px;
}
.navbar-item {
  /*margin-right: 4px;*/
}
.navbar-item a {
  color: rgba(255, 255, 255, 0.6) !important;
}
.navbar-item:hover a {
  color: white !important;
}
.navbar-item-active,
.navbar-item-active a {
  color: white !important;
}
.navbar-img {
  height: 25px;
  margin-right: 5px;
}
.navbar-img-expand {
  height: 40px;
  margin: 0 auto;
  display: block;
}
.user-navbar {
  margin-right: 10px;
}

.info-event {
  overflow-y: auto;
  height: 250px;
}
</style>

<style>
.b-nav-dropdown a {
  color: rgba(255, 255, 255, 0.6) !important;
}
.b-nav-dropdown ul li a {
  color: black !important;
}
.navbar-dropdown-item-active a {
  color: white !important;
}
.no-icon-dropdown a::after {
  display: none !important;
}
@media (max-width: 1024px) and (min-width: 701px) {
  .nav-item {
    font-size: 10px;
  }
}
@media (max-width: 700px) {
  .navbar-nav .dropdown-menu {
    width: 70vw;
  }
  .nav-search input {
    margin: 7px 0;
  }
}
.dropdown-menu {
  padding: 0 !important;
}
</style>
