<template>
  <div class="container-app">
    <b-row>
      <b-col cols="12" md="6">
        <h3 class="header-title">
          REPORT LIST
        </h3></b-col
      >
      <b-col cols="12" md="6" class="mt-2 mb-3 mt-md-0 mb-md-0 text-right">
        <b-button
          variant="success"
          @click="$store.dispatch('goToPage', '/report-form')"
          >New Report</b-button
        >
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getReports"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Month</label>
        <b-form-select
          v-model="selectVal.month"
          :options="monthOptions"
          @input="getReports"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>UIC</label>
        <b-form-select
          v-model="selectVal.uic_code"
          :options="uicOptions"
          @input="getReports"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Report Status</label>
        <b-form-select
          v-model="selectVal.status"
          :options="reportOptions"
          @input="getReports"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Follow Up Status</label>
        <b-form-select
          v-model="selectVal.recom_status"
          :options="followUpOptions"
          @input="getReports"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3 d-flex justify-content-end"
        ><b-button variant="primary" @click="getReports" class="align-self-end"
          >Filter</b-button
        ></b-col
      >
      <b-col cols="12" md="1" class="mb-3"
        ><label>Per Page</label>
        <b-form-select
          v-model="perPage"
          :options="perPageOptions"
          @input="getReports"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Search</label>
        <b-nav-form @submit.prevent="getReports">
          <b-form-input
            v-model="searchQuery"
            placeholder="Search..."
            style="width: 100%"
            @keyup="getReports"
          />
        </b-nav-form>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="reportFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showReport"
      show-empty
    >
      <template v-slot:cell(status)="data">
        <b-badge
          :variant="getReportBadgesVariant(data.value)"
          style="margin-right: 30px"
        >
          <p class="status-badges" :class="getReportBadgesVariant(data.value)">
            {{ data.value }}
          </p>
        </b-badge>
      </template>
      <template v-slot:cell(uic)="data">
        {{ data.value.join(", ") }}
      </template>
      <template v-slot:cell(recom_status)="data">
        <b-badge :variant="getRecomBadgesVariant(data.value)" class="mr-3">
          <p class="status-badges" :class="getRecomBadgesVariant(data.value)">
            {{ data.value }}
          </p>
        </b-badge>
        <font-awesome-icon
          icon="download"
          style="cursor: pointer"
          v-if="data.value === 'Close'"
          @click.stop="downloadReport(data.item)"
        />
      </template>
      <template v-slot:cell(action)="data">
        <p
          class="text-primary mb-0 "
          style="cursor: pointer"
          @click.stop="actionClick(data.item)"
        >
          {{ data.value }}
        </p>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    />

    <b-modal
      v-model="showModal"
      v-if="observationChosen"
      centered
      hide-footer
      title="REPORT LOG"
    >
      <b-table
        show-empty
        striped
        hover
        :items="histories"
        :fields="historyField"
      >
        <template v-slot:cell(status)="data">
          <b-badge :variant="getReportBadgesVariant(data.value)">
            <p
              class="status-badges"
              :class="getReportBadgesVariant(data.value)"
            >
              {{ data.value }}
            </p>
          </b-badge>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import {
  perPageOptions,
  statusObservation,
  statusReport,
  months
} from "@/utility/variable.js";
import { getUics } from "@/utility/func.js";
import axios from "axios";

export default {
  mounted() {
    getUics().then(res => {
      this.uicOptions = this.uicOptions.concat(res);
    });
    this.getReports();

    axios
      .get("/report/filter/filteroption")
      .then(res => {
        let years = res.data.year.map(y => {
          return { value: y, text: y };
        });
        this.yearOptions = this.yearOptions.concat(years);
      })
      .catch(() => {});
  },
  methods: {
    getReports() {
      let queryParams = "";
      for (let key in this.selectVal) {
        if (this.selectVal[key]) {
          queryParams += `${key}=${this.selectVal[key]}&`;
        }
      }
      if (this.searchQuery) {
        queryParams += `search=${this.searchQuery}`;
      }
      axios
        .get(`/report/filter/filterreport?${queryParams}`)
        .then(res => {
          this.reports = res.data.data.map(d => {
            let action;
            if (d.status === "Revised") action = "Follow Up";
            else action = "View";
            return { ...d, action };
          });
        })
        .catch(() => {});
    },
    showReport(row) {
      this.$store.dispatch("goToPage", `/report/${row.id}`);
    },
    getReportBadgesVariant(val) {
      if (val === "Need Checking") return "primary";
      else if (val === "Revised") return "warning";
      else if (val === "Approved") return "success";
      else return "secondary";
    },
    getRecomBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "On Progress") return "warning";
      else if (val === "Close") return "success";
      else if (val === "Overdue") return "danger";
      else if (val === "Verified") return "info";
      else return "secondary";
    },
    actionClick(item) {
      if (item.action === "View") {
        this.observationChosen = item;
        this.showModal = true;
      }
    },
    downloadReport(item) {}
  },
  data() {
    return {
      selectVal: {
        year: null,
        month: null,
        status: null,
        uic_code: null,
        recom_status: null
      },
      yearOptions: [
        {
          value: null,
          text: "All Years"
        }
      ],
      monthOptions: [
        {
          value: null,
          text: "All Months"
        },
        ...months
      ],
      reportOptions: [
        {
          value: null,
          text: "All Status"
        },
        ...statusReport
      ],
      followUpOptions: [
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
      searchQuery: null,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      reportFields: [
        { key: "date", label: "Date", sortable: true },
        { key: "report_no", label: "Report No", sortable: true },
        { key: "prepared_by", sortable: true },
        { key: "checked_by", sortable: true },
        { key: "approved_by", sortable: true },
        { key: "status", label: "Report Status", sortable: true },
        { key: "action", sortable: true },
        { key: "uic", label: "UIC", sortable: true },
        { key: "recom_status", label: "Recommendation", sortable: true }
      ],
      reports: [],
      showModal: false,
      histories: [{ status: "Verified" }],
      historyField: ["date", "activity", "status"],
      observationChosen: null
    };
  },
  computed: {
    rows() {
      return this.reports.length;
    },
    filteredItems() {
      return this.reports.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep =
            keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.reports[0]);
    }
  }
};
</script>

<style scoped />
