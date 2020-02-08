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
        ><label>Threat Code</label>
        <b-form-select
          v-model="selectVal.threat"
          :options="codeOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Risk Value</label>
        <b-form-select
          v-model="selectVal.risk_value"
          :options="riskOptions"
          @input="getChart"
        ></b-form-select>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" md="6">
        <apexchart
          type="bar"
          height="350"
          :options="register1.chartOptions"
          :series="register1.series"
          class="mt-4"
        />
        <p>Average Risk Value :</p>
        <div class="text-right">
          <b-button variant="primary" size="sm" @click="goToDetail"
            >View Details</b-button
          >
        </div>
      </b-col>
      <b-col cols="12" md="6">
        <apexchart
          type="bar"
          height="350"
          :options="register2.chartOptions"
          :series="register2.series"
          class="mt-4"
        />
        <p>Average Risk Value :</p>
        <div class="text-right">
          <b-button variant="primary" size="sm" @click="goToDetail"
            >View Details</b-button
          >
        </div>
      </b-col>
    </b-row>

    <apexchart
      type="bar"
      height="350"
      :options="dimension.chartOptions"
      :series="dimension.series"
      class="mt-5"
    />

    <apexchart
      type="bar"
      height="350"
      :options="value.chartOptions"
      :series="value.series"
      class="mt-4"
    />

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="riskValueTables"
      responsive
      show-empty
    ></b-table>

    <div class="text-right">
      <b-button variant="primary" size="sm" @click="goToDetail"
        >View Details</b-button
      >
    </div>

    <apexchart
      type="bar"
      height="350"
      :options="threat.chartOptions"
      :series="threat.series"
      class="mt-4"
    />

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="threatTables"
      responsive
      show-empty
    ></b-table>

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
        .get(`/chart/risk_register?${queryParams}`)
        .then(res => {
          this.register1 = {
            ...this.register1,
            chartOptions: {
              ...this.register1.chartOptions,
              xaxis: {
                ...this.register1.chartOptions.xaxis,
                categories: res.data.corporate_current_risk.map(
                  c => c.risk_value + " " + c.category
                )
              }
            }
          };
          this.register1 = {
            ...this.register1,
            series: [
              { data: res.data.corporate_current_risk.map(c => c.count) }
            ]
          };

          const dimension = res.data.risk_dimension_distribution;
          this.dimension = {
            ...this.dimension,
            chartOptions: {
              ...this.dimension.chartOptions,
              xaxis: {
                ...this.dimension.chartOptions.xaxis,
                categories: Object.keys(dimension)
              }
            }
          };
          this.dimension = {
            ...this.dimension,
            series: [{ data: Object.values(dimension) }]
          };

          const value = res.data.risk_value_dist;
          this.value = {
            ...this.value,
            chartOptions: {
              ...this.value.chartOptions,
              xaxis: {
                ...this.value.chartOptions.xaxis,
                categories: Object.keys(value)
              }
            }
          };
          let valueSeries = [[], [], [], [], []];
          let riskTables = [
            { risk: "Negligible" },
            { risk: "Low Risk" },
            { risk: "Medium Risk" },
            { risk: "High Risk" },
            { risk: "Extreme Risk" }
          ];
          for (let key in value) {
            for (let risk in value[key]) {
              if (risk === "Negligible") {
                valueSeries[0].push(value[key][risk]);
                riskTables[0] = {
                  ...riskTables[0],
                  [key]: value[key][risk]
                };
              }
              if (risk.includes("Low")) {
                valueSeries[1].push(value[key][risk]);
                riskTables[1] = {
                  ...riskTables[1],
                  [key]: value[key][risk]
                };
              }
              if (risk.includes("Medium")) {
                valueSeries[2].push(value[key][risk]);
                riskTables[2] = {
                  ...riskTables[2],
                  [key]: value[key][risk]
                };
              }
              if (risk.includes("High")) {
                valueSeries[3].push(value[key][risk]);
                riskTables[3] = {
                  ...riskTables[3],
                  [key]: value[key][risk]
                };
              }
              if (risk.includes("Extreme")) {
                valueSeries[4].push(value[key][risk]);
                riskTables[4] = {
                  ...riskTables[4],
                  [key]: value[key][risk]
                };
              }
            }
          }
          this.riskValueTables = riskTables;
          this.value = {
            ...this.value,
            series: [
              {
                name: "Negligible",
                data: valueSeries[0]
              },
              {
                name: "Low Risk",
                data: valueSeries[1]
              },
              {
                name: "Medium Risk",
                data: valueSeries[2]
              },
              {
                name: "High Risk",
                data: valueSeries[3]
              },
              {
                name: "Extreme Risk",
                data: valueSeries[4]
              }
            ]
          };

          const threat = res.data.theat_subject;
          this.threat = {
            ...this.threat,
            chartOptions: {
              ...this.threat.chartOptions,
              xaxis: {
                ...this.threat.chartOptions.xaxis,
                categories: Object.keys(threat)
              }
            }
          };
          let threatSeries = [[], [], [], [], []];
          let threatTables = [
            { risk: "Negligible" },
            { risk: "Low Risk" },
            { risk: "Medium Risk" },
            { risk: "High Risk" },
            { risk: "Extreme Risk" }
          ];
          for (let key in threat) {
            for (let risk in threat[key]) {
              if (risk === "Negligible") {
                threatSeries[0].push(threat[key][risk]);
                threatTables[0] = {
                  ...threatTables[0],
                  [key]: threat[key][risk]
                };
              }
              if (risk.includes("Low")) {
                threatSeries[1].push(threat[key][risk]);
                threatTables[1] = {
                  ...threatTables[1],
                  [key]: threat[key][risk]
                };
              }
              if (risk.includes("Medium")) {
                threatSeries[2].push(threat[key][risk]);
                threatTables[2] = {
                  ...threatTables[2],
                  [key]: threat[key][risk]
                };
              }
              if (risk.includes("High")) {
                threatSeries[3].push(threat[key][risk]);
                threatTables[3] = {
                  ...threatTables[3],
                  [key]: threat[key][risk]
                };
              }
              if (risk.includes("Extreme")) {
                threatSeries[4].push(threat[key][risk]);
                threatTables[4] = {
                  ...threatTables[4],
                  [key]: threat[key][risk]
                };
              }
            }
          }
          this.threatTables = threatTables;
          this.threat = {
            ...this.threat,
            series: [
              {
                name: "Negligible",
                data: threatSeries[0]
              },
              {
                name: "Low Risk",
                data: threatSeries[1]
              },
              {
                name: "Medium Risk",
                data: threatSeries[2]
              },
              {
                name: "High Risk",
                data: threatSeries[3]
              },
              {
                name: "Extreme Risk",
                data: threatSeries[4]
              }
            ]
          };
        })
        .catch(() => {});
    },
    goToDetail() {
      const query = queryString.stringify(this.selectVal);
      this.$store.dispatch("goToPage", `/dashboard-detail?${query}&c=risk`);
    }
  },
  data() {
    return {
      selectVal: {
        year: null,
        start_month: null,
        end_month: null,
        maintenance_process: null,
        threat: null,
        risk_value: null
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
      riskOptions: [
        {
          value: null,
          text: "All Risks Values"
        }
      ],
      riskValueTables: [],
      threatTables: [],
      register1: {
        chartOptions: {
          noData: {
            text: "No Data",
            verticalAlign: "top"
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          title: {
            text: "Corporate Current Risk Severity Distribution",
            align: "center",
            margin: 0
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: []
          }
        },
        series: [
          {
            data: []
          }
        ]
      },
      register2: {
        chartOptions: {
          noData: {
            text: "No Data",
            verticalAlign: "top"
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          title: {
            text: "Corporate Proposed Risk Severity Distribution",
            align: "center",
            margin: 0
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: []
          }
        },
        series: [
          {
            data: []
          }
        ]
      },
      dimension: {
        chartOptions: {
          noData: {
            text: "No Data",
            verticalAlign: "top"
          },
          chart: {
            height: 350,
            type: "bar"
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "top" // top, center, bottom
              }
            }
          },
          xaxis: {
            categories: [],
            position: "bottom"
          },
          fill: {
            gradient: {
              shade: "light",
              type: "horizontal",
              shadeIntensity: 0.25,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [50, 0, 100, 100]
            }
          },
          title: {
            text: "Risk Dimension Distribution",
            align: "center"
          }
        },
        series: [
          {
            data: []
          }
        ]
      },
      value: {
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
            text: "Risk Value Distribution for each Risk Dimension",
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
      },
      threat: {
        chartOptions: {
          noData: {
            text: "No Data",
            verticalAlign: "top"
          },
          chart: {
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          title: {
            text: "Threat Subject (Impact To) for Each Department",
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
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        },
        series: []
      }
    };
  }
};
</script>

<style scoped></style>
