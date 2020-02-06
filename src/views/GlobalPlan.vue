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
      <b-col cols="12" md="2" class="mb-3"
        ><label>Status</label>
        <b-form-select
          v-model="selectVal.status"
          :options="statusOptions"
          @input="getGlobalPlan"
        />
      </b-col>
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
      <b-col cols="12" md="8" class="calendar-wrapper mt-3 mb-2">
        <b-row>
          <b-col
            cols="12"
            md="4"
            v-for="i in 12"
            class="mb-4"
            :key="i"
            @click="showMonthDetail(i)"
            v-if="monthInRange(i)"
          >
            <datepicker
              :inline="true"
              class="mb-4 mb-md-0 calendar"
              :minimumView="'day'"
              :maximumView="'day'"
              :open-date="
                new Date(selectVal.year || new Date().getFullYear(), i - 1, 15)
              "
              @selected="changeSelectedDate"
              :highlighted="highlighted"
            />
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="12" md="4" class="mt-3">
        <p class="text-center primary-color font-weight-bold">
          MLOSA IMPLEMENTATION
        </p>
        <apexchart
          type="pie"
          height="350"
          :options="chartOptions"
          :series="series"
        />
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
          <datepicker
            :inline="true"
            class="mb-4 mb-md-0 calendar"
            :minimumView="'day'"
            :maximumView="'day'"
            :open-date="new Date(new Date().getFullYear(), monthDetail - 1, 16)"
            :highlighted="highlightedDetail"
            @selected="changeSelectedDate"
          />
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
  components: { Datepicker, CardCalendarInfo },
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
    getChart() {
      axios
        .get("/mlosa_implementation")
        .then(res => {
          const data = res.data.data;
          const labels = data.map(d => d.status);
          this.series = data.map(d => d.count);
          this.chartOptions = {
            ...this.chartOptions,
            labels
          };
        })
        .catch(() => {});
    },
    changeSelectedDate(date) {
      this.dateSelected = moment(date).format("YYYY-MM-DD");
      const yearSplit = this.dateSelected.split("-")[0];
      const monthSplit = this.dateSelected.split("-")[1];
      const dateSplit = this.dateSelected.split("-")[2];
      this.highlightedDetail = {
        dates: [new Date(yearSplit, monthSplit - 1, dateSplit)]
      };
    }
  },
  data() {
    return {
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
      series: [],
      chartOptions: {
        labels: [],
        responsive: [
          {
            breakpoint: 2000,
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

<style scoped>
.calendar-wrapper {
  height: 60vh;
  overflow-y: scroll;
}

.info-wrapper {
  height: 60vh;
  overflow-y: scroll;
}

@media (max-width: 700px) {
  .info-wrapper {
    height: 40vh;
  }
}
</style>
