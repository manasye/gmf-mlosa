<template>
  <div class="container-app">
    <h3 class="header-title">
      QUALITY ASSURANCE AND SAFETY REPORT
    </h3>
    <b-row class="mt-4">
      <b-col cols="12" md="6">
        <b-row>
          <b-col cols="3">
            Title
          </b-col>
          <b-col cols="9">
            <b-form-input v-model="title" />
          </b-col>
          <b-col cols="3" class="mt-3">
            Subject
          </b-col>
          <b-col cols="9" class="mt-3">
            <b-form-textarea v-model="subject" />
          </b-col>
          <b-col cols="3" class="mt-3">
            Distribution ('cc' dalam email)
          </b-col>
          <b-col cols="9" class="mt-3">
            <b-form-select
              v-model="distSelected"
              :options="distOptions"
              multiple
              :select-size="4"
            />
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" md="6"
        ><b-row>
          <template v-for="r in right">
            <b-col cols="3" class="mb-2">
              {{ r.label }}
            </b-col>
            <b-col cols="9" v-if="r.label !== 'Date'">{{ r.value }}</b-col>
            <b-col cols="9" v-else class="mb-2">
              <datepicker v-model="date" calendar-class="modal-calendar"
            /></b-col> </template
        ></b-row>
      </b-col>
    </b-row>
    <label class="mt-4">I. Introduction</label>

    <b-row>
      <b-col cols="11">
        <ckeditor :editor="editor" v-model="intro" :config="editorConfig" />
      </b-col>
      <b-col cols="1" align-self="center">
        <font-awesome-icon
          icon="exclamation-circle"
          size="lg"
          style="cursor: pointer"
          @click="toggleRemarks(0)"
        />
      </b-col>
    </b-row>

    <b-form-textarea
      class="mt-3"
      placeholder="Add your remarks here..."
      v-if="remarksShow[0]"
      v-model="remarks[0]"
    ></b-form-textarea>

    <label class="mt-4">II. Brief Summary</label>

    <b-row>
      <b-col cols="11">
        <ckeditor :editor="editor" v-model="briefSummary" :config="editorConfig"
      /></b-col>
      <b-col cols="1" align-self="center">
        <font-awesome-icon
          icon="exclamation-circle"
          size="lg"
          style="cursor: pointer"
          @click="toggleRemarks(1)"
        />
      </b-col>
    </b-row>

    <b-form-textarea
      class="mt-3"
      placeholder="Add your remarks here..."
      v-if="remarksShow[1]"
      v-model="remarks[1]"
    ></b-form-textarea>

    <label class="mt-4">III. Section Summaries</label>
    <br />
    <label>III.1 MLOSA Demographic</label>
    <b-form-textarea
      placeholder="(Auto generated by system), has filter"
      disabled
    />
    <b-row class="mt-4">
      <b-col cols="12" md="9"> <label>III.2 Regression Analysis</label></b-col>
      <b-col cols="12" md="3"
        ><b-form-checkbox
          v-model="checked"
          name="check-button"
          switch
          size="lg"
          class="text-right"
        >
        </b-form-checkbox
      ></b-col>
    </b-row>

    <b-row>
      <b-col cols="11">
        <ckeditor
          :editor="editor"
          v-model="regression"
          :config="editorConfig"
          v-if="checked"
      /></b-col>
      <b-col cols="1" align-self="center">
        <font-awesome-icon
          icon="exclamation-circle"
          size="lg"
          style="cursor: pointer"
          @click="toggleRemarks(2)"
        />
      </b-col>
    </b-row>

    <b-form-textarea
      class="mt-3"
      placeholder="Add your remarks here..."
      v-if="remarksShow[2]"
      v-model="remarks[2]"
    ></b-form-textarea>

    <label class="mt-4">III.3 Threat and Error Management Result</label>

    <b-row>
      <b-col cols="11">
        <ckeditor :editor="editor" v-model="threat" :config="editorConfig" />
      </b-col>
      <b-col cols="1" align-self="center">
        <font-awesome-icon
          icon="exclamation-circle"
          size="lg"
          style="cursor: pointer"
          @click="toggleRemarks(3)"
        />
      </b-col>
    </b-row>

    <b-form-textarea
      class="mt-3"
      placeholder="Add your remarks here..."
      v-if="remarksShow[3]"
      v-model="remarks[3]"
    ></b-form-textarea>

    <b-row class="mt-4">
      <b-col cols="12" md="9"> <label>IV. Recommendation</label></b-col>
      <b-col cols="12" md="3" class="text-right"
        ><b-button variant="primary" size="sm" @click="addNewRecom"
          >New</b-button
        ></b-col
      >
    </b-row>
    <b-row v-for="(r, idx) in recommendations" :key="idx" class="mb-3">
      <b-col cols="12" md="8">
        <ckeditor
          :editor="editor"
          v-model="r.recommendation"
          :config="editorConfig"
      /></b-col>
      <b-col cols="12" md="3">
        <label
          >Due Date : <br /><datepicker
            calendar-class="modal-calendar"
            @input="r.due_date = customFormatter($event)"
        /></label>
        <br />
        <label
          >UIC :
          <b-form-select
            v-model="r.uic"
            :options="uicOptions"
            multiple
            :select-size="4"
        /></label>
      </b-col>
      <b-col cols="12" md="1" align-self="center">
        <font-awesome-icon
          icon="exclamation-circle"
          size="lg"
          style="cursor: pointer"
          @click="toggleRemarks(4 + idx)"
        />
        <br />
        <br />
        <b-button
          variant="danger"
          style="cursor: pointer"
          size="sm"
          @click="deleteRecom(idx)"
          v-if="idx !== 0"
          ><font-awesome-icon icon="trash"
        /></b-button>
      </b-col>

      <b-col cols="12">
        <b-form-textarea
          class="mt-3"
          placeholder="Add your remarks here..."
          v-if="remarksShow[4 + idx]"
          v-model="remarks[4 + idx]"
        ></b-form-textarea
      ></b-col>
    </b-row>

    <b-button variant="primary" class="mr-3" @click="postReport('draft')"
      >SAVE</b-button
    >
    <b-button variant="success" class="mr-3" @click="postReport('submit')"
      >SUBMIT</b-button
    >

    <b-modal v-model="showModal" centered title="ADD FIELD">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Label</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.label" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.type" /> </b-col></b-row
    ></b-modal>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import { getUics } from "@/utility/func.js";

export default {
  mounted() {
    getUics().then(res => {
      this.uicOptions = this.uicOptions.concat(res);
    });
  },
  methods: {
    postReport(status) {
      if (status === "submit") {
      }

      const data = {
        prepared_by: "Test",
        approved_by: "Test",
        checked_by: "Test",
        status,
        title: this.title,
        subject: this.subject,
        report_no: this.headers.no,
        date: moment(this.date).format("YYYY-MM-DD"),
        attention: "Attention Test",
        issued: "TQY",
        distribution: this.distSelected.map(d => {
          return { name: d };
        }),
        introduction: this.intro,
        brief_summary: this.briefSummary,
        regression_analysis: this.regression,
        threat_error: this.threat,
        recommendations: this.recommendations
      };

      console.log(data);

      // axios
      //   .post("/report", data)
      //   .then(res => {
      //     swal("Success", res.data.message || "Success", "success");
      //     this.$store.dispatch("goToPage", "/report-list");
      //   })
      //   .catch(() => {});
    },
    MyCustomUploadAdapterPlugin(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new UploadAdapter(loader);
      };
    },
    customFormatter(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    toggleRemarks(idx) {
      this.remarksShow = this.remarksShow.map((e, i) => {
        if (i === idx) return !e;
        return e;
      });
    },
    addNewRecom() {
      this.recommendations = [
        ...this.recommendations,
        {
          uic: [],
          recommendation: "",
          due_date: "",
          status: ""
        }
      ];
      this.remarksShow.push(false);
      this.remarks.push("");
    },
    deleteRecom(idx) {
      this.recommendations = this.recommendations.filter((r, i) => i !== idx);
      this.remarksShow = this.remarksShow.filter((r, i) => i !== 4 + idx);
      this.remarks = this.remarks.filter((r, i) => i !== 4 + idx);
    }
  },
  components: { Datepicker },
  data() {
    return {
      uicOptions: [],
      title: "",
      subject: "",
      headers: {
        no: ""
      },
      editor: ClassicEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        extraPlugins: [this.MyCustomUploadAdapterPlugin]
      },
      date: null,
      dueDate: null,
      showModal: false,
      editedData: {
        label: "",
        type: ""
      },
      right: [
        {
          label: "No",
          value: "(Auto Generate)"
        },
        {
          label: "Date",
          value: "select date"
        },
        {
          label: "Attention",
          value: "auto as recommendation('to' dalam email)"
        },
        {
          label: "Issued",
          value: "TQY"
        },
        {
          label: "Prepared by",
          value: "(Auto Generate)"
        },
        {
          label: "Checked by",
          value: "(Auto Generate)"
        },
        {
          label: "Approved by",
          value: "(Auto Generate)"
        }
      ],
      checked: true,
      distSelected: [],
      distOptions: [
        {
          value: "DT",
          text: "DT"
        },
        {
          value: "DB",
          text: "DB"
        },
        {
          value: "DL",
          text: "DL"
        },
        {
          value: "MQ",
          text: "MQ"
        }
      ],
      intro: null,
      briefSummary: null,
      regression: null,
      threat: null,
      recommendations: [
        { uic: [], recommendation: "", due_date: "", status: "" }
      ],
      remarksShow: Array(5).fill(false),
      remarks: Array(5).fill("")
    };
  }
};

class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(uploadedFile => {
      return new Promise((resolve, reject) => {
        const data = new FormData();
        data.append("file", uploadedFile);
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        axios
          .post("/report/upload_file_editor", data, config)
          .then(res => {
            resolve({
              default: res.data.image_url
            });
          })
          .catch(() => {
            reject("Upload failed");
          });

        // axios({
        //   url: "/report/upload_file_editor",
        //   method: "post",
        //   data,
        //   headers: {
        //     "Content-Type": "multipart/form-data;"
        //   }
        // })
        //   .then(response => {
        //     if (response.data.result == "success") {
        //       resolve({
        //         default: response.data.url
        //       });
        //     } else {
        //       reject(response.data.message);
        //     }
        //   })
        //   .catch(() => {
        //     reject("Upload failed");
        //   });
      });
    });
  }

  abort() {}
}
</script>

<style scoped />
