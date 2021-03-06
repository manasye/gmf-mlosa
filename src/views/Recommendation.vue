<template>
  <div class="container-app">
    <h3 class="header-title">
      RECOMMENDATION LIST
    </h3>

    <b-row class="mt-3">
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getRecommendations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Month</label>
        <b-form-select
          v-model="selectVal.month"
          :options="monthOptions"
          @input="getRecommendations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>UIC</label>
        <b-form-select
          v-model="selectVal.uic_code"
          :options="uicOptions"
          @input="getRecommendations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Follow Up Status</label>
        <b-form-select
          v-model="selectVal.status"
          :options="followUpOptions"
          @input="getRecommendations"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3 d-flex justify-content-end"
        ><b-button
          variant="primary"
          @click="getRecommendations"
          class="align-self-end"
          >Filter</b-button
        ></b-col
      >
      <b-col cols="12" md="1" />
      <b-col cols="12" md="1" class="mb-3"
        ><label>Per Page</label>
        <b-form-select v-model="perPage" :options="perPageOptions" />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Search</label>
        <b-nav-form @submit.prevent="getRecommendations">
          <b-form-input
            v-model="searchQuery"
            placeholder="Search..."
            style="width: 100%"
            @keyup="getRecommendations"
          />
        </b-nav-form>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="recomFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showReport"
      show-empty
    >
      <template v-slot:cell(status)="data">
        <b-badge
          :variant="getBadgesVariant(data.value)"
          style="margin-right: 30px"
        >
          <p class="status-badges" :class="getBadgesVariant(data.value)">
            {{ data.value }}
          </p>
        </b-badge>
      </template>
    </b-table>
  </div>
</template>

<script>
import {
  perPageOptions,
  statusObservation,
  months
} from "@/utility/variable.js";
import { getUics } from "@/utility/func.js";
import axios from "axios";

export default {
  mounted() {
    getUics().then(res => {
      this.uicOptions = this.uicOptions.concat(res);
    });
    axios
      .get("/recommendation/filter/filteroption")
      .then(res => {
        let years = res.data.year.map(y => {
          return { value: y, text: y };
        });
        this.yearOptions = this.yearOptions.concat(years);
      })
      .catch(() => {});
    this.getRecommendations();
  },
  methods: {
    getRecommendations() {
      let queryParams = "";
      for (let key in this.selectVal) {
        if (this.selectVal[key]) {
          queryParams += `${key}=${this.selectVal[key]}&`;
        }
      }
      if (this.searchQuery) {
        queryParams += `search=${this.searchQuery}`;
      }
      axios
        .get(`/recommendation/filter/filterrecommendation?${queryParams}`)
        .then(res => {
          this.recoms = res.data.data;
        })
        .catch(() => {});
    },
    showReport(row) {
      this.$store.dispatch(
        "goToPage",
        `/report/${row.report_id}?recom_id=${row.id}`
      );
    },
    getBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "On Progress") return "warning";
      else if (val === "Close") return "success";
      else if (val === "Verified") return "info";
      else return "danger";
    }
  },
  data() {
    return {
      selectVal: {
        year: null,
        month: null,
        uic_code: null,
        status: null
      },
      yearOptions: [
        {
          value: null,
          text: "All Years"
        }
      ],
      monthOptions: [
        {
          value: null,
          text: "All Months"
        },
        ...months
      ],
      followUpOptions: [
        {
          value: null,
          text: "All Status"
        },
        ...statusObservation
      ],
      uicOptions: [
        {
          value: null,
          text: "All UICs"
        }
      ],
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      searchQuery: null,
      recomFields: [
        { key: "date", label: "Date", sortable: true },
        { key: "report_no", sortable: true },
        { key: "recommendation", sortable: true },
        { key: "uic_code", label: "UIC", sortable: true },
        { key: "status", sortable: true }
      ],
      recoms: []
    };
  },
  computed: {
    rows() {
      return this.recoms.length;
    },
    filteredItems() {
      return this.recoms.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep =
            keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.recoms[0]);
    }
  }
};
</script>

<style scoped></style>
