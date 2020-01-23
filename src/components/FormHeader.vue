<template>
  <b-row>
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
