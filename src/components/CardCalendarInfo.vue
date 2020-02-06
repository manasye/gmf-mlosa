<template>
  <b-card :header="featured" header-tag="header">
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
  props: ["due", "description", "featured", "status"]
};
</script>

<style scoped></style>
