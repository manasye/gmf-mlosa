<template>
  <div class="p-3 recom-container mb-4">
    <b-row>
      <b-col cols="9"> <h5 class="header-title">Title</h5></b-col>
      <b-col cols="3" class="text-right"
        ><b-button :variant="getColorButton('Verify')" size="sm"
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
    <hr />
    <b-form-textarea
      v-model="reply"
      placeholder="Reply here..."
      v-if="recom.status !== 'Closed'"
    ></b-form-textarea>
    <b-row class="mt-3" v-if="recom.status !== 'Closed'">
      <b-col cols="6">
        <b-form-file v-model="attachedFile" />
      </b-col>
      <b-col cols="6" class="text-right">
        <b-button variant="primary" size="sm" @click="sendReply"
          >Send</b-button
        ></b-col
      >
    </b-row>
  </div>
</template>

<script>
import { displayError } from "@/utility/func.js";
import swal from "sweetalert";

export default {
  props: ["recom", "getDetail"],
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
    },
    sendReply() {
      let formData = new FormData();
      formData.append("recommendation_id", recom.id);
      // formData.append("user_id", this.getUs);
      formData.append("reply", this.reply);
      formData.append("file", this.attachedFiles);
      axios
        .post("/recommendation_replies", formData)
        .then(() => {
          swal("Success", "Reply successfully sent", "success");
          this.getDetail();
        })
        .catch(err => displayError(err));
    }
  },
  data() {
    return {
      reply: "",
      attachedFile: null
    };
  }
};
</script>

<style scoped>
.recom-container {
  border: 1px solid #949699;
}
</style>
