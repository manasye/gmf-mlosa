<template>
  <div class="container-app">
    <h3 class="header-title  text-uppercase">Dashboard</h3>
    <slick ref="slick" :options="slickOptions">
      <div class="chart-wrapper" v-for="(c, idx) in charts" :key="idx">
        <apexchart
          v-if="c.type !== 'pareto'"
          :type="c.type"
          height="350"
          :options="c.chartOptions"
          :series="c.series"
        />
        <p class="text-center" v-if="c.type === 'pareto'">
          Pareto Diagram of Threat Distribution
        </p>
        <bar-chart
          :chart-data="c.series"
          :options="c.chartOptions"
          v-if="c.type === 'pareto'"
        ></bar-chart>
      </div>
    </slick>
    <b-row class="mt-4">
      <b-col cols="12" md="6"
        ><h3 class="header-title mb-2 mb-md-4  text-uppercase">Mlosa Plan</h3>
        <b-row>
          <b-col cols="12" md="6">
            <v-calendar
              :attributes="attrs"
              :disable-page-swipe="true"
              @dayclick="changeSelectedDate"
              @update:frompage="changeMonth"
              @update:page="changeMonth"
            ></v-calendar>
          </b-col>
          <b-col cols="12" md="6" class="mb-4 mb-md-0">
            <card-calendar-info
              v-for="p in globalPlans[dateSelected]"
              :key="p.id"
              :due="p.due_date"
              :description="p.subtitle"
              :uic="p.uic ? p.uic : { uic_name: '' }"
              :status="p.status"
              v-if="globalPlans[dateSelected].length > 0"
              class="mb-3"
            />
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="12" md="6"
        ><h3 class="header-title mb-2 mb-md-4 text-uppercase">Observation</h3>
        <b-table
          style="margin-top: 20px;"
          striped
          hover
          :items="observations"
          :fields="observationFields"
          :per-page="5"
          :current-page="currentPage"
          responsive
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

        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="5"
          align="right"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Slick from "vue-slick";
import VueApexCharts from "vue-apexcharts";
import Datepicker from "vuejs-datepicker";
import CardCalendarInfo from "@/components/CardCalendarInfo";
import moment from "moment";
import axios from "axios";
import { safetyRisk } from "@/utility/variable.js";
import { getMaintenancesName } from "@/utility/func.js";
import BarChart from "@/components/BarChart.vue";

const d = new Date();
const monthNow = d.getMonth() + 1;

export default {
  name: "home",
  mounted() {
    getMaintenancesName().then(res => {
      this.maintenanceOptions = res;
      this.getThreatChart();
    });
    this.getGlobalPlan();
    this.getObservations();
    this.getCharts();
  },
  methods: {
    getCharts() {
      this.getSafetyChart();
      this.getParetoChart();
      this.getBreakdownChart();
      this.getRiskChart();
    },
    showObservation(row) {
      this.$store.dispatch("goToPage", `/observation/${row.id}`);
    },
    getBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "On Progress") return "warning";
      else if (val === "Close") return "success";
      else if (val === "Verified") return "info";
      else return "danger";
    },
    changeSelectedDate({ date }) {
      this.dateSelected = moment(date).format("YYYY-MM-DD");
    },
    changeMonth(page) {
      this.dateSelected = null;
    },
    getGlobalPlan() {
      axios
        .get(`/global_mlosa_plan`)
        .then(res => {
          this.globalPlans = res.data.data;
          const data = Object.keys(res.data.data);
          let labels = [
            {
              key: "Open",
              highlight: {
                class: "status-open"
              },
              dates: []
            },
            {
              key: "On Progress",
              highlight: {
                class: "status-onprogress"
              },
              dates: []
            },
            {
              key: "Close",
              highlight: {
                class: "status-close"
              },
              dates: []
            },
            {
              key: "Overdue",
              highlight: {
                class: "status-overdue"
              },
              dates: []
            }
          ];
          data.map(d => {
            if (d) {
              const year = d.split("-")[0];
              const month = d.split("-")[1];
              const date = d.split("-")[2];
              const status = this.globalPlans[d][0].status;
              if (status === "On Progress")
                labels[1].dates.push(new Date(year, month - 1, date));
              if (status === "Open")
                labels[0].dates.push(new Date(year, month - 1, date));
              if (status === "Close" || status === "Verified")
                labels[2].dates.push(new Date(year, month - 1, date));
              if (status === "Overdue")
                labels[3].dates.push(new Date(year, month - 1, date));
            }
          });
          this.attrs = labels;
        })
        .catch(() => {});
    },
    getObservations() {
      axios
        .get(`/observation?month=${monthNow}`)
        .then(res => {
          this.observations = res.data.data;
        })
        .catch(() => {});
    },
    getSafetyChart() {
      axios
        .get(`/chart/safety?start_month=${monthNow}&end_month=${monthNow}`)
        .then(res => {
          let series = safetyRisk.slice(1).map(m => {
            return { name: m.text, data: [] };
          });
          const data = res.data;
          for (let m in data) {
            series[0].data.push(data[m].S);
            series[1].data.push(data[m].AR);
            series[2].data.push(data[m].DNO);
            series[3].data.push(data[m]["N/A"]);
          }
          let count = 0;
          series.map(s => {
            count += s.data.length;
            return null;
          });
          if (count === 0) series = [];
          this.charts[0].chartOptions = {
            ...this.charts[0].chartOptions,
            xaxis: {
              ...this.charts[0].chartOptions.xaxis,
              categories: Object.keys(data)
            }
          };
          this.charts[0].series = series;
        })
        .catch(() => {});
    },
    getThreatChart() {
      axios
        .get(`/chart/threat?start_month=${monthNow}&end_month=${monthNow}`)
        .then(res => {
          const data = res.data;
          let series = this.maintenanceOptions.map(m => {
            return { name: m.text, data: [] };
          });
          for (let t in data) {
            for (let m in data[t]) {
              let find = series.findIndex(s => s.name === m);
              series[find].data.push(data[t][m]);
            }
          }
          let count = 0;
          series.map(s => {
            count += s.data.length;
            return null;
          });
          if (count === 0) series = [];
          this.charts[1].chartOptions = {
            ...this.charts[1].chartOptions,
            xaxis: {
              ...this.charts[1].chartOptions.xaxis,
              categories: Object.keys(data)
            }
          };
          this.charts[1].series = series;
        })
        .catch(() => {});
    },
    getParetoChart() {
      axios
        .get(`/chart/pareto?start_month=${monthNow}&end_month=${monthNow}`)
        .then(res => {
          const data = res.data;
          this.charts[2].series = {
            ...this.charts[2].series,
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
        })
        .catch(() => {});
    },
    getBreakdownChart() {
      axios
        .get(`/chart/breakdown?start_month=${monthNow}&end_month=${monthNow}`)
        .then(res => {
          const data = res.data.data;
          this.charts[3].chartOptions = {
            ...this.charts[3].chartOptions,
            labels: data.map(d => d.sub_threat),
            title: {
              ...this.charts[3].chartOptions.title,
              text: res.data.threat
            }
          };
          this.charts[3].series = data.map(d => d.total);
        })
        .catch(() => {});
    },
    getRiskChart() {
      axios
        .get(
          `/chart/risk_register?start_month=${monthNow}&end_month=${monthNow}`
        )
        .then(res => {
          this.charts[4] = {
            ...this.charts[4],
            chartOptions: {
              ...this.charts[4].chartOptions,
              xaxis: {
                ...this.charts[4].chartOptions.xaxis,
                categories: Object.keys(res.data.corporate_current_risk)
              }
            }
          };
          this.charts[4] = {
            ...this.charts[4],
            series: [{ data: Object.values(res.data.corporate_current_risk) }]
          };

          this.charts[5] = {
            ...this.charts[5],
            chartOptions: {
              ...this.charts[5].chartOptions,
              xaxis: {
                ...this.charts[5].chartOptions.xaxis,
                categories: Object.keys(res.data.corporate_proposed_risk)
              }
            }
          };
          this.charts[5] = {
            ...this.charts[5],
            series: [{ data: Object.values(res.data.corporate_proposed_risk) }]
          };

          const dimension = res.data.risk_dimension_distribution;
          this.charts[6] = {
            ...this.charts[6],
            chartOptions: {
              ...this.charts[6].chartOptions,
              xaxis: {
                ...this.charts[6].chartOptions.xaxis,
                categories: Object.keys(dimension)
              }
            }
          };
          this.charts[6] = {
            ...this.charts[6],
            series: [{ data: Object.values(dimension) }]
          };

          const value = res.data.risk_value_dist;
          this.charts[7] = {
            ...this.charts[7],
            chartOptions: {
              ...this.charts[7].chartOptions,
              xaxis: {
                ...this.charts[7].chartOptions.xaxis,
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
          this.charts[7] = {
            ...this.charts[7],
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
          this.charts[8] = {
            ...this.charts[8],
            chartOptions: {
              ...this.charts[8].chartOptions,
              xaxis: {
                ...this.charts[8].chartOptions.xaxis,
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
          this.charts[8] = {
            ...this.charts[8],
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
    }
  },
  data() {
    return {
      attrs: [],
      currentPage: 1,
      dateSelected: null,
      maintenanceOptions: [],
      highlighted: { dates: [] },
      observations: [],
      observationFields: [
        { key: "observation_date", label: "Date", sortable: true },
        { key: "observation_no", label: "No", sortable: true },
        { key: "uic.uic_code", label: "UIC", sortable: true },
        {
          key: "maintenance.name",
          label: "Maintenance",
          sortable: true
        },
        { key: "status", label: "Status", sortable: true }
      ],
      globalPlans: [],
      slickOptions: {
        slidesToShow: 2,
        slidesToScroll: 2,
        dots: true,
        infinite: false,
        arrows: true,
        responsive: [
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      },
      charts: [
        {
          type: "bar",
          series: [],
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
          }
        },
        {
          type: "bar",
          series: [],
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
          }
        },
        {
          type: "pareto",
          series: [],
          chartOptions: {
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
          }
        },
        {
          type: "pie",
          series: [],
          chartOptions: {
            noData: {
              text: "No Data",
              verticalAlign: "top"
            },
            title: {
              text: "",
              align: "center",
              margin: 10,
              style: {
                fontSize: "16px",
                fontWeight: "700"
              }
            },
            labels: [],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ],
            legend: {
              position: "bottom",
              horizontalAlign: "left",
              offsetX: 40
            }
          }
        },
        {
          type: "bar",
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
        {
          type: "bar",
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
        {
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
        {
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
        {
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
              position: "bottom"
            },
            fill: {
              opacity: 1
            }
          },
          series: []
        }
      ]
    };
  },
  components: {
    apexchart: VueApexCharts,
    Slick,
    Datepicker,
    CardCalendarInfo,
    BarChart
  },
  computed: {
    rows() {
      return this.observations.length;
    }
  }
};
</script>

<style>
.status-open {
  background-color: #0072b8 !important;
}
.status-onprogress {
  background-color: #ffa813 !important;
}
.status-close {
  background-color: #00a65a !important;
}
.status-overdue {
  background-color: #f56854 !important;
}
.status-verified {
  background-color: #a9a9a9 !important;
}
</style>

<style scoped lang="scss">
.chart-wrapper {
  padding: 1rem 1rem 1rem 0;
  width: 50%;
}

@media (max-width: 700px) {
  .chart-wrapper {
    width: 100%;
  }
}
</style>
