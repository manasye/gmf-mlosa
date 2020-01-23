<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title">
      {{ convertSnakeCaseToText(headers.observation_no) || "" }}
    </h3>

    <b-row>
      <b-col cols="12" md="6">
        <b-row class="mt-2">
          <b-col cols="12" md="6">Observation Number</b-col>
          <b-col cols="12" md="6">{{ headers.observation_no }}</b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Observation Date (yyyy-mm-dd)</b-col>
          <b-col cols="12" md="6">{{ headers.observation_date }}</b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Observation Start Time (hh:mm)</b-col>
          <b-col cols="12" md="6"
            ><VueCtkDateTimePicker
              v-model="headers.observation_start_time"
              format="hh:mm"
              formatted="hh:mm"
              inputSize="sm"
              :onlyTime="true"
              label="Select Time"
            />
          </b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Observation End Time (hh:mm)</b-col>
          <b-col cols="12" md="6"
            ><VueCtkDateTimePicker
              v-model="headers.observation_end_time"
              format="hh:mm"
              formatted="hh:mm"
              inputSize="sm"
              :onlyTime="true"
              label="Select Time"
          /></b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col cols="12" md="6">A/C / Engine / Component Type</b-col>
          <b-col cols="12" md="6">
            <b-form-input v-model="headers.ac" />
          </b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Process / Task Being Observed</b-col>
          <b-col cols="12" md="6">
            <b-form-input v-model="headers.process"
          /></b-col>
        </b-row>
      </b-col>

      <b-col cols="12" md="6">
        <b-row class="mt-2">
          <b-col cols="12" md="6">Observation Team</b-col>
          <b-col cols="12" md="6"
            ><b-form-input
              v-model="headers.search_team"
              placeholder="Search Team"
          /></b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col cols="12" md="6">Location / Station (airport code)</b-col>
          <b-col cols="12" md="6">
            <b-form-input v-model="headers.location"/></b-col></b-row></b-col
    ></b-row>

    <form-header />

    <table class="table mt-5 table-responsive">
      <thead>
        <tr>
          <th scope="col" v-for="f in fields" :key="f">{{ f }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="a in activities">
          <tr :key="a.id">
            <th />
            <th>{{ convertSnakeCaseToText(a.name) }}</th>
            <th v-for="i in fields.length - 2" :key="i" />
          </tr>
          <tr v-for="(s, idx) in a.sub_activities" :key="s.id">
            <td>{{ idx + 1 }}</td>
            <td style="width: 25%">{{ s.description }}</td>
            <td>
              <b-form-select v-model="s.safety_risk" :options="safetyRisk" />
            </td>
            <td style="width: 10%">
              <b-form-select v-model="s.hazard_code" :options="hazardCode" />
            </td>
            <td style="cursor: pointer">
              {{ s.risk_index || "-" }}
            </td>
            <td style="width: 13%">
              <b-form-select
                v-model="s.hazard_effectively_managed"
                :options="hazardEffManaged"
              />
            </td>
            <td>
              <b-form-select
                v-model="s.error_outcome"
                :options="errorOutcome"
              />
            </td>
            <td>
              <b-form-input v-model="s.remarks" />
            </td>
            <td><b-button size="sm" variant="primary">Verify</b-button></td>
          </tr></template
        >
      </tbody>
    </table>

    <!--    <form-io-->
    <!--      src=""-->
    <!--      url=""-->

    <!--      :form="formSchema"-->
    <!--      submission=""-->
    <!--      options=""-->
    <!--      v-on:submit=""-->
    <!--    />-->

    <b-row class="mt-4 mb-3">
      <b-col cols="12" md="4">
        <b-form-file multiple v-model="attachedFiles"> </b-form-file
      ></b-col>
      <b-col cols="12" md="6">
        <b-button variant="success" class="mr-3">SAVE</b-button>
        <b-button variant="primary" class="mr-3">SUBMIT</b-button>
        <b-button variant="danger" class="mr-3">CANCEL</b-button></b-col
      >
    </b-row>
  </div>
</template>

<script>
import FormHeader from "../components/FormHeader";
import { Form } from "vue-formio";
import axios from "axios";
import {
  safetyRisk,
  hazardCode,
  hazardEffManaged,
  errorOutcome
} from "@/utility/variable.js";

export default {
  mounted() {
    axios
      .get(`/observation/${this.$route.query.obs_id}`)
      .then(res => {
        const data = res.data.data;
        this.headers = {
          ...this.headers,
          observation_no: data.observation_no,
          observation_date: data.observation_date
        };

        this.breadcrumbs[1].text = data.observation_no;
      })
      .catch(() => {});
    axios
      .get(`/observation/${this.$route.params.type}/form`)
      .then(res => {
        this.activities = res.data.activities;
      })
      .catch(() => {});
  },
  data() {
    return {
      safetyRisk,
      hazardCode,
      hazardEffManaged,
      errorOutcome,
      breadcrumbs: [
        {
          text: "Observation List",
          href: "/#/observation-list"
        },
        {
          text: this.convertSnakeCaseToText(this.$route.params.id),
          active: true
        }
      ],
      activities: [],
      headers: {
        observation_no: "",
        observation_date: "",
        observation_start_time: "",
        observation_end_time: "",
        ac: "",
        process: "",
        location: "",
        search_team: ""
      },
      fields: [
        "No",
        "Activity",
        "Safety Risk",
        "Hazard (Threat) Code",
        "Risk Index",
        "Hazard (Threat) Effectively Managed",
        "Error Outcome",
        "Remarks",
        "Verify"
      ],
      formSchema: {
        display: "form",
        components: [
          {
            label: "Text Field",
            spellcheck: true,
            tableView: true,
            validate: {
              unique: false,
              multiple: false
            },
            key: "textField",
            type: "textfield",
            input: true,
            value: "AAAA"
          },
          {
            type: "button",
            label: "Submit",
            key: "submit",
            disableOnInvalid: true,
            input: true,
            tableView: false,
            validate: {
              unique: false,
              multiple: false
            }
          }
        ]
      },
      attachedFiles: null
    };
  },
  components: {
    FormHeader,
    FormIo: Form
  }
};
</script>

<style scoped />
