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
        ><label>Threat Code</label
        ><b-form-select
          v-model="selectVal.code"
          :options="codeOptions"
        ></b-form-select></b-col
    ></b-row>

    <apexchart
      type="line"
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
      series: [
        {
          name: "Website Blog",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        },
        {
          name: "Website Blog",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        },
        {
          name: "Social Media",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }
      ],
      chartOptions: {
        stroke: {
          width: [0, 4]
        },
        title: {
          text: "Parento Diagram of Threat Distribution Maintance Period",
          align: "center",
          margin: 0,
          style: {
            fontSize: "16px",
            fontWeight: "700"
          }
        },
        labels: [
          "01 Jan 2001",
          "02 Jan 2001",
          "03 Jan 2001",
          "04 Jan 2001",
          "05 Jan 2001",
          "06 Jan 2001",
          "07 Jan 2001",
          "08 Jan 2001",
          "09 Jan 2001",
          "10 Jan 2001",
          "11 Jan 2001",
          "12 Jan 2001"
        ],
        xaxis: {
          type: "datetime"
        },
        yaxis: [
          {
            title: {
              text: "Website Blog"
            }
          },
          {
            opposite: true,
            title: {
              text: "Social Media"
            }
          }
        ]
      }
    };
  }
};
</script>

<style scoped></style>
