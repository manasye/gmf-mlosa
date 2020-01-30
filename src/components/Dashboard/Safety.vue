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
      <b-col cols="12" md="2" class="mb-3"
        ><label>Start Month</label>
        <b-form-select
          v-model="selectVal.start_month"
          :options="startOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>End Month</label>
        <b-form-select
          v-model="selectVal.end_month"
          :options="endOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label>
        <b-form-select
          v-model="selectVal.maintenance_process"
          :options="maintenanceOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Safety Risk</label>
        <b-form-select
          v-model="selectVal.safety_risk"
          :options="riskOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
    </b-row>

    <apexchart
      type="bar"
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
import { months, safetyRisk } from "@/utility/variable.js";
import { getMaintenancesName, getYearOptions } from "@/utility/func.js";

export default {
  mounted() {
    getMaintenancesName().then(res => {
      this.maintenanceOptions = this.maintenanceOptions.concat(res);
    });
    getYearOptions().then(res => {
      this.yearOptions = this.yearOptions.concat(res);
    });

    this.getChart();
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
        .get(`/chart/safety?${queryParams}`)
        .then(res => {
          let series = this.riskOptions.slice(1).map(m => {
            return { name: m.text, data: [] };
          });
          const data = res.data;
          for (let m in data) {
            if (data[m].S) {
              series[0].data.push(data[m].S);
            }
            if (data[m].AR) {
              series[1].data.push(data[m].AR);
            }
            if (data[m].DNO) {
              series[2].data.push(data[m].DNO);
            }
            if (data[m]["N/A"]) {
              series[3].data.push(data[m]["N/A"]);
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
    }
  },
  data() {
    return {
      selectVal: {
        year: null,
        start_month: null,
        end_month: null,
        maintenance_process: null,
        safety_risk: null
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
      riskOptions: [
        {
          value: null,
          text: "All Safety Risks"
        },
        ...safetyRisk.slice(1)
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
          text: "Safety / At Risk Distribution in Maintenance Process",
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
