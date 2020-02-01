<template>
  <div class="container-app">
    <h3 class="header-title mb-3">DASHBOARD</h3>
    <b-row>
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>Start</label>
        <b-form-select
          v-model="selectVal.start_month"
          :options="startOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>End</label>
        <b-form-select
          v-model="selectVal.end_month"
          :options="endOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label>
        <b-form-select
          v-model="selectVal.maintenance_process"
          :options="maintenanceOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Safety Risk</label>
        <b-form-select
          v-model="selectVal.safety_risk"
          :options="riskOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Threat Code</label>
        <b-form-select
          v-model="selectVal.threat"
          :options="codeOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Risk Value</label>
        <b-form-select
          v-model="selectVal.threat"
          :options="codeOptions"
          @input="getObservations"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>Back</label
        ><b-button variant="primary" @click="back">Chart</b-button>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="observations"
      :fields="observationFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      show-empty
    >
      <template v-slot:cell(no)="data">
        {{ data.index + 1 }}
      </template>
      <template v-slot:cell(start_time)="data">
        {{ data.value.substring(0, data.value.length - 3) }}
      </template>
      <template v-slot:cell(end_time)="data">
        {{ data.value.substring(0, data.value.length - 3) }}
      </template>
      <template v-slot:cell(users)="data">
        {{ data.value.map(d => d.fullname).join(", ") }}
      </template></b-table
    >

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    />
  </div>
</template>

<script>
import axios from "axios";
import { months, safetyRisk } from "@/utility/variable.js";
import {
  getMaintenancesName,
  getYearOptions,
  getThreatCodes
} from "@/utility/func.js";
import queryString from "query-string";

export default {
  mounted() {
    getMaintenancesName().then(res => {
      this.maintenanceOptions = this.maintenanceOptions.concat(res);
    });
    getYearOptions().then(res => {
      this.yearOptions = this.yearOptions.concat(res);
    });
    getThreatCodes().then(res => {
      this.codeOptions = this.codeOptions.concat(res);
    });
    this.selectVal = { ...this.selectVal, ...this.$route.query };
    delete this.selectVal.c;
    this.getObservations();
  },
  methods: {
    getObservations() {
      let queryParams = "";
      for (let key in this.selectVal) {
        if (this.selectVal[key]) {
          queryParams += `${key}=${this.selectVal[key]}&`;
        }
      }
      axios
        .get(`/observation?${queryParams}`)
        .then(res => {
          this.observations = res.data.data.map(d => {
            let action;
            if (d.status === "Open") action = "Follow Up";
            else action = "View";
            return { ...d, action };
          });
        })
        .catch(() => {});
    },
    back() {
      const query = queryString.stringify(this.selectVal);
      this.$store.dispatch(
        "goToPage",
        `/dashboard/${this.$route.query.c}?${query}`
      );
    }
  },
  data() {
    return {
      selectVal: {
        year: null,
        start_month: null,
        end_month: null,
        maintenance_process: null,
        safety_risk: null,
        threat: null
      },
      observations: [],
      observationFields: [
        { key: "no" },
        { key: "observation_no", label: "Observation No", sortable: true },
        { key: "observation_date", label: "Date", sortable: true },
        { key: "start_time", sortable: true },
        { key: "end_time", sortable: true },
        { key: "component_type", sortable: true },
        { key: "task_observed", sortable: true },
        {
          key: "maintenance.name",
          label: "Maintenance",
          sortable: true
        },
        { key: "users", label: "Observer Team", sortable: true },
        { key: "location", sortable: true },
        { key: "uic.uic_code", label: "UIC", sortable: true },
        { key: "subtitle", label: "Subtitle", sortable: true },
        { key: "due_date", label: "Due Date", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "comment", sortable: true }
      ],
      perPage: "10",
      currentPage: 1,
      yearOptions: [
        {
          value: null,
          text: "All Years"
        }
      ],
      startOptions: [
        {
          value: null,
          text: "All Start Month"
        },
        ...months
      ],
      endOptions: [
        {
          value: null,
          text: "All End Month"
        },
        ...months
      ],
      maintenanceOptions: [
        {
          value: null,
          text: "All Maintenance Process"
        }
      ],
      riskOptions: [
        {
          value: null,
          text: "All Safety Risks"
        },
        ...safetyRisk.slice(1)
      ],
      codeOptions: [
        {
          value: null,
          text: "All Threat Codes"
        }
      ]
    };
  },
  computed: {
    rows() {
      return this.observations.length;
    }
  }
};
</script>

<style scoped></style>
