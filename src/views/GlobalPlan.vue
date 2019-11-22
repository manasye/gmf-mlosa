<template>
  <div class="container-app">
    <h3 class="header-title">GLOBAL MLOSA PLAN</h3>

    <b-row class="mt-3">
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label
        ><b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Start Month</label
        ><b-form-select
          v-model="selectVal.start"
          :options="startOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>End Month</label
        ><b-form-select
          v-model="selectVal.end"
          :options="endOptions"
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="1" class="mb-3"
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
        ></b-form-select
      ></b-col>
      <b-col cols="12" md="2" class="mb-3 d-flex justify-content-end">
        <b-button
          variant="primary"
          class="align-self-end"
          @click="showModal = true"
          >New MLOSA Plan</b-button
        >
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" md="8" class="calendar-wrapper mt-3 mb-2">
        <b-row>
          <b-col cols="12" md="4" v-for="i in 12" class="mb-4" :key="i">
            <datepicker
              :inline="true"
              class="mb-4 mb-md-0  calendar"
              :minimumView="'day'"
              :maximumView="'day'"
              :open-date="new Date(new Date().getFullYear(), i - 1, 16)"
            ></datepicker
          ></b-col>
        </b-row>
      </b-col>

      <b-col cols="12" md="4" class="mt-3">
        <apexchart
          type="pie"
          height="350"
          :options="chartOptions"
          :series="series"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
import Datepicker from "vuejs-datepicker";

export default {
  components: { Datepicker },
  data() {
    return {
      date: new Date(2016, 9, 16),
      showModal: false,
      selectVal: {
        year: null,
        start: null,
        end: null,
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
      startOptions: [
        {
          value: null,
          text: "All Start Month"
        }
      ],
      endOptions: [
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
      series: [44, 55, 13, 43, 22],
      chartOptions: {
        labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
        responsive: [
          {
            breakpoint: 2000,
            options: {
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
.calendar-wrapper {
  height: 60vh;
  overflow-y: scroll;
}
</style>
