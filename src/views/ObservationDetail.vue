<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title">
      {{ convertSnakeCaseToText(breadcrumbs[1].text) || "" }}
    </h3>

    <b-row>
      <b-col cols="12" md="6">
        <b-row class="mt-2">
          <b-col cols="12" md="6">Observation Number</b-col>
          <b-col cols="12" md="6">{{ headers.no }}</b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Observation Date (yyyy-mm-dd)</b-col>
          <b-col cols="12" md="6">{{ headers.observation_date }}</b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Observation Start Time (hh:mm)</b-col>
          <b-col cols="12" md="6"
            ><VueCtkDateTimePicker
              v-model="headers.start_time"
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
              v-model="headers.end_time"
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
            <b-form-input v-model="headers.component_type" />
          </b-col>
        </b-row>
        <b-row class="mt-2"
          ><b-col cols="12" md="6">Process / Task Being Observed</b-col>
          <b-col cols="12" md="6">
            <b-form-input v-model="headers.task_observed"
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
        <template v-for="a in getActs">
          <tr :key="a.id">
            <th />
            <th>{{ convertSnakeCaseToText(a.name) }}</th>
            <th v-for="i in fields.length - 2" :key="a.id + '-' + i" />
          </tr>
          <tr v-for="(s, idx) in a.sub_activities" :key="a.id + '-' + s.id">
            <td>{{ idx + 1 }}</td>
            <td style="width: 25%">{{ s.description }}</td>
            <td>
              <b-form-select
                v-model="s.inputs.safety_risk_id"
                :options="safetyRisk"
              />
            </td>
            <td style="width: 10%;cursor: pointer" @click="openThreatCodes(s)">
              {{ s.inputs.sub_threat_codes_id || "-" }}
            </td>
            <td style="cursor: pointer" @click="openRiskIndex(s)">
              <div
                class="risk-index"
                :style="{ 'background-color': risks[s.inputs.risk_index_id] }"
              >
                {{ s.inputs.risk_index_id || "-" }}
              </div>
            </td>
            <td style="width: 13%">
              <b-form-select
                v-model="s.inputs.effectively_managed"
                :options="hazardEffManaged"
              />
            </td>
            <td>
              <b-form-select
                v-model="s.inputs.error_outcome"
                :options="errorOutcome"
                @input="addErrorOutcome(s)"
              />
            </td>
            <td>
              <b-form-textarea v-model="s.inputs.remark" />
            </td>
            <td>
              <b-button size="sm" variant="primary" @click="openVerify(s)"
                >Verify</b-button
              >
            </td>
          </tr></template
        >
      </tbody>
    </table>

    <p class="mb-3">
      Describe the hazard/threat(s). How did the crew manage/mismanage the
      hazard/threat(s)?
    </p>
    <div v-for="e in chosenError" :key="e.id" class="mb-3">
      <label> {{ e.description }}</label>
      <b-form-textarea v-model="e.hazardRemarks" />
    </div>
    <hr />
    <p class="mb-3">Describe crew error(s) and associated undesired state</p>
    <div
      v-for="e in chosenError"
      :key="e.id"
      class="mb-3"
      v-if="e.inputs.error_outcome === 'Undesired state'"
    >
      <label> {{ e.description }}</label>
      <b-form-textarea v-model="e.hazardCrewError" />
    </div>
    <hr />
    <p class="mb-3">Comment - Good or bad (please provide examples)</p>
    <b-form-textarea v-model="comment" />
    <hr />
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

    <b-modal
      v-model="showModalThreat"
      centered
      size="lg"
      hide-footer
      hide-header
    >
      <h4 class="mb-4 primary-color">Hazard (Threat) Code</h4>
    </b-modal>

    <b-modal v-model="showModalRisk" centered size="xl" hide-footer hide-header>
      <b-row>
        <b-col cols="12" md="3">
          <h5 class="mb-3">Probability of occurrence</h5>
          <b-table
            :fields="probabilityFields"
            :items="probabilities"
            @row-clicked="chooseProbability"
            show-empty
            responsive
          >
            <template v-slot:cell(qualititative)="data">{{
              data.value
            }}</template>
            <template v-slot:cell(meaning)="data">
              <li v-if="data.item.id !== probabilityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
          </b-table>
        </b-col>
        <b-col cols="12" md="9">
          <h5 class="mb-3">Severity of occurrence</h5>
          <b-table
            :fields="severityFields"
            :items="severities"
            @row-clicked="chooseSeverity"
            responsive
            style="width: 100%"
            show-empty
          >
            <template v-slot:cell(aviation)="data"
              >{{ data.value }} ({{ data.item.code }})</template
            >
            <template v-slot:cell(people)="data">
              <li v-if="data.item.id !== severityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
            <template v-slot:cell(security)="data">
              <li v-if="data.item.id !== severityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
            <template v-slot:cell(asset)="data">
              <li v-if="data.item.id !== severityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
            <template v-slot:cell(operational)="data">
              <li v-if="data.item.id !== severityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
            <template v-slot:cell(it_system)="data">
              <li v-if="data.item.id !== severityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
            <template v-slot:cell(reputational)="data">
              <li v-if="data.item.id !== severityChosenId">
                {{ data.value[0] }}
              </li>
              <li v-else v-for="m in data.value">
                {{ m }}
              </li>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="0" md="6" />
        <b-col cols="12" md="3" class="text-md-right"
          >Risk Index (e.g. 5A)</b-col
        >
        <b-col cols="12" md="3">
          <b-form-input v-model="tempRisk" size="sm" />
        </b-col>
      </b-row>

      <b-row class="text-right mt-4">
        <b-col cols="12">
          <b-button variant="danger" @click="showModalRisk = false" class="mr-3"
            >Cancel</b-button
          >
          <b-button variant="primary" @click="submitRisk">Submit</b-button>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal v-model="showModalVerify" centered hide-footer hide-header>
      <h4 class="mb-4 primary-color">Verification</h4>

      <b-row class="mb-3">
        <b-col cols="12" md="6">
          Current Risk Index
        </b-col>
        <b-col cols="12" md="6">
          <div class="risk-index" style="background-color: yellow">a</div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Control Effectiveness
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <b-form-select v-model="verification.control_effectiveness" />
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Risk Value
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          XXX
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Proposed Risk Index
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <div class="risk-index" style="background-color: red">a</div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Risk Index Actual
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <div class="risk-index" style="background-color: red">a</div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Revised Risk Index
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <div class="risk-index" style="background-color: red">a</div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Revised Control Effectiveness
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <b-form-select v-model="verification.control_effectiveness" />
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Propose Risk Value
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          XXX
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Accept / Threat
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <b-form-select
            v-model="verification.accept"
            :options="acceptOptions"
          />
        </b-col>
      </b-row>

      <b-row class="text-right mt-4">
        <b-col cols="12"
          ><b-button
            variant="danger"
            @click="showModalVerify = false"
            class="mr-3"
            >Cancel</b-button
          >
          <b-button variant="primary" @click="s.safety_risk_id = 'SA'"
            >Submit</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
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
    this.getAllCodes();

    axios
      .get(`/observation/${this.$route.query.obs_id}`)
      .then(res => {
        const data = res.data.data;
        this.headers.observation_date = data.observation_date;
        this.headers.no = data.observation_no;
      })
      .catch(() => {});
    axios
      .get(`/observation/${this.$route.params.id}/form`)
      .then(res => {
        this.activities = res.data.activities;
        this.breadcrumbs[1].text = res.data.maintenance_process.name;
        this.maintenance_process = res.data.maintenance_process;
      })
      .catch(() => {});
  },
  methods: {
    openThreatCodes(s) {
      this.subActChosen = s;
      this.showModalThreat = true;
    },
    openRiskIndex(s) {
      this.tempRisk = "";
      this.subActChosen = s;
      this.showModalRisk = true;
    },
    openVerify(s) {
      this.subActChosen = s;
      this.showModalVerify = true;
    },
    addErrorOutcome(s) {
      if (s.inputs.error_outcome) this.chosenError = [...this.chosenError, s];
      else this.chosenError = this.chosenError.filter(e => e.id !== s.id);
    },

    chooseProbability(p) {
      if (p.id === this.probabilityChosenId) this.probabilityChosenId = 0;
      else this.probabilityChosenId = p.id;
    },
    chooseSeverity(s) {
      if (s.id === this.severityChosenId) this.severityChosenId = 0;
      else this.severityChosenId = s.id;
    },
    submitRisk() {
      this.subActChosen.inputs.risk_index_id = this.tempRisk;
      this.showModalRisk = false;
    },

    getAllCodes() {
      axios
        .get("/threat_codes")
        .then(res => {
          this.threatCodes = res.data.data;
        })
        .catch(() => {});
      axios
        .get("/risk")
        .then(res => {
          this.probabilities = res.data.probability;
          this.severities = res.data.severity;
          let risks = {};
          res.data.risk_colors.map(r => {
            const key = r.probability_value + r.severity_code;
            risks[key] = r.color;
          });
          this.risks = risks;
        })
        .catch(() => {});
    }
  },
  data() {
    return {
      safetyRisk,
      hazardCode,
      hazardEffManaged,
      errorOutcome,
      subActChosen: null,
      chosenError: [],
      maintenance_process: {},
      threatCodes: [],
      probabilities: [],
      severities: [],
      risks: {},
      probabilityChosenId: 0,
      severityChosenId: 0,
      acceptOptions: [
        { value: "Accept", text: "Accept" },
        { value: "Threat", text: "Threat" }
      ],
      breadcrumbs: [
        {
          text: "Observation List",
          href: "/#/observation-list"
        },
        {
          text: "Loading...",
          active: true
        }
      ],
      activities: [],
      headers: {
        no: "",
        observation_date: "",
        start_time: "",
        end_time: "",
        component_type: "",
        task_observed: "",
        location: "",
        search_team: ""
      },
      verification: {
        control_effectiveness: "",
        revised_control_effectiveness: "",
        accept: ""
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
      probabilityFields: [
        { key: "definition", label: "Qual" },
        "meaning",
        { key: "value", label: "Value" }
      ],
      severityFields: [
        "aviation",
        "people",
        "security",
        "asset",
        "operational",
        "it_system",
        "reputational"
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
      attachedFiles: null,
      showModalRisk: false,
      showModalVerify: false,
      showModalThreat: false,
      comment: "",
      tempRisk: ""
    };
  },
  components: {
    FormHeader,
    FormIo: Form
  },
  computed: {
    getActs() {
      return this.activities;
    }
  }
};
</script>

<style scoped>
.risk-index {
  padding: 5px 15px;
  border-radius: 5px;
  display: inline-block;
}
</style>
