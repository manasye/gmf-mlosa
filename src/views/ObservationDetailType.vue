<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>
    <h3 class="header-title">
      {{ convertSnakeCaseToText(this.$route.params.type) }}
    </h3>
  </div>
</template>

<script>
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
              : `Observation No ${this.$route.params.id}`,
          href: `/#/observation/${this.$route.params.id}`
        },
        {
          text: this.convertSnakeCaseToText(this.$route.params.type),
          active: true
        }
      ]
    };
  }
};
</script>

<style scoped></style>
