<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title">
      {{ convertSnakeCaseToText(this.$route.params.type) }}
    </h3>

    <form-header />

    <table class="table mt-5 table-responsive">
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

    <form-io
      src=""
      url=""
      :form="formSchema"
      submission=""
      options=""
      v-on:submit=""
    />
  </div>
</template>

<script>
import FormHeader from "../components/FormHeader";
import { Form } from "vue-formio";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: "Observation List",
          href: "/#/observation-list"
        },
        {
          text: this.convertSnakeCaseToText(this.$route.params.type),
          active: true
        }
      ],
      fields: [
        "No",
        "Activity",
        "Safety Risk",
        "Hazard (Threat) Code",
        "Risk Index",
        "Hazard (Threat) Effectively Managed",
        "Error Outcome & Remarks",
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
      }
    };
  },
  components: {
    FormHeader,
    FormIo: Form
  }
};
</script>

<style scoped></style>
