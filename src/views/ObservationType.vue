<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />

    <b-row>
      <b-col cols="12" md="6">
        <h3 class="header-title">
          {{
            this.$route.params.id === "form"
              ? "Observation Form"
              : `Observation Type `
          }}
        </h3></b-col
      >
      <b-col
        cols="12"
        md="6"
        class="mt-2 mb-3 mt-md-0 mb-md-0 text-right"
        v-if="$route.params.id === 'form'"
      >
        <b-button
          variant="success"
          @click="$store.dispatch('goToPage', `/observation-new`)"
          >New Observation Form
        </b-button>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col
        cols="12"
        md="4"
        v-for="t in types"
        :key="t.text"
        class="mt-3 mt-md-4"
      >
        <b-button
          variant="primary"
          size="lg"
          class="d-block mx-auto w-75"
          @click="visitObsType(t)"
          >{{ t.text }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
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
          text:
            this.$route.params.id === "form"
              ? "Observation Form"
              : `Observation Type`,
          active: true
        }
      ],
      types: [
        { text: "Maintenance Plan", route: "/maintenance_plan" },
        { text: "Removal Process", route: "/removal_process" },
        { text: "Installation Process", route: "/installation_process" },
        { text: "Troubleshooting", route: "/troubleshooting" },
        { text: "Prepare To Install", route: "/prepare_to_install" },
        { text: "Test", route: "/test" },
        { text: "Removal Preparation", route: "/removal_preparation" },
        { text: "Servicing", route: "/servicing" },
        { text: "Close Up / Restore", route: "/close_up_or_restore" }
      ]
    };
  },
  methods: {
    visitObsType(t) {
      const url = this.$route.params.id !== "form" ? "create" : "new";
      this.$store.dispatch("goToPage", `/observation-${url}${t.route}`);
    }
  }
};
</script>

<style scoped />
