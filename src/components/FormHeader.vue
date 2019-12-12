<template>
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
    </b-col>
    <b-col cols="12"
      ><h5 class="primary-color mt-4 mb-3 text-center">
        Hazard (Threat Codes)
      </h5>
      <b-row>
        <b-col cols="12" md="6" v-for="c in codes" :key="c" class="mt-2">
          {{ c }}</b-col
        >
      </b-row></b-col
    >
  </b-row>
</template>

<script>
export default {
  data() {
    return {
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
      codes: [
        "A. Information",
        "G. Environment / Facilities",
        "B. Equipment / Tools / Safety Equipment",
        "H. Organization Factors",
        "C. Aircraft Design / Configuration / Parts",
        "I. Leadership / Supervision",
        "D. Job / Task",
        "J. Communication",
        "E. Knowledge / Skills",
        "K. Inspection / Double Check",
        "F. Individual Factors",
        "L. Other Contributing Factors"
      ]
    };
  }
};
</script>

<style scoped></style>
