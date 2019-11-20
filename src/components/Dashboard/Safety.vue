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
      <b-col cols="12" md="2" class="mb-3"
        ><label>Safety Risk</label
        ><b-form-select
          v-model="selectVal.risk"
          :options="riskOptions"
        ></b-form-select></b-col
    ></b-row>

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

export default {
  data() {
    return {
      selectVal: {
        year: null,
        start: null,
        end: null,
        maintenance: null,
        risk: null
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
      riskOptions: [
        {
          value: null,
          text: "All Safety Risks"
        }
      ],
      chartOptions: {
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
          text: "Safety / At Risk Distribution in Maintenance Process Period",
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
    };
  }
};
</script>

<style scoped></style>
