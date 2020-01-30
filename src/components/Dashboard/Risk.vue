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
          v-model="selectVal.safety_risk"
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
          <b-button variant="primary" size="sm">View Details</b-button>
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
          <b-button variant="primary" size="sm">View Details</b-button>
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
      <b-button variant="primary" size="sm">View Details</b-button>
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
      :items="riskValueTables"
      responsive
      show-empty
    ></b-table>

    <div class="text-right">
      <b-button variant="primary" size="sm">View Details</b-button>
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
        .get(`/chart/equipment?${queryParams}`)
        .then(res => {})
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
        threat: null,
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
            categories: [
              "South Korea",
              "Canada",
              "United Kingdom",
              "Netherlands",
              "Italy",
              "France",
              "Japan",
              "United States",
              "China",
              "Germany"
            ]
          }
        },
        series: [
          {
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
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
            categories: [
              "South Korea",
              "Canada",
              "United Kingdom",
              "Netherlands",
              "Italy",
              "France",
              "Japan",
              "United States",
              "China",
              "Germany"
            ]
          }
        },
        series: [
          {
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
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
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ],
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
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
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
            categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014]
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
        series: [
          {
            name: "Marine Sprite",
            data: [44, 55, 41, 37, 22, 43, 21]
          },
          {
            name: "Striking Calf",
            data: [53, 32, 33, 52, 13, 43, 32]
          },
          {
            name: "Tank Picture",
            data: [12, 17, 11, 9, 15, 11, 20]
          },
          {
            name: "Bucket Slope",
            data: [9, 7, 5, 8, 6, 9, 4]
          },
          {
            name: "Reborn Kid",
            data: [25, 12, 19, 32, 25, 24, 10]
          }
        ]
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
          xaxis: {
            type: "datetime",
            categories: [
              "01/01/2011 GMT",
              "01/02/2011 GMT",
              "01/03/2011 GMT",
              "01/04/2011 GMT",
              "01/05/2011 GMT",
              "01/06/2011 GMT"
            ]
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        },
        series: [
          {
            name: "PRODUCT A",
            data: [44, 55, 41, 67, 22, 43]
          },
          {
            name: "PRODUCT B",
            data: [13, 23, 20, 8, 13, 27]
          },
          {
            name: "PRODUCT C",
            data: [11, 17, 15, 15, 21, 14]
          },
          {
            name: "PRODUCT D",
            data: [21, 7, 25, 13, 22, 8]
          }
        ]
      }
    };
  }
};
</script>

<style scoped></style>
