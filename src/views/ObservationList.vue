<template>
  <div class="container-app">
    <b-row>
      <b-col cols="12" md="6">
        <h3 class="header-title">OBSERVATION LIST</h3></b-col
      >
      <b-col cols="12" md="6" class="text-right">
        <b-button
          variant="primary"
          @click="$store.dispatch('goToPage', `/observation-type/new`)"
          >New Observation</b-button
        >
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col cols="12" md="1" class="mb-3"
        ><label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="getObservations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Month</label>
        <b-form-select
          v-model="selectVal.month"
          :options="monthOptions"
          @input="getObservations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>UIC</label>
        <b-form-select
          v-model="selectVal.uic_id"
          :options="uicOptions"
          @input="getObservations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Maintenance Process</label>
        <b-form-select
          v-model="selectVal.mp_id"
          :options="maintenanceOptions"
          @input="getObservations"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Status</label>
        <b-form-select
          v-model="selectVal.status"
          :options="statusOptions"
          @input="getObservations"
        />
      </b-col>
      <b-col cols="12" md="1" class="mb-3"
        ><label>Per Page</label>
        <b-form-select v-model="perPage" :options="perPageOptions" />
      </b-col>
      <b-col cols="12" md="2" class="mb-3"
        ><label>Search</label>
        <b-nav-form @submit.prevent="getObservations">
          <b-form-input
            v-model="searchQuery"
            placeholder="Search..."
            style="width: 100%"
            @keyup="getObservations"
          />
        </b-nav-form>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="observationFields"
      :per-page="perPage"
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
      <template v-slot:cell(action)="data">
        <p
          class="text-primary mb-0 "
          style="cursor: pointer"
          @click.stop="actionClick(data.item)"
        >
          {{ data.value }}
          <font-awesome-icon
            icon="download"
            class="ml-2"
            style="cursor: pointer"
            v-if="data.value === 'Closed' || data.value === 'Verified'"
            @click.stop="downloadObservation(data.item)"
          />
        </p>
      </template>
      <template v-slot:cell(delete)="data">
        <font-awesome-icon
          icon="trash"
          class="cursor-pointer"
          @click="deleteObservation(data.item.id)"
          v-if="isAdmin() || data.item.uic_id === +getUic()"
      /></template>
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
      title="Observation Log"
      size="lg"
    >
      <b-table
        show-empty
        striped
        hover
        :items="histories"
        :fields="historyField"
      >
        <template v-slot:cell(date_log)="data">{{
          data.value.split(" ")[0]
        }}</template>
        <template v-slot:cell(status)="data">
          <b-badge :variant="getBadgesVariant(data.value)">
            <p class="status-badges" :class="getBadgesVariant(data.value)">
              {{ data.value }}
            </p>
          </b-badge>
          <font-awesome-icon
            icon="download"
            class="ml-2"
            style="cursor: pointer"
            v-if="data.item.link_download"
            @click.stop="downloadObservation(data.item)"
          />
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import {
  perPageOptions,
  months,
  statusObservation
} from "@/utility/variable.js";
import axios from "axios";
import {
  getUics,
  getMaintenances,
  getYearOptions,
  displayError
} from "@/utility/func.js";

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
    this.getObservations();
  },
  data() {
    return {
      selectVal: {
        year: null,
        month: null,
        mp_id: null,
        uic_id: null,
        status: null
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
          text: "All Month"
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
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      searchQuery: "",
      observationFields: [
        { key: "observation_date", label: "Date", sortable: true },
        { key: "observation_no", label: "Observation No", sortable: true },
        { key: "uic.uic_code", label: "UIC", sortable: true },
        { key: "subtitle", label: "Subtitle", sortable: true },
        { key: "due_date", label: "Due Date", sortable: true },
        {
          key: "maintenance.name",
          label: "Maintenance",
          sortable: true
        },
        { key: "status", label: "Status", sortable: true },
        { key: "action", label: "Action", sortable: true },
        { key: "delete", label: "Delete" }
      ],
      observations: [],
      showModal: false,
      histories: [],
      historyField: [{ key: "date_log", label: "Date" }, "activity", "status"],
      observationChosen: null
    };
  },
  computed: {
    rows() {
      return this.observations.length;
    },
    filteredItems() {
      return this.observations.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep =
            keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.observations[0]);
    }
  },
  methods: {
    getObservations() {
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
        .get(`/observation?${queryParams}`)
        .then(res => {
          this.observations = res.data.data.map(d => {
            let action;
            if (d.status === "Open") action = "Follow Up";
            else action = "View";
            return { ...d, action };
          });
        })
        .catch(() => {});
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
    actionClick(item) {
      if (item.action === "View") {
        axios
          .get(`/observation/${item.id}/logs`)
          .then(res => {
            this.histories = res.data.data;
            this.observationChosen = item;
            this.showModal = true;
          })
          .catch(() => {});
      } else {
        this.$store.dispatch(
          "goToPage",
          `/observation-type/new?obs_id=${item.id}`
        );
      }
    },
    downloadObservation(obs) {
      console.log(obs);
      window.location =
        axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 3) +
        obs.link_download;
    },
    deleteObservation(id) {
      axios
        .delete(`/observation/${id}`)
        .then(() => {
          this.getObservations();
        })
        .catch(err => displayError(err));
    }
  }
};
</script>

<style scoped />
