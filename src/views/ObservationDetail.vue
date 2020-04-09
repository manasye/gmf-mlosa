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

    <table class="table mt-5 table-responsive">
      <thead>
        <tr>
          <th scope="col" v-for="f in fields" :key="f">{{ f }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(a, idxA) in getActs">
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
                @input="safetyInput(s)"
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
              <b-button
                v-if="checkVerif(s)"
                size="sm"
                variant="primary"
                @click="openVerify(s, idxA, idx)"
                >Verify</b-button
              >
            </td>
          </tr></template
        >
      </tbody>
    </table>

    <p class="mb-3" v-if="chosenError.length > 0">
      Describe the hazard/threat(s). How did the crew manage/mismanage the
      hazard/threat(s)?
    </p>
    <div v-if="chosenError.length > 0" class="mb-3">
      <b-form-textarea v-model="hazardRemarks" />
    </div>
    <p
      class="mb-3"
      v-if="chosenError.filter(e => e.inputs.error_outcome === '2').length > 0"
    >
      Describe crew error(s) and associated undesired state
    </p>
    <div
      class="mb-3"
      v-if="chosenError.filter(e => e.inputs.error_outcome === '2').length > 0"
    >
      <b-form-textarea v-model="hazardCrewError" />
    </div>
    <p class="mb-3">Comment - Good or bad (please provide examples)</p>
    <b-form-textarea v-model="comment" />

    <b-row class="mt-4 mb-3">
      <b-col cols="12" md="4">
        <b-form-file
          multiple
          v-model="attachedFiles"
          :file-name-formatter="formatNames"
        >
        </b-form-file
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
          @click="postObservation('Open')"
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
              @click="chooseThreatCode(s)"
              :key="s.code"
            >
              {{ s.code }}. {{ s.description }}
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <p class="mb-0">
        Chosen Sub Threat Code :
      </p>
      <div
        v-for="tc in subThreatCodes"
        :key="tc.code"
        class="d-flex justify-content-between mb-3"
      >
        <p class="mb-1">
          {{ tc.code }}
        </p>
        <b-button
          variant="danger"
          size="sm"
          @click="
            subThreatCodes = subThreatCodes.filter(s => s.code !== tc.code)
          "
          ><font-awesome-icon icon="trash"
        /></b-button>
      </div>
      <b-row class="text-right mt-4">
        <b-col cols="12">
          <b-button
            variant="light"
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
            show-empty
            responsive
          >
            <template v-slot:cell(qualitative)="data">{{
              data.value
            }}</template>
            <template v-slot:cell(meaning)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(choose)="data"
              ><b-button
                variant="primary"
                @click="
                  () => {
                    tempRisk = {
                      ...tempRisk,
                      probability: data.item.value
                    };
                    if (tempRisk.probability && tempRisk.severity) submitRisk();
                  }
                "
                size="sm"
                >Choose</b-button
              ></template
            >
          </b-table>
          <p>Chosen Probability : {{ tempRisk.probability || "-" }}</p>
        </b-col>
        <b-col cols="12" class="mt-3">
          <h5 class="mb-3">Severity of occurrence</h5>
          <b-table
            :fields="severityFields"
            :items="severities"
            responsive
            style="width: 100%"
            show-empty
          >
            <template v-slot:cell(aviation)="data"
              >{{ data.value }} ({{ data.item.code }})</template
            >
            <template v-slot:cell(people)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(environment)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(security)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(asset)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(operational)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(it_system)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(reputational)="data">
              <span class="probability-html" v-html="data.value"></span>
            </template>
            <template v-slot:cell(choose)="data"
              ><b-button
                variant="primary"
                @click="
                  () => {
                    tempRisk = {
                      ...tempRisk,
                      severity: data.item.code
                    };
                    if (tempRisk.probability && tempRisk.severity) submitRisk();
                  }
                "
                size="sm"
                >Choose</b-button
              ></template
            >
          </b-table>
          <p class="mb-1">Chosen Severity : {{ tempRisk.severity || "-" }}</p>
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
          <div
            class="risk-index"
            :style="{
              'background-color': risks[subActChosen.inputs.risk_index]
            }"
          >
            {{ subActChosen.inputs.risk_index || "-" }}
          </div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Control Effectiveness
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <b-form-select
            v-model="verification.control_effectiveness"
            :options="controlEffectivenessOptions"
            @input="calcRiskValue(1)"
          />
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Risk Value
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          {{ verification.risk_value || "" }}
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Proposed Risk Index
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <div
            class="risk-index"
            :style="{
              'background-color': risks[verification.risk_index_proposed]
            }"
            @click="
              () => {
                riskIndexId = 2;
                showModalRisk = true;
              }
            "
          >
            {{ verification.risk_index_proposed || "-" }}
          </div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Risk Index Actual
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <div
            class="risk-index"
            :style="{
              'background-color': risks[verification.risk_index_actual]
            }"
            @click="
              () => {
                riskIndexId = 3;
                showModalRisk = true;
              }
            "
          >
            {{ verification.risk_index_actual || "-" }}
          </div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Revised Risk Index
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <div
            class="risk-index"
            :style="{
              'background-color': risks[verification.revised_risk_index]
            }"
            @click="
              () => {
                riskIndexId = 4;
                showModalRisk = true;
              }
            "
          >
            {{ verification.revised_risk_index || "-" }}
          </div>
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Revised Control Effectiveness
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <b-form-select
            v-model="verification.revised_control_effectiveness"
            :options="controlEffectivenessOptions"
            @input="calcRiskValue(2)"
          />
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Propose Risk Value
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          {{ verification.propose_risk_value || "" }}
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          Accept / Threat
        </b-col>
        <b-col cols="12" md="6" class="mt-2">
          <b-form-select
            v-model="verification.accept_or_treat"
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
          <b-button variant="primary" @click="submitVerify">Submit</b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
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
    axios.get("/risk");
    this.getAllCodes();
    axios
      .get(`/observation/${this.$route.query.obs_id}`)
      .then(res => {
        const data = res.data.data;
        this.headers.no = data.observation_no || null;
      })
      .catch(() => {});
    axios
      .get(
        `/observation/${this.$route.params.id}/form?observation_no=${this.$route.query.obs_no}`
      )
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
      this.riskIndexId = 1;
      this.subActChosen = s;
      this.showModalRisk = true;
    },
    openVerify(s, a, i) {
      this.chosenActivityIdx = a;
      this.chosenSubActIdx = i;
      this.subActChosen = s;
      this.showModalVerify = true;
    },
    addErrorOutcome(s) {
      const find = this.chosenError.findIndex(e => e.id === s.id);
      if (find === -1) {
        if (s.inputs.error_outcome) this.chosenError = [...this.chosenError, s];
        else this.chosenError = this.chosenError.filter(e => e.id !== s.id);
      } else {
        if (s.inputs.error_outcome) this.chosenError[find] = s;
        else this.chosenError = this.chosenError.filter(e => e.id !== s.id);
      }
    },
    chooseProbability(p) {
      if (p.qualitative === this.probabilityChosenId)
        this.probabilityChosenId = 0;
      else this.probabilityChosenId = p.qualitative;
    },
    chooseSeverity(s) {
      if (s.id === this.severityChosenId) this.severityChosenId = 0;
      else this.severityChosenId = s.id;
    },
    submitRisk() {
      const concat = this.tempRisk.probability + this.tempRisk.severity;
      if (this.riskIndexId === 1) this.subActChosen.inputs.risk_index = concat;
      else if (this.riskIndexId === 2)
        this.verification.risk_index_proposed = concat;
      else if (this.riskIndexId === 3)
        this.verification.risk_index_actual = concat;
      else if (this.riskIndexId === 4)
        this.verification.revised_risk_index = concat;
      this.showModalRisk = false;
      this.tempRisk = {
        probability: "",
        severity: ""
      };
    },
    submitThreatCode() {
      this.subActChosen.inputs.sub_threat_codes_id = this.subThreatCodes
        .map(s => s.id)
        .join(",");
      this.subActChosen.inputs.sub_threat_codes_name = this.subThreatCodes
        .map(s => s.code)
        .join(",");
      this.showModalThreat = false;
    },
    postObservation(status) {
      let action;
      let name = this.getFullname();
      if (status === "Open") action = name + " create MLOSA Plan";
      else if (status === "On Progress")
        action = name + " follow up MLOSA Plan";
      else if (status === "Closed") action = name + " submit observation";

      if (this.isAdmin()) status = "Closed";

      const data = {
        observation: {
          ...this.headers,
          status,
          due_date: null,
          mp_id: this.maintenance_process.id,
          team: this.teamProject,
          id: +this.$route.query.obs_id,
          uic_id: +this.getUic(),
          comment: this.comment,
          describe_threat: this.hazardRemarks,
          describe_crew_error: this.hazardCrewError
        },
        maintenance_process: this.maintenance_process,
        activities: this.activities,
        action
      };
      axios
        .post("/observation", data)
        .then(res => {
          const id = res.data.observation_id;
          let formData = new FormData();
          for (let i = 0; i < this.attachedFiles.length; i++) {
            formData.append(`file[${i}]`, this.attachedFiles[i]);
          }
          const config = { headers: { "Content-Type": "multipart/form-data" } };
          axios
            .post(`/observation/${id}/upload`, formData, config)
            .then(() => {
              swal("Success", res.data.message || "Success", "success");
              this.$store.dispatch("goToPage", "/observation-list");
            })
            .catch(err => displayError(err));
        })
        .catch(err => displayError(err));
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
        .get("/risk/index")
        .then(res => {
          this.probabilities = res.data.probability_of_occurence;
          this.severities = res.data.severity_of_occurence;
          let risks = {};
          res.data.color_risk_index.map(c => {
            c.risk_index.map(i => {
              risks[i] = c.color;
            });
          });
          this.risks = risks;
        })
        .catch(() => {});
    },
    formatNames(files) {
      if (files.length === 1) {
        return this.shortenText(files[0].name, 25);
      } else {
        return `${files.length} files selected`;
      }
    },
    checkVerif(s) {
      const inputs = s.inputs;
      return (
        inputs.safety_risk &&
        inputs.sub_threat_codes_id &&
        inputs.risk_index &&
        inputs.effectively_managed &&
        inputs.error_outcome
      );
    },
    safetyInput(s) {
      if (
        s.inputs.safety_risk === "S" ||
        s.inputs.safety_risk === "DNO" ||
        s.inputs.safety_risk === "N/A"
      ) {
        s.inputs.effectively_managed = null;
        s.inputs.error_outcome = null;
      }
    },
    chooseThreatCode(s) {
      if (!this.subThreatCodes.includes(s)) this.subThreatCodes.push(s);
    },
    calcRiskValue(t) {
      let r, c;
      if (t === 1) {
        r = this.subActChosen.inputs.risk_index;
        c = this.verification.control_effectiveness;
      } else {
        r = this.verification.risk_index_actual;
        c = this.verification.revised_control_effectiveness;
      }
      axios
        .get(`/risk_value/calculate?risk_index=${r}&control_effectiveness=${c}`)
        .then(res => {
          const val = res.data.risk_value;
          if (t === 1) {
            this.verification.risk_value = val;
          } else {
            this.verification.propose_risk_value = val;
          }
        })
        .catch(() => {});
    },
    submitVerify() {
      this.subActChosen = {
        ...this.subActChosen,
        inputs: {
          ...this.subActChosen.inputs,
          ...this.verification
        }
      };
      this.activities[this.chosenActivityIdx].sub_activities[
        this.chosenSubActIdx
      ] = this.subActChosen;
      this.showModalVerify = false;
    }
  },
  data() {
    return {
      hazardRemarks: "",
      hazardCrewError: "",
      safetyRisk,
      hazardCode,
      hazardEffManaged,
      errorOutcome,
      subActChosen: {
        inputs: {
          risk_index: ""
        }
      },
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
      subThreatCodes: [],
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
        accept_or_treat: "",
        risk_index_proposed: "",
        risk_index_actual: "",
        revised_risk_index: "",
        risk_value: "",
        propose_risk_value: ""
      },
      verifications: [],
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
        { key: "qualitative", label: "Qualitative" },
        "meaning",
        { key: "value", label: "Value" },
        "choose"
      ],
      severityFields: [
        "aviation",
        "people",
        "environment",
        "security",
        "asset",
        "operational",
        "it_system",
        "reputational",
        "choose"
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
      tempRisk: {
        probability: "",
        severity: ""
      },
      riskIndexId: 0,
      controlEffectivenessOptions: Array.from(Array(10).keys()).map(e => e + 1),
      chosenActivityIdx: 0,
      chosenSubActIdx: 0
    };
  },
  components: {
    FormIo: Form
  },
  computed: {
    getActs() {
      return this.activities;
    }
  }
};
</script>

<style>
.probability-html p {
  margin-bottom: 0;
}
</style>

<style scoped>
.risk-index {
  padding: 5px 15px;
  border-radius: 5px;
  display: inline-block;
  cursor: pointer;
}
.search-container {
  max-height: 20vh;
  overflow-x: hidden;
}
</style>
