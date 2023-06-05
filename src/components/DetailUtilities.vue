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
        <v-btn @click="getUtilities()" class="mx-2" fab dark small color="primary">
          <v-icon dark> search </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="state">
      <v-row>
        <v-col cols="6" class="text-left">
          <h3>Productos</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h3>Total Compras</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h3>Total Ventas</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h3>Utilidades</h3>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <div v-for="item in desserts" class="mt-5">
        <v-row>
          <v-col cols="6" class="text-left">
            {{ item.detail }}
          </v-col>
          <v-col cols="2" class="text-right">
            ${{ convert(item.total_shopping) }}
          </v-col>
          <v-col cols="2" class="text-right">
            ${{ convert(item.total_sale) }}
          </v-col>
          <v-col cols="2" class="text-right">
            ${{ convert(item.total_sale - item.total_shopping) }}
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </div>
      <v-row class="mt-5">
        <v-col cols="6" class="text-left">
          <h3>Totales</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h3>${{ calculateShopping() }}</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h3>${{ calculateSales() }}</h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <h3>${{ calculateTotal() }}</h3>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>

<script>
import axios from "axios"

export default {
  data: () => ({
    desserts: [],
    state: false,
    date1: "",
    date2: "",
  }),
  methods: {

    async getUtilities() {
      let data = await axios.get(
        `api/transactions/getUtilities/${this.date1}/date2/${this.date2}`
      );
      this.desserts = await data.data.utilities;
      this.state = true;
    },

    convert(number) {
      return new Intl.NumberFormat().format(number);
    },

    calculateSales() {
      let cont = 0
      this.desserts.forEach(item => {
        cont = cont + parseFloat(item.total_sale);
      });
      return this.convert(cont)
    },

    calculateShopping() {
      let cont = 0
      this.desserts.forEach(item => {
        cont = cont + parseFloat(item.total_shopping);
      });
      return this.convert(cont)
    },

    calculateTotal() {
      let cont = 0
      this.desserts.forEach(item => {
        cont = cont + parseFloat(item.total_sale - item.total_shopping);
      });
      return this.convert(cont)
    }

  }
}
</script>

<style lang="scss" scoped></style>