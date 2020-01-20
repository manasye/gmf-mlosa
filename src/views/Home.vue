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
    <b-row class="mt-4">
      <b-col cols="12" md="6"
        ><h3 class="header-title mb-2 mb-md-4">MLOSA PLAN</h3>
        <b-row>
          <b-col cols="12" md="5">
            <datepicker
              :inline="true"
              class="mb-4 mb-md-0 calendar"
              :minimumView="'day'"
              :maximumView="'day'"
              :highlighted="highlighted"
              @selected="changeSelectedDate"
            />
          </b-col>
          <b-col cols="12" md="7" class="mb-4 mb-md-0">
            <card-calendar-info
              v-for="p in globalPlans[dateSelected]"
              :due="p.due_date"
              :description="p.subtitle"
              :featured="p.uic ? p.uic.uic_name : ''"
              v-if="globalPlans[dateSelected].length > 0"
              class="mb-3"
            />
          </b-col>
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
          </template>
        </b-table>
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

export default {
  name: "home",
  mounted() {
    this.getGlobalPlan();
    this.getObservations();
  },
  components: {
    apexchart: VueApexCharts,
    Slick,
    Datepicker,
    CardCalendarInfo
  },
  data() {
    return {
      dateSelected: null,
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
    showObservation(row) {
      this.$store.dispatch("goToPage", `/observation/${row.id}`);
    },
    getBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "Onprogress") return "warning";
      else if (val === "Close") return "success";
      else return "danger";
    },
    changeSelectedDate(date) {
      this.dateSelected = moment(date).format("YYYY-MM-DD");
    },
    getGlobalPlan() {
      axios
        .get(`/global_mlosa_plan`)
        .then(res => {
          this.globalPlans = res.data.data;
          const data = Object.keys(res.data.data);
          let dates = [];
          data.map(d => {
            if (d) {
              const year = d.split("-")[0];
              const month = d.split("-")[1];
              const date = d.split("-")[2];
              dates.push(new Date(year, month - 1, date));
            }
          });
          this.highlighted = {
            dates
          };
        })
        .catch(() => {});
    },
    getObservations() {
      axios
        .get("/observation")
        .then(res => {
          this.observations = res.data.data;
        })
        .catch(() => {});
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
