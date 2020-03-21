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
      type="pie"
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
import { getMaintenancesName, getYearOptions } from "@/utility/func.js";
import queryString from "query-string";

export default {
  props: ["halfSize"],
  mounted() {
    getMaintenancesName().then(res => {
      this.maintenanceOptions = this.maintenanceOptions.concat(res);
    });
    getYearOptions().then(res => {
      this.yearOptions = this.yearOptions.concat(res);
    });

    this.getChart();
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
        .get(`/chart/breakdown?${queryParams}`)
        .then(res => {
          const data = res.data.data;
          this.chartOptions = {
            ...this.chartOptions,
            labels: data.map(d => d.sub_threat),
            title: {
              ...this.chartOptions.title,
              text: res.data.threat
            }
          };
          this.series = data.map(d => d.total);
        })
        .catch(() => {});
    },
    goToDetail() {
      const query = queryString.stringify(this.selectVal);
      this.$store.dispatch(
        "goToPage",
        `/dashboard-detail?${query}&c=equipment`
      );
    }
  },
  data() {
    return {
      selectVal: {
        year: null,
        start_month: null,
        end_month: null,
        maintenance_process: null
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
      series: [],
      chartOptions: {
        title: {
          text: "",
          align: "center",
          margin: 10,
          style: {
            fontSize: "16px",
            fontWeight: "700"
          }
        },
        noData: {
          text: "No Data",
          verticalAlign: "top"
        },
        labels: [],
        legend: {
          position: "bottom"
        },
        responsive: [
          {
            breakpoint: 480,
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

<style scoped></style>
