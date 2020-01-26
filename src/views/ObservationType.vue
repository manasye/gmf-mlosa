<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />

    <b-row>
      <b-col cols="12" md="6">
        <h3 class="header-title text-uppercase">
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
        :key="t.name"
        class="mt-3 mt-md-4"
      >
        <b-button
          variant="primary"
          size="lg"
          class="d-block mx-auto w-75"
          @click="visitObsType(t)"
          >{{ t.name }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { FormBuilder } from "vue-formio";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/maintenance_process")
      .then(res => {
        this.types = res.data.data;
      })
      .catch(() => {});
  },
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
      types: []
    };
  },
  methods: {
    visitObsType(t) {
      const url = this.$route.params.id !== "form" ? "create" : "new";
      const obs_id = this.$route.query.obs_id;
      if (obs_id)
        this.$store.dispatch(
          "goToPage",
          `/observation-${url}/${t.id}?obs_id=${obs_id}`
        );
      else this.$store.dispatch("goToPage", `/observation-${url}/${t.id}`);
    }
  }
};
</script>

<style scoped />
