<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title text-uppercase">
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
              format="HH:mm"
              formatted="HH:mm"
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
              format="HH:mm"
              formatted="HH:mm"
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
              @keyup="searchUser"
            />
            <div class="search-container">
              <div v-for="u in teamNames" class="mt-2">{{ u }}</div>
            </div>
            <hr class="mb-2 mt-2" />
            <div class="search-container">
              <div v-for="u in userResults" class="mt-2">
                <b-row>
                  <b-col cols="6" md="8">{{ u.fullname }}</b-col>
                  <b-col cols="6" md="4"
                    ><b-button variant="primary" size="sm" @click="addTeam(u)"
                      >Add</b-button
                    ></b-col
                  >
                </b-row>
              </div>
            </div>
          </b-col>
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
                v-model="s.inputs.safety_risk"
                :options="safetyRisk"
              />
            </td>
            <td style="width: 10%;cursor: pointer" @click="openThreatCodes(s)">
              <div class="risk-index">
                {{ s.inputs.sub_threat_codes_name || "-" }}
              </div>
            </td>
            <td style="cursor: pointer" @click="openRiskIndex(s)">
              <div
                class="risk-index"
                :style="{ 'background-color': risks[s.inputs.risk_index] }"
              >
                {{ s.inputs.risk_index || "-" }}
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
      v-if="e.inputs.error_outcome === '2'"
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
        <b-button
          variant="primary"
          class="mr-3"
          @click="postObservation('On Progress')"
          >SAVE</b-button
        >
        <b-button
          variant="success"
          class="mr-3"
          @click="postObservation('Closed')"
          v-if="headers.no"
          >SUBMIT</b-button
        >
        <b-button
          variant="light"
          class="mr-3"
          @click="postObservation('Open')"
          v-if="headers.no"
          >CANCEL</b-button
        ></b-col
      >
    </b-row>

    <b-modal v-model="showModalThreat" centered hide-footer hide-header>
      <h4 class="mb-4 primary-color">Hazard (Threat) Code</h4>
      <b-card no-body v-for="t in threatCodes" :key="t.id" class="mb-3">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button
            block
            href="#"
            v-b-toggle="`accordion-${t.id}`"
            variant="primary"
            >{{ t.code }}. {{ t.description }}</b-button
          >
        </b-card-header>
        <b-collapse
          :id="`accordion-${t.id}`"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body class="pb-3 pt-3">
            <b-card-text
              v-for="s in t.sub_threat_code"
              style="cursor: pointer"
              @click="subThreatCode = s"
              :key="s.code"
            >
              {{ s.code }}. {{ s.description }}
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <p class="mb-0">
        Chosen Sub Threat Code : {{ subThreatCode ? subThreatCode.code : "-" }}
      </p>
      <b-row class="text-right mt-4">
        <b-col cols="12">
          <b-button
            variant="danger"
            @click="showModalThreat = false"
            class="mr-3"
            >Cancel</b-button
          >
          <b-button variant="primary" @click="submitThreatCode"
            >Submit</b-button
          >
        </b-col>
      </b-row>
    </b-modal>

    <b-modal v-model="showModalRisk" centered size="xl" hide-footer hide-header>
      <b-row>
        <b-col cols="12">
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
        <b-col cols="12">
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
            <template v-slot:cell(environment)="data">
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
          <b-button variant="primary" @click="s.safety_risk = 'SA'"
            >Submit</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import FormHeader from "@/components/FormHeader";
import { displayError } from "@/utility/func";
import { Form } from "vue-formio";
import axios from "axios";
import {
  safetyRisk,
  hazardCode,
  hazardEffManaged,
  errorOutcome
} from "@/utility/variable.js";
import moment from "moment";

export default {
  mounted() {
    this.getAllCodes();
    axios
      .get(`/observation/${this.$route.query.obs_id}`)
      .then(res => {
        const data = res.data.data;
        this.headers.no = data.observation_no || null;
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
      const find = this.chosenError.findIndex(e => e.id === s.id);
      if (find === -1) {
        if (s.inputs.error_outcome) this.chosenError = [...this.chosenError, s];
        else this.chosenError = this.chosenError.filter(e => e.id !== s.id);
      } else {
        this.chosenError[find] = s;
      }
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
      this.subActChosen.inputs.risk_index = this.tempRisk;
      this.showModalRisk = false;
    },
    submitThreatCode() {
      this.subActChosen.inputs.sub_threat_codes_id = this.subThreatCode.id;
      this.subActChosen.inputs.sub_threat_codes_name = this.subThreatCode.code;
      this.showModalThreat = false;
    },
    postObservation(status) {
      let action;
      let name = this.getFullname();
      if (status === "Open") action = name + " create MLOSA Plan";
      else if (status === "On Progress")
        action = name + " follow up MLOSA Plan";
      else if (status === "Close") action = name + " submit observation";

      const data = {
        observation: {
          ...this.headers,
          status,
          due_date: null,
          mp_id: this.maintenance_process.id,
          team: this.teamProject,
          id: +this.$route.query.obs_id,
          uic_id: +this.getUic()
        },
        maintenance_process: this.maintenance_process,
        activities: this.activities,
        action
      };
      axios
        .post("/observation", data)
        .then(res => {
          swal("Success", res.data.message, "success");
          this.$store.dispatch("goToPage", "/observation-list");
        })
        .catch(err => {
          displayError(err);
        });
    },
    searchUser() {
      axios
        .get(`/user?search=${this.headers.search_team}`)
        .then(res => {
          let userResults = res.data.data;
          this.teamNames.map(u => {
            userResults = userResults.filter(r => r.fullname !== u);
          });
          this.userResults = userResults;
        })
        .catch(() => {});
    },
    addTeam(s) {
      const data = {
        user_id: s.id,
        observation_id: +this.$route.query.obs_id || null
      };
      if (!this.teamProject.find(t => t.user_id === data.user_id)) {
        this.teamProject = [...this.teamProject, data];
        this.userResults = this.userResults.filter(r => r.id !== s.id);
        this.teamNames = [...this.teamNames, s.fullname];
      }
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
      userResults: [],
      teamProject: [
        {
          observation_id: +this.$route.query.obs_id || null,
          user_id: localStorage.getItem("user_id")
        }
      ],
      teamNames: [this.getFullname()],
      risks: {},
      probabilityChosenId: 0,
      severityChosenId: 0,
      subThreatCode: null,
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
        no: null,
        observation_date: moment(new Date()).format("YYYY-MM-DD"),
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
        { key: "definition", label: "Qualitative" },
        "meaning",
        { key: "value", label: "Value" }
      ],
      severityFields: [
        "aviation",
        "people",
        "environment",
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
.search-container {
  max-height: 20vh;
  overflow-x: hidden;
}
</style>
