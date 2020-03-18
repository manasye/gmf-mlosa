<template>
  <div class="container-app">
    <h3 class="header-title mb-3">DASHBOARD</h3>
    <b-tabs content-class="mt-3">
      <b-tab
        :title="tab.title"
        :active="tab.route === tabActive"
        v-for="tab in tabs"
        :key="tab.title"
        @click="$store.dispatch('goToPage', `/dashboard/${tab.route}`)"
        lazy
      >
        <component :is="tab.component" :id="$route.params.id" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Safety from "@/components/Dashboard/Safety";
import Threat from "@/components/Dashboard/Threat";
import Pareto from "@/components/Dashboard/Pareto";
import Breakdown from "@/components/Dashboard/Breakdown";
import Risk from "@/components/Dashboard/Risk";

export default {
  mounted() {
    this.tabActive = this.$route.params.type;
  },
  data() {
    return {
      tabs: [
        {
          title: "Safety / At Risk Distribution",
          route: "safety",
          component: Safety
        },
        { title: "Number of Threat", route: "threat", component: Threat },
        { title: "Pareto Diagram", route: "pareto", component: Pareto },
        {
          title: "Threat Breakdown",
          route: "breakdown",
          component: Breakdown
        },
        { title: "Risk Register", route: "risk", component: Risk }
      ],
      tabActive: "safety"
    };
  }
};
</script>

<style scoped />
