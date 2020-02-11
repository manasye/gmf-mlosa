<template>
  <div>
    <b-row>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" :md="this.halfSize ? 4 : 2" class="mb-3"
        ><label>Start Month</label>
        <b-form-select
          v-model="selectVal.start_month"
          :options="startOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" :md="this.halfSize ? 4 : 2" class="mb-3"
        ><label>End Month</label>
        <b-form-select
          v-model="selectVal.end_month"
          :options="endOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" :md="this.halfSize ? 4 : 2" class="mb-3"
        ><label>Maintenance Process</label>
        <b-form-select
          v-model="selectVal.maintenance_process"
          :options="maintenanceOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" :md="this.halfSize ? 4 : 2" class="mb-3"
        ><label>Threat Code</label>
        <b-form-select
          v-model="selectVal.threat"
          :options="codeOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col
        cols="12"
        :md="this.halfSize ? 2 : 1"
        class="mb-3 d-flex justify-content-end"
        ><b-button variant="primary" @click="getChart" class="align-self-end"
          >Filter</b-button
        ></b-col
      >
    </b-row>

    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
      class="mt-4"
    />

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
import {
  getMaintenancesName,
  getYearOptions,
  getThreatCodes
} from "@/utility/func.js";
import queryString from "query-string";

export default {
  props: ["halfSize"],
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
        .get(`/chart/threat?${queryParams}`)
        .then(res => {
          const data = res.data;
          let series = this.maintenanceOptions.slice(1).map(m => {
            return { name: m.text, data: [] };
          });
          for (let t in data) {
            for (let m in data[t]) {
              let find = series.findIndex(s => s.name === m);
              series[find].data.push(data[t][m]);
            }
          }
          this.chartOptions = {
            ...this.chartOptions,
            xaxis: {
              ...this.chartOptions.xaxis,
              categories: Object.keys(data)
            }
          };
          this.series = series;
        })
        .catch(() => {});
    },
    goToDetail() {
      const query = queryString.stringify(this.selectVal);
      this.$store.dispatch("goToPage", `/dashboard-detail?${query}&c=threat`);
    }
  },
  data() {
    return {
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
      ],
      chartOptions: {
        noData: {
          text: "No Data",
          verticalAlign: "top"
        },
        chart: {
          stacked: true,
          width: "100%"
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        title: {
          text: "Number of Threat in Maintenance Process",
          align: "center",
          margin: 0,
          style: {
            fontSize: "16px",
            fontWeight: "700"
          }
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: undefined
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: "bottom",
          horizontalAlign: "left",
          offsetX: 40
        }
      },
      series: []
    };
  }
};
</script>

<style scoped></style>
