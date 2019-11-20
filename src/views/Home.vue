<template>
  <div class="container-app">
    <h3 class="header-title">DASHBOARD</h3>
    <slick ref="slick" :options="slickOptions">
      <div class="chart-wrapper" v-for="i in 2">
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </slick>
    <b-row class="mt-5">
      <b-col cols="12" md="6"
        ><h3 class="header-title mb-2 mb-md-4">MLOSA PLAN</h3>
        <b-row>
          <b-col cols="12" md="5">
            <datepicker
              :inline="true"
              class=" mb-4 mb-md-0  calendar"
              :minimumView="'day'"
              :maximumView="'day'"
            ></datepicker
          ></b-col>
          <b-col cols="12" md="7" class="mb-4 mb-md-0"
            ><b-card header="featured" header-tag="header">
              <b-card-text>
                <span class="grey-text">Due Date</span><br />Header and footers
                using props.</b-card-text
              >
              <b-card-text>
                <span class="grey-text">Description</span><br />Header and
                footers using props.</b-card-text
              >
            </b-card></b-col
          >
        </b-row>
      </b-col>

      <b-col cols="12" md="6"
        ><h3 class="header-title mb-2 mb-md-4">OBSERVATION</h3>
        <b-table
          style="margin-top: 20px;"
          striped
          hover
          :items="observations"
          :fields="observationFields"
          responsive
          @row-clicked="showObservation"
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
          </template></b-table
        ></b-col
      >
    </b-row>
  </div>
</template>

<script>
import Slick from "vue-slick";
import VueApexCharts from "vue-apexcharts";
import Datepicker from "vuejs-datepicker";

export default {
  name: "home",
  components: {
    apexchart: VueApexCharts,
    Slick,
    Datepicker
  },
  data() {
    return {
      observations: [{ date: "a", status: "Open" }],
      observationFields: [
        { key: "date", label: "Date", sortable: true },
        { key: "observation_id", label: "Id", sortable: true },
        { key: "uic", label: "UIC", sortable: true },
        {
          key: "maintenance_process",
          label: "Maintenance Process",
          sortable: true
        },
        { key: "status", label: "Status", sortable: true }
      ],
      slickOptions: {
        slidesToShow: 2,
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
          text: "Fiction Books Sales"
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
      }
    };
  },
  methods: {
    showObservation() {},
    getBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "Onprogress") return "warning";
      else if (val === "Close") return "success";
      else return "danger";
    }
  }
};
</script>

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

<style lang="scss">
.calendar {
  div {
    width: 100% !important;
  }
}
</style>