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
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Producto*" hint="Producto seleccionado" persistent-hint
                      v-model="editedItem.detail" readonly=""></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Proveedor*" hint="Seleccione el proveedor" persistent-hint
                      v-model="editedItem.supplier" readonly></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Cantidad*" hint="Digite la cantidad" persistent-hint
                      v-model="editedItem.quantity" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <vuetify-money v-model="editedItem.total_value" label="Valor Total" v-bind:clearable="clearable"
                      v-bind:options="options" />
                  </v-col>
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
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Esta seguro de eliminar esta compra?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Eliminar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
      <v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>
    </template>
  </v-data-table>
</template>
  
<script>
const shortid = require("shortid");
import axios from "axios";

export default {
  data: () => ({
    menu: false,
    items: [],
    search: "",
    desserts: [],
    headers: [
      {
        text: "Producto",
        value: "detail",
      },
      {
        text: "Proveedor",
        value: "supplier",
      },
      {
        text: "Cantidad",
        value: "quantity",
      },
      {
        text: "Valor Unitario",
        value: "unit_value",
      },
      {
        text: "Valor Total",
        value: "total_value2",
      },
      {
        text: "Fecha",
        value: "date",
      },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    search: "",
    dialog: false,
    dialogDelete: false,
    desserts: [],
    desserts2: [],
    editedItem: {},
    clearable: true,
    options: {
      locale: "pt-CO",
      prefix: "$",
      suffix: "",
      length: 11,
      precision: 2
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Compra" : "Editar Compra";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async getShopping() {
      let data = await axios.get("api/transactions/getShopping");
      this.desserts2 = await data.data.shopping;

      this.desserts = [];
      this.desserts2.forEach((item) => {
        this.desserts.push({
          id: item.id,
          detail: item.detail,
          quantity: item.quantity,
          supplier: item.supplier,
          total_value: item.total_value,
          total_value2: this.convert(item.total_value),
          unit_value: this.convert(item.unit_value),
          date: item.date,
        });
      });
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteShopping(this.editedItem);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.updateShopping(this.editedItem);
      this.close();
    },

    async updateShopping(editedItem) {
      const unit_value = editedItem.total_value / editedItem.quantity;
      axios
        .put(`api/transactions/updateShopping/${editedItem.id}`, {
          quantity: editedItem.quantity,
          total_value: editedItem.total_value,
          unit_value: unit_value,
          date: editedItem.date,
        })
        .then(() => {
          this.getShopping();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async deleteShopping(editedItem) {
      axios
        .put(`api/transactions/inactivateShopping/${editedItem.id}`)
        .then(() => {
          this.getShopping();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    convert(num) {
      if (!isNaN(num)) {
        num = num
          .toString()
          .split("")
          .reverse()
          .join("")
          .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        num = num.split("").reverse().join("").replace(/^[\.]/, "");
        return num;
      }
    },

  },
  created() {
    this.getShopping();
  },
};
</script>
  
<style>
.table {
  top: 20px;
}
</style>
  