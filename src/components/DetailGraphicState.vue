<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date1"
          transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date1" label="Fecha Inicial" hint="Seleccione la fecha" readonly v-bind="attrs"
              v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date1" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date1)">
              Seleccionar
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="3">
        <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="date2"
          transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="date2" label="Fecha Final" hint="Seleccione la fecha" readonly v-bind="attrs"
              v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="date2" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu2 = false">
              Cancelar
            </v-btn>
            <v-btn text color="primary" @click="$refs.menu2.save(date2)">
              Seleccionar
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
          <v-col cols="2">
            <v-btn @click="getGraphicState()" class="mx-2" fab dark small color="primary">
              <v-icon dark> search </v-icon>
            </v-btn>
          </v-col>
    </v-row>
    <div class="content">
      <Doughnut :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
        :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" ref="pie" />
    </div>
  </v-container>
</template>

<script>
import axios from "axios"
import { Doughnut } from "vue-chartjs/legacy"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: "DoughnutChart",
  components: {
    Doughnut,
  },
  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => { },
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      date1: "",
      date2: "",
      items: [],
      paiment: [],
      state: false,
      chartData: {
        labels: ["Ingresos", "Egresos"],
        datasets: [
          {
            backgroundColor: ["#2196F3", "#FF5252"],
            data: [100, 0],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  methods: {
    
    async getGraphicState() {
      let data = await axios.get(
        `api/transactions/getIncomeExpenses/${this.date1}/date2/${this.date2}`
      );
      let state = await data.data.state;
      this.chartData.datasets[0].data = [];
      this.chartData.datasets[0].data[0] = state[0].total_sale;
      this.chartData.datasets[0].data[1] = state[0].total_shopping;
    },

  },

}
</script>

<style lang="scss">
.content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
