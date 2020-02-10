<template>
  <b-card
    :header="featured"
    header-tag="header"
    :header-bg-variant="headerBg"
    header-text-variant="white"
  >
    <b-card-text>
      <span class="grey-text">Due Date</span><br />{{ due }}
    </b-card-text>
    <b-card-text>
      <span class="grey-text">Description</span><br />{{ description || "-" }}
    </b-card-text>
    <b-card-text>
      <span class="grey-text">Status</span><br />{{ status || "-" }}
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  props: ["due", "description", "featured", "status"],
  computed: {
    headerBg() {
      if (this.status === "Open") return "primary";
      if (this.status === "On Progress") return "warning";
      if (this.status === "Overdue") return "danger";
      if (this.status === "Verified") return "secondary";
      if (this.status === "Close") return "success";
    }
  }
};
</script>

<style scoped></style>
