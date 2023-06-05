<template>
    <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Registrar Abono</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="editedItem.date"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="editedItem.date" label="Fecha*" hint="Seleccione la fecha" readonly
                            v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.date" no-title scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancelar
                          </v-btn>
                          <v-btn text color="primary" @click="$refs.menu.save(editedItem.date)">
                            Seleccionar
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12">
                      <vuetify-money v-model="editedItem.value" label="Valor*" v-bind:clearable="clearable" v-bind:options="options" />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="Saldo Pendiente*" v-model="editedItem.balance" required></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" :disabled="calculatePaid()" text @click="save"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> paid </v-icon>
        <v-icon small class="mr-2" @click="detailPayment(item)"> remove_red_eye </v-icon>
      </template>
    </v-data-table>
  </template>
      
  <script>
  const shortid = require("shortid");
  import axios from "axios";
  
  export default {
    data: () => ({
      items: [],
      search: "",
      desserts: [],
      headers: [
        {
          text: "Proveedor",
          value: "supplier",
        },
        {
          text: "Fecha",
          value: "date",
        },
        {
          text: "Total Cuenta",
          value: "total_shopping",
        },
        {
          text: "Total Abonos",
          value: "total_payments",
        },
        {
          text: "Saldo",
          value: "balance",
        },
        { text: "Acción", value: "actions", sortable: false },
      ],
      search: "",
      dialog: false,
      menu: false,
      desserts: [],
      editedItem: {},
      defaultEditedItem: {
        id: "",
        value: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      clearable: true,
      options: {
        locale: "pt-CO",
        prefix: "$",
        suffix: "",
        length: 11,
        precision: 2
      },
    }),
  
    methods: {
      async getReceivables() {
        let data = await axios.get("api/transactions/getPayables");
        let payable = await data.data.payables;
        this.desserts = [];
        payable.forEach((item) => {
          this.desserts.push({
            supplier: item.supplier,
            date: item.date,
            total_shopping: this.convert(item.total),
            total_payments: this.convert(item.total_payments),
            balance: this.convert(item.total - item.total_payments),
            balance2: item.total - item.total_payments,
            payable_id: item.id,
          });
        });
      },
  
      editItem(item) {
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
  
      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultEditedItem);
        });
      },
  
      save() {
        const id = shortid.generate();
        this.setPaidPayable(this.editedItem, id);
      },
  
      async setPaidPayable(editedItem, id) {
        axios
          .post(`api/transactions/savePaidPayable`, {
            id: id,
            payable_id: editedItem.payable_id,
            value: editedItem.value,
            date: editedItem.date,
            balance: editedItem.balance2,
          })
          .then(() => {
            this.close()
            this.getReceivables();
          })
          .catch((err) => {
            console.log(err);
          });
      },
  
      calculatePaid() {
        return parseInt(this.editedItem.value) > this.editedItem.balance2
      },
  
      replaceData(number) {
        let newNumber = number.replace(/\./g, '');
        return newNumber.replace(',', '.');
      },
  
      convert(number) {
        return new Intl.NumberFormat().format(number);
      },
    },
    created() {
      this.getReceivables();
    },
  };
  </script>
      
  <style>
  .table {
    top: 20px;
  }
  </style>
      