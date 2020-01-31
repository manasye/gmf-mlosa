<script>
import { Bar, mixins } from "vue-chartjs";

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "options"],
  methods: {
    update() {
      this.$data._chart.update();
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
