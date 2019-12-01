<template>
  <div class="container-app">
    <b-row>
      <b-col cols="12" md="6">
        <h3 class="header-title">OBSERVATION LIST</h3></b-col
      >
      <b-col cols="12" md="6" class="text-right">
        <b-button variant="primary">New Observation</b-button></b-col
      >
    </b-row>

    <b-row class="mt-3">
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label
        ><b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Month</label
        ><b-form-select
          v-model="selectVal.month"
          :options="monthOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>UIC</label
        ><b-form-select
          v-model="selectVal.uic"
          :options="uicOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label
        ><b-form-select
          v-model="selectVal.maintenance"
          :options="maintenanceOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Status</label
        ><b-form-select
          v-model="selectVal.status"
          :options="statusOptions"
        ></b-form-select></b-col
      ><b-col cols="12" md="1" class="mb-3"
        ><label>Per Page</label
        ><b-form-select
          v-model="perPage"
          :options="perPageOptions"
        ></b-form-select></b-col
      ><b-col cols="12" md="2" class="mb-3"
        ><label>Search</label>
        <b-nav-form>
          <b-form-input
            v-model="searchQuery"
            placeholder="Search..."
            style="width: 100%"
          ></b-form-input> </b-nav-form></b-col
    ></b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="observationFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showObservation"
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
        </b-badge></template
      >
      <template v-slot:cell(action)="data">
        <p class="text-primary mb-0 " style="cursor: pointer">
          {{ data.value }}
        </p>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    ></b-pagination>
  </div>
</template>

<script>
import { perPageOptions } from "@/utility/variable.js";

export default {
  data() {
    return {
      selectVal: {
        year: null,
        month: null,
        maintenance: null,
        uic: null,
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
          text: "All End Month"
        }
      ],
      maintenanceOptions: [
        {
          value: null,
          text: "All Maintenance Process"
        }
      ],
      statusOptions: [
        {
          value: null,
          text: "All Status"
        }
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
      searchQuery: "",
      observationFields: [
        { key: "date", label: "Date", sortable: true },
        { key: "observation_id", label: "Observation ID", sortable: true },
        { key: "uic", label: "UIC", sortable: true },
        { key: "subtitle", label: "Subtitle", sortable: true },
        { key: "due_date", label: "Due Date", sortable: true },
        {
          key: "maintenance_process",
          label: "Maintenance Process",
          sortable: true
        },
        { key: "status", label: "Status", sortable: true },
        { key: "action", label: "Action", sortable: true }
      ],
      observations: [
        { observation_id: "X", status: "Open", action: "Follow Up" }
      ]
    };
  },
  computed: {
    rows() {
      return this.observations.length;
    },
    filteredItems() {
      return this.observations.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep =
            keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.observations[0]);
    }
  },
  methods: {
    showObservation(row) {
      this.$store.dispatch("goToPage", `/observation/${row.observation_id}`);
    },
    getBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "Onprogress") return "warning";
      else if (val === "Close") return "success";
      else return "danger";
    }
  }
};
</script>

<style scoped></style>
