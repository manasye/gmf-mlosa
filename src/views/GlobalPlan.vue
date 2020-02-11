<template>
  <div class="container-app">
    <h3 class="header-title">GLOBAL MLOSA PLAN</h3>

    <b-row class="mt-3">
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getGlobalPlan"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Start Month</label>
        <b-form-select
          v-model="selectVal.start_month"
          :options="startOptions"
          @input="getGlobalPlan"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>End Month</label>
        <b-form-select
          v-model="selectVal.end_month"
          :options="endOptions"
          @input="getGlobalPlan"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>UIC</label>
        <b-form-select
          v-model="selectVal.uic_id"
          :options="uicOptions"
          @input="getGlobalPlan"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label>
        <b-form-select
          v-model="selectVal.mp_id"
          :options="maintenanceOptions"
          @input="getGlobalPlan"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>Status</label>
        <b-form-select
          v-model="selectVal.status"
          :options="statusOptions"
          @input="getGlobalPlan"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3  d-flex justify-content-end"
        ><b-button
          variant="primary"
          @click="getGlobalPlan"
          class="align-self-end"
          >Filter</b-button
        ></b-col
      >
      <b-col cols="12" md="2" class="mb-3 d-flex justify-content-end">
        <b-button
          variant="primary"
          class="align-self-end"
          @click="showModal = true"
          >New MLOSA Plan
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12" md="9" class="calendar-wrapper mt-3 mb-2">
        <b-row>
          <b-col
            cols="12"
            md="4"
            v-for="i in 12"
            class="mb-4"
            :key="i"
            v-if="monthInRange(i)"
          >
            <v-calendar
              :attributes="attrs"
              :from-date="
                new Date(selectVal.year || new Date().getFullYear(), i - 1, 15)
              "
              :disable-page-swipe="true"
              @dayclick="changeSelectedDate"
            ></v-calendar>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="12" md="3" class="mt-3">
        <p class="text-center primary-color font-weight-bold">
          MLOSA IMPLEMENTATION
        </p>
        <doughnut ref="skills_chart" :chart-data="chartData" :options="options">
        </doughnut>
      </b-col>
    </b-row>

    <b-modal
      v-model="showModalDetail"
      centered
      @ok="addPlan"
      v-if="showModalDetail"
      hide-footer
      hide-header
      size="xl"
    >
      <b-row>
        <b-col cols="12" md="3">
          <v-calendar
            :attributes="attrs"
            :from-date="
              new Date(
                selectVal.year || new Date().getFullYear(),
                monthDetail - 1,
                15
              )
            "
            :disable-page-swipe="true"
            @dayclick="changeSelectedDate"
          ></v-calendar>
        </b-col>
        <b-col cols="12" md="9" class="info-wrapper">
          <b-row>
            <b-col
              cols="12"
              md="6"
              v-for="p in globalPlans[dateSelected]"
              class="mb-3"
              :key="p.id"
            >
              <card-calendar-info
                :due="p.due_date"
                :description="p.subtitle"
                :featured="p.uic ? p.uic.uic_name : ''"
                v-if="globalPlans[dateSelected].length > 0"
                :status="p.status"
              />
            </b-col>
            <p v-if="!globalPlans[dateSelected]">No plan on this date</p>
          </b-row>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      v-model="showModal"
      centered
      @ok="addPlan"
      title="New MLOSA Plan"
      v-if="showModal"
      ok-title="Submit"
    >
      <b-row>
        <b-col cols="4"><label class="mt-2">UIC</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="editedData.uic_id"
            :options="uicOptions.slice(1, uicOptions.length)"
          />
        </b-col>
        <b-col cols="12">
          <p
            class="primary-color cursor-pointer hover-underline"
            @click="showModalUic = true"
          >
            Add UIC
          </p></b-col
        >
        <b-col cols="4"><label class="mt-2">Due Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <datepicker
            v-model="editedData.due_date"
            calendar-class="modal-calendar"
          />
        </b-col>
        <b-col cols="4"><label class="mt-2">Subtitle</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.subtitle" />
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      v-model="showModalUic"
      centered
      title="Add UIC"
      v-if="showModalUic"
      @ok="addUic"
      ok-title="Submit"
    >
      <b-row
        ><b-col cols="4"> <label class="mt-2">UIC Code</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedUic.uic_code" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">UIC Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedUic.uic_name" /> </b-col
      ></b-row>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import Datepicker from "vuejs-datepicker";
import CardCalendarInfo from "@/components/CardCalendarInfo";
import { months, statusObservation } from "@/utility/variable.js";
import {
  getUics,
  getMaintenances,
  getYearOptions,
  displayError
} from "@/utility/func.js";
import moment from "moment";
import Doughnut from "@/components/DoughnutChart.vue";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: false
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        let dataset = data.datasets[tooltipItem.datasetIndex];
        let total = dataset.data.reduce(function(previousValue, currentValue) {
          return previousValue + currentValue;
        });
        let currentValue = dataset.data[tooltipItem.index];
        let percentage = Math.floor((currentValue / total) * 100 + 0.5);
        return " " + currentValue + " (" + percentage + "%)";
      }
    }
  }
};

export default {
  mounted() {
    getUics().then(res => {
      this.uicOptions = this.uicOptions.concat(res);
    });
    getMaintenances().then(res => {
      this.maintenanceOptions = this.maintenanceOptions.concat(res);
    });
    getYearOptions().then(res => {
      this.yearOptions = this.yearOptions.concat(res);
    });
    this.statusOptions = this.statusOptions.filter(o => o.value !== "Verified");
    this.getGlobalPlan();
    this.getChart();
  },
  components: { Datepicker, CardCalendarInfo, Doughnut },
  methods: {
    getGlobalPlan() {
      let queryParams = "";
      for (let key in this.selectVal) {
        if (this.selectVal[key]) {
          queryParams += `${key}=${this.selectVal[key]}&`;
        }
      }
      axios
        .get(`/global_mlosa_plan?${queryParams}`)
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
            },
            {
              key: "Verified",
              highlight: {
                class: "status-verified"
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
              if (status === "Verified")
                labels[4].dates.push(new Date(year, month - 1, date));
              if (status === "Close")
                labels[2].dates.push(new Date(year, month - 1, date));
              if (status === "Overdue")
                labels[3].dates.push(new Date(year, month - 1, date));
            }
          });
          this.attrs = labels;
        })
        .catch(() => {});
    },
    getChart() {
      axios
        .get("/mlosa_implementation")
        .then(res => {
          const data = res.data.data;
          let counts = new Array(5).fill(0);
          data.map(d => {
            if (d.status === "On Progress") counts[1] = d.count;
            if (d.status === "Open") counts[0] = d.count;
            if (d.status === "Verified") counts[4] = d.count;
            if (d.status === "Close") counts[2] = d.count;
            if (d.status === "Overdue") counts[3] = d.count;
          });
          let datasets = [
            {
              backgroundColor: [
                "#0072B8",
                "#FFA813",
                "#00A65A",
                "#F56854",
                "#a9a9a9"
              ],
              data: counts
            }
          ];
          this.chartData = {
            ...this.chartData,
            labels: ["Open", "On Progress", "Close", "Overdue", "Verified"],
            datasets
          };
        })
        .catch(() => {});
    },
    addPlan() {
      this.editedData.due_date = moment(this.editedData.due_date).format(
        "YYYY-MM-DD"
      );
      axios
        .post("/new_mlosa_plan", this.editedData)
        .then(() => {
          this.editedData = {
            uic_id: null,
            due_date: null,
            subtitle: null
          };
          this.getGlobalPlan();
          this.getChart();
        })
        .catch(err => {
          displayError(err);
        });
    },
    showMonthDetail(i) {
      this.monthDetail = i;
      this.showModalDetail = true;
    },
    monthInRange(i) {
      let check = true;
      if (this.selectVal.start_month) {
        check = check && i >= +this.selectVal.start_month;
      }
      if (this.selectVal.end_month) {
        check = check && i <= +this.selectVal.end_month;
      }
      return check;
    },
    addUic() {
      axios
        .post("/uic", this.editedUic)
        .then(() => {
          getUics().then(res => {
            this.uicOptions = this.uicOptions.concat(res);
          });
        })
        .catch(err => {
          displayError(err);
        });
    },
    changeSelectedDate({ date }) {
      this.dateSelected = moment(date).format("YYYY-MM-DD");
      const yearSplit = this.dateSelected.split("-")[0];
      const monthSplit = this.dateSelected.split("-")[1];
      const dateSplit = this.dateSelected.split("-")[2];
      this.showMonthDetail(monthSplit);
      this.highlightedDetail = {
        dates: [new Date(yearSplit, monthSplit - 1, dateSplit)]
      };
    }
  },
  data() {
    return {
      attrs: [],
      globalPlans: null,
      dateSelected: null,
      highlighted: { dates: [] },
      highlightedDetail: { dates: [] },
      showModal: false,
      showModalDetail: false,
      showModalUic: false,
      monthDetail: null,
      editedUic: {
        uic_name: "",
        uic_code: ""
      },
      editedData: {
        uic_id: null,
        due_date: null,
        subtitle: null
      },
      selectVal: {
        year: null,
        start_month: null,
        end_month: null,
        mp_id: null,
        uic_id: null,
        status: null
      },
      activeDates: [],
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
      statusOptions: [
        {
          value: null,
          text: "All Status"
        },
        ...statusObservation
      ],
      uicOptions: [
        {
          value: null,
          text: "All UICs"
        }
      ],
      options,
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      }
    };
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

<style scoped>
.calendar-wrapper {
  height: 70vh;
  overflow-y: scroll;
}

.info-wrapper {
  height: 70vh;
  overflow-y: scroll;
}

@media (max-width: 700px) {
  .info-wrapper {
    height: 40vh;
  }
}
</style>
