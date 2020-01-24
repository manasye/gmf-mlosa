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
        <tr>
          <th />
          <th>A</th>
        </tr>
        <tr>
          <td v-for="i in 7">Apples</td>
        </tr>
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

    <b-modal v-model="showModal" centered title="Add Sub Activity" @ok="addRow">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.section" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Sub Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.activity" /> </b-col
      ></b-row>
    </b-modal>

    <b-modal
      v-model="showModalSection"
      centered
      title="Add Activity"
      @ok="addRow"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Activity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedSection"/></b-col></b-row
    ></b-modal>
  </div>
</template>

<script>
import FormHeader from "@/components/FormHeader";
import { FormBuilder } from "vue-formio";

export default {
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
        "Error Outcome & Remarks"
      ],
      showModal: false,
      showModalSection: false,
      editedData: {
        section: null,
        activity: null
      },
      editedSection: null,
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
      ]
    };
  },
  components: {
    FormHeader,
    FormBuilder
  },
  methods: {
    addRow() {},
    changeForm(schema) {
      console.log(schema);

      if (schema.components) {
        this.formSchema = schema;
      }
    }
  }
};
</script>

<style scoped />
