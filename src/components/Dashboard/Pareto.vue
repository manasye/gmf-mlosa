<template>
  <div>
    <b-row>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getChart"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Start Month</label>
        <b-form-select
          v-model="selectVal.start_month"
          :options="startOptions"
          @input="getChart"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>End Month</label>
        <b-form-select
          v-model="selectVal.end_month"
          :options="endOptions"
          @input="getChart"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label>
        <b-form-select
          v-model="selectVal.maintenance_process"
          :options="maintenanceOptions"
          @input="getChart"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Threat Code</label>
        <b-form-select
          v-model="selectVal.threat"
          :options="codeOptions"
          @input="getChart"
        />
      </b-col>
    </b-row>

    <p class="text-center mt-3">Pareto Diagram of Threat Distribution</p>
    <bar-chart :chart-data="dataChart" :options="options"></bar-chart>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="pareto"
      :fields="paretoFields"
      :per-page="5"
      responsive
      show-empty
    >
      <template v-slot:cell(percentage)="data">{{ data.value }} %</template>
      <template v-slot:cell(cumulative)="data">{{ data.value }} %</template>
    </b-table>

    <div class="text-right">
      <b-button variant="primary" size="sm" @click="goToDetail"
        >View Details</b-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { months } from "@/utility/variable.js";
import BarChart from "@/components/BarChart.vue";
import {
  getMaintenancesName,
  getYearOptions,
  getThreatCodes
} from "@/utility/func.js";
import queryString from "query-string";

export default {
  components: {
    BarChart
  },
  mounted() {
    getMaintenancesName().then(res => {
      this.maintenanceOptions = this.maintenanceOptions.concat(res);
      this.getChart();
    });
    getYearOptions().then(res => {
      this.yearOptions = this.yearOptions.concat(res);
    });
    getThreatCodes().then(res => {
      this.codeOptions = this.codeOptions.concat(res);
    });
    this.selectVal = { ...this.selectVal, ...this.$route.query };
  },
  methods: {
    getChart() {
      let queryParams = "";
      for (let key in this.selectVal) {
        if (this.selectVal[key]) {
          queryParams += `${key}=${this.selectVal[key]}&`;
        }
      }
      axios
        .get(`/chart/pareto?${queryParams}`)
        .then(res => {
          const data = res.data;
          this.dataChart = {
            ...this.dataChart,
            labels: data.map(d => d.maintenance_process),
            datasets: [
              {
                type: "line",
                label: "Cumulative",
                borderColor: "#A9A9A9",
                backgroundColor: "#A9A9A9",
                pointBorderWidth: 5,
                fill: false,
                data: data.map(d => d.cumulative),
                yAxisID: "y-axis-2"
              },
              {
                type: "bar",
                label: "Percentage",
                borderColor: "#FC7E58",
                backgroundColor: "#FC7E58",
                data: data.map(d => (d.percentage * d.total) / 100),
                yAxisID: "y-axis-1"
              },
              {
                type: "bar",
                label: "Total",
                borderColor: "#4BAFEB",
                backgroundColor: "#4BAFEB",
                data: data.map(d => d.total),
                yAxisID: "y-axis-1"
              }
            ]
          };
          this.pareto = data;
        })
        .catch(() => {});
    },
    goToDetail() {
      const query = queryString.stringify(this.selectVal);
      this.$store.dispatch("goToPage", `/dashboard-detail?${query}&c=pareto`);
    }
  },
  data() {
    return {
      pareto: [],
      paretoFields: [
        "maintenance_process",
        "total",
        "percentage",
        "cumulative"
      ],
      dataChart: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              type: "linear",
              position: "left",
              id: "y-axis-1",
              stacked: true,
              ticks: {
                suggestedMin: 0
              }
            },
            {
              type: "linear",
              position: "right",
              id: "y-axis-2",
              ticks: {
                suggestedMin: 0,
                callback: function(value) {
                  return value + "%";
                }
              }
            }
          ]
        }
      },
      selectVal: {
        year: null,
        start_month: null,
        end_month: null,
        maintenance_process: null,
        threat: null
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
      codeOptions: [
        {
          value: null,
          text: "All Threat Codes"
        }
      ]
    };
  }
};
</script>

<style scoped />
