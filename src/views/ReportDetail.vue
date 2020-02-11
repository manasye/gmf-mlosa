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
      <b-col cols="12" md="6">
        <b-row class="detail-report pt-2">
          <b-col cols="12" md="6">
            <p class="mb-2" v-for="l in left">
              {{ l.text }} : {{ report[l.key] }}
            </p>
          </b-col>
          <b-col cols="12" md="6">
            <p class="mb-2" v-for="r in right">
              {{ r.text }} : {{ report[r.key] }}
            </p></b-col
          >
          <b-col cols="12">
            <label class="mt-3">I. Introduction</label>
            <div v-html="report.introduction"></div>
            <label class="mt-3">II. Brief Summary</label>
            <div v-html="report.brief_summary"></div>
            <label class="mt-3">III. Section Summaries</label><br />
            <label>III.1 MLOSA Demographic</label>
            <div>
              <safety :halfSize="true"></safety>
              <threat :halfSize="true"></threat>
              <pareto :halfSize="true"></pareto>
              <equipment :halfSize="true"></equipment>
              <risk :halfSize="true"></risk>
            </div>
            <label class="mt-3">III.2 Regression Analysis</label>
            <div v-html="report.regression_analysis"></div>
            <label class="mt-3">III.3 Threat and Error Management Result</label>
            <div v-html="report.threat_error"></div>
            <label class="mt-3">IV. Recommendation</label>
            <div v-for="r in report.recommendation" class="mb-3">
              <p class="mb-1">{{ r.uic.join(", ") }}</p>
              <div v-html="r.recommendation"></div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import RecomCard from "@/components/RecomCard.vue";
import Safety from "@/components/Dashboard/Safety.vue";
import Threat from "@/components/Dashboard/Threat.vue";
import Pareto from "@/components/Dashboard/Pareto.vue";
import Equipment from "@/components/Dashboard/Equipment.vue";
import Risk from "@/components/Dashboard/Risk.vue";

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
      report: {},
      left: [
        { text: "Title", key: "title" },
        { text: "Subject", key: "subject" },
        { text: "Distribution", key: "title" },
        { text: "No", key: "report_no" },
        { text: "Date", key: "date" }
      ],
      right: [
        { text: "Attention", key: "attention" },
        { text: "Issued", key: "issued" },
        { text: "Prepared By", key: "prepared_by" },
        { text: "Checked By", key: "checked_by" },
        { text: "Approved By", key: "approved_by" }
      ]
    };
  },
  components: {
    RecomCard,
    Safety,
    Threat,
    Pareto,
    Equipment,
    Risk
  }
};
</script>

<style scoped>
.detail-report {
  border: 1px solid #949699;
}
</style>
