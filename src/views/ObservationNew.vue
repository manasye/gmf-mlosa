<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title text-uppercase">
      {{
        $route.params.type
          ? this.convertSnakeCaseToText($route.params.type)
          : "New Observation Form"
      }}
    </h3>
    <b-row class="mt-4 mb-3">
      <b-col cols="12" md="6">
        <label>Form Title</label>
        <b-form-input v-model="title"
      /></b-col>
    </b-row>

    <b-row>
      <b-col cols="12" md="6">
        <b-row v-for="h in leftHeaders" :key="h.field" class="mt-2">
          <b-col cols="12" md="6"> {{ h.field }}</b-col>
          <b-col cols="12" md="6"> {{ h.value }}</b-col>
        </b-row>
      </b-col>
      <b-col cols="12" md="6">
        <b-row v-for="(h, idx) in rightHeaders" :key="idx" class="mt-2">
          <b-col cols="12" md="6"> {{ h.field }}</b-col>
          <b-col cols="12" md="6"> {{ h.value }}</b-col>
        </b-row>
      </b-col></b-row
    >

    <form-header />

    <div class="text-right">
      <b-button
        variant="primary"
        class="mt-4 mr-4"
        @click="showModalSection = true"
        >Add Activity</b-button
      >
      <b-button variant="primary" class="mt-4" @click="showModal = true"
        >Add Sub Activity</b-button
      >
    </div>

    <table class="table mt-3 table-responsive">
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
            <th v-for="i in fields.length - 2" :key="a.id + '-' + i" />
          </tr>
          <tr v-for="(s, idx) in a.sub_activities" :key="a.id + '-' + s.id">
            <td>{{ idx + 1 }}</td>
            <td style="width: 25%">{{ s.description }}</td>
            <th v-for="i in fields.length - 2" :key="a.id + '-' + i" />
          </tr>
        </template>
      </tbody>
    </table>

    <!--    <h5 class="primary-color mt-5 mb-4">-->
    <!--      Form Builder-->
    <!--    </h5>-->

    <!--    <form-builder-->
    <!--      v-bind:form="formSchema"-->
    <!--      v-bind:options="{}"-->
    <!--      v-on:change="schema => changeForm(schema)"-->
    <!--      class="mb-3"-->
    <!--    />-->

    <div class="text-right">
      <b-button variant="danger" class="mr-3">Delete</b-button>
      <b-button variant="primary">Update</b-button>
    </div>

    <b-modal
      v-model="showModal"
      centered
      title="Add Sub Activity To This Form"
      @ok="addSubActivity"
      @cancel="closeModalAct"
      @close="closeModalAct"
      size="lg"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="editedData.activity"
            :options="activityOptions"
          /> </b-col
        ><b-col cols="4">
          <label class="mt-2">Existing Sub Activity</label></b-col
        >
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="editedData.sub_activity"
            :options="subActOptions"
            :disabled="editedData.new_sub_activity !== ''"
          /> </b-col
        ><b-col cols="4"> <label class="mt-2">New Sub Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-textarea
            v-model="editedData.new_sub_activity"
            :disabled="editedData.sub_activity !== ''"
          /> </b-col
      ></b-row>
    </b-modal>

    <b-modal
      v-model="showModalSection"
      centered
      title="Add Activity To This Form"
      @ok="addActivity"
      @cancel="closeModalAct"
      @close="closeModalAct"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Existing Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="editedActivity"
            :disabled="newActivity !== ''"
            :options="activityOptions"/></b-col
        ><b-col cols="4"> <label class="mt-2">New Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input
            v-model="newActivity"
            :disabled="editedActivity !== ''"/></b-col></b-row
    ></b-modal>
  </div>
</template>

<script>
import FormHeader from "@/components/FormHeader";
import { FormBuilder } from "vue-formio";
import axios from "axios";

export default {
  mounted() {
    this.getActivities();
    this.getSubActs();
  },
  methods: {
    changeForm(schema) {
      if (schema.components) {
        this.formSchema = schema;
      }
    },
    closeModalAct() {
      this.newActivity = "";
      this.editedActivity = "";
      this.editedData = {
        sub_activity: "",
        activity: "",
        new_sub_activity: ""
      };
    },
    addActivity() {
      if (this.getActIdxFromId(this.editedActivity) !== null) return;

      if (this.editedActivity) {
        this.activities = [
          ...this.activities,
          {
            id: this.editedActivity,
            name: this.getNameFromId(this.editedActivity, this.activityOptions),
            sub_activities: []
          }
        ];
        this.getActivities();
      } else if (this.newActivity) {
        axios
          .post("/activity", { name: this.newActivity })
          .then(res => {
            this.activities = [
              ...this.activities,
              {
                id: res.data.data.id,
                name: res.data.data.name,
                sub_activities: []
              }
            ];
            this.getActivities();
          })
          .catch(() => {});
      }
    },
    addSubActivity() {
      if (!this.editedData.activity) return;
      let idxAct = this.getActIdxFromId(this.editedData.activity);
      console.log(idxAct);

      if (idxAct === null) {
        this.activities.push({
          id: this.editedData.activity,
          name: this.getNameFromId(
            this.editedData.activity,
            this.activityOptions
          ),
          sub_activities: []
        });
        idxAct = this.getActIdxFromId(this.editedData.activity);
      }
      if (this.getSubIdxFromAct(idxAct, this.editedData.sub_activity) !== null)
        return;

      if (this.editedData.sub_activity) {
        const data = {
          id: this.editedData.sub_activity,
          description: this.getNameFromId(
            this.editedData.sub_activity,
            this.subActOptions
          )
        };
        this.activities[idxAct].sub_activities.push(data);
      } else if (this.editedData.new_sub_activity) {
      }
    },
    getNameFromId(id, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].value === id) {
          return arr[i].text;
        }
      }
      return null;
    },
    getActIdxFromId(id) {
      for (let i = 0; i < this.activities.length; i++) {
        if (this.activities[i].id === id) {
          return i;
        }
      }
      return null;
    },
    getSubIdxFromAct(actIdx, id) {
      for (let i = 0; i < this.activities[actIdx].sub_activities.length; i++) {
        if (this.activities[actIdx].sub_activities[i].id === id) {
          return i;
        }
      }
      return null;
    },
    getActivities() {
      axios
        .get("/activity")
        .then(res => {
          this.activityOptions = res.data.data.map(a => {
            return { text: a.name, value: a.id };
          });
          this.activityOptions.unshift({ text: "Select Activity", value: "" });
        })
        .catch(() => {});
    },
    getSubActs() {
      axios
        .get("/sub_activity")
        .then(res => {
          this.subActOptions = res.data.data.map(a => {
            return { text: a.description, value: a.id };
          });
          this.subActOptions.unshift({
            text: "Select Sub Activity",
            value: ""
          });
        })
        .catch(() => {});
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Observation List",
          href: "/#/observation-list"
        },
        {
          text: "Observation Form",
          href: "/#/observation-type/form"
        },
        {
          text: this.$route.params.type
            ? this.convertSnakeCaseToText(this.$route.params.type)
            : "New Observation Form",
          active: true
        }
      ],
      title: this.$route.params.type
        ? this.convertSnakeCaseToText(this.$route.params.type)
        : "",
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
      activities: [
        {
          id: 1,
          name: "Safety",
          sub_activities: [
            {
              id: 18,
              description: "Removal procedures followed"
            },
            {
              id: 26,
              description:
                "Personnel use correct manual handling, ergonomics (e.g., proper lifting techniques)"
            }
          ]
        }
      ],
      showModal: false,
      showModalSection: false,
      editedData: {
        sub_activity: "",
        activity: "",
        new_sub_activity: ""
      },
      editedActivity: "",
      newActivity: "",
      formSchema: {},
      leftHeaders: [
        { field: "Observation Number", value: "auto generate" },
        { field: "Observation Date (dd/mm/yyyy)", value: "auto generate" },
        { field: "Observation Start Time (hh/mm)", value: "select time" },
        { field: "Observation End Time (hh/mm)", value: "select time" },
        { field: "A/C / Engine / Component Type", value: "free text" },
        { field: "Process / Task Being Observed", value: "free text" }
      ],
      rightHeaders: [
        { field: "Observation Team", value: "observer name (auto generate)" },
        { field: "", value: "observer name (searched)" },
        { field: "Location / Station (airport code)", value: "free text" }
      ],
      activityOptions: [],
      subActOptions: []
    };
  },
  components: {
    FormHeader,
    FormBuilder
  }
};
</script>

<style scoped />
