<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title text-uppercase">REPORT {{ title }}</h3>
    <b-row class="mt-3">
      <b-col cols="12" md="6">
        <recom-card
          v-for="r in report.recommendation"
          :recom="r"
          :key="r.id"
          :getDetail="getDetail"
        ></recom-card>
      </b-col>
      <b-col cols="12" md="6"></b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import RecomCard from "@/components/RecomCard.vue";

export default {
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      axios
        .get(`/report/${this.$route.params.id}`)
        .then(res => {
          this.title = res.data.data.report_no;
          this.breadcrumbs[1].text = res.data.data.report_no;
          this.report = res.data.data;
        })
        .catch(() => {});
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Report List",
          href: "/#/report-list"
        },
        {
          text: "Loading...",
          active: true
        }
      ],
      title: "Loading...",
      report: {}
    };
  },
  components: {
    RecomCard
  }
};
</script>

<style scoped></style>
