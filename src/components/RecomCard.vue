<template>
  <div class="p-3 recom-container mb-4">
    <b-row>
      <b-col cols="9"> <h5 class="header-title">Title</h5></b-col>
      <b-col cols="3" class="text-right"
        ><b-button :variant="getColorButton('Verify')" pill size="sm"
          >Verify</b-button
        ></b-col
      >
    </b-row>
    <b-row>
      <b-col cols="3"> <p class="mb-2 grey-text">Due Date</p></b-col>
      <b-col cols="9">{{ recom.due_date }}</b-col>
      <b-col cols="3"> <p class="mb-2 grey-text">Status</p></b-col>
      <b-col cols="9">
        <b-badge :variant="getRecomBadgesVariant(recom.status)" class="mr-3">
          <p class="status-badges" :class="getRecomBadgesVariant(recom.status)">
            {{ recom.status }}
          </p>
        </b-badge></b-col
      >
    </b-row>
    <p class="mb-2 grey-text">Recommendation</p>
    <p class="mb-2">
      {{ recom.recommendation }}
    </p>
  </div>
</template>

<script>
export default {
  props: ["recom"],
  methods: {
    getColorButton(action) {
      if (action === "Verify") return "success";
      else return "danger";
    },
    getRecomBadgesVariant(val) {
      if (val === "Open") return "primary";
      else if (val === "On Progress") return "warning";
      else if (val === "Close") return "success";
      else if (val === "Overdue") return "danger";
      else return "secondary";
    }
  }
};
</script>

<style scoped>
.recom-container {
  border: 1px solid #949699;
}
</style>
