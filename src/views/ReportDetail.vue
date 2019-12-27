<template>
  <div class="container-app">
    <b-breadcrumb :items="breadcrumbs" />
    <h3 class="header-title">
      REPORT {{ convertSnakeCaseToText(this.$route.params.id) }}
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: "Report List",
          href: "/#/report-list"
        },
        {
          text: this.convertSnakeCaseToText(this.$route.params.id),
          active: true
        }
      ]
    };
  }
};
</script>

<style scoped></style>
