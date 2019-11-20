<template>
  <div>
    <b-row>
      <b-col cols="12" md="2" class="mb-3"
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
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label
        ><b-form-select
          v-model="selectVal.maintenance"
          :options="maintenanceOptions"
        ></b-form-select
      ></b-col>
    </b-row>

    <apexchart
      type="pie"
      height="350"
      :options="chartOptions"
      :series="series"
      class="mt-4"
    />

    <div class="text-right">
      <b-button variant="primary" size="sm">View Details</b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectVal: {
        year: null,
        start: null,
        end: null,
        maintenance: null,
        code: null
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
      codeOptions: [
        {
          value: null,
          text: "All Threat Codes"
        }
      ],
      series: [44, 55, 13, 43, 22],
      chartOptions: {
        labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
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

<style scoped></style>
