<template>
  <v-data-table :headers="headers" :items="desserts" :search="search" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="blue darken-3" dark class="mb-2" v-bind="attrs" v-on="on">
              Registrar
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="Detalle*" v-model="editedItem.detail" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <vuetify-money v-model="editedItem.saleValue" label="Valor Venta*" v-bind:clearable="clearable"
                      v-bind:options="options" />
                  </v-col>
                  <v-col cols="12" v-if="editedIndex === -1">
                    <v-text-field label="Codigo Barra*" v-model="editedItem.barcode" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Existencia*" v-model="editedItem.existence" required></v-text-field>
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
            <v-card-title class="text-h5">Esta seguro de eliminar este producto?</v-card-title>
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
    items: [],
    headers: [
      {
        text: "Detalle",
        align: "start",
        sortable: false,
        value: "detail",
      },
      { text: "Valor Venta", value: "saleValue2" },
      { text: "Existencia", value: "existence" },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    search: "",
    dialog: false,
    dialogDelete: false,
    desserts: [],
    editedItem: {},
    supplierItem: {},
    clearable: true,
    options: {
      locale: "pt-CO",
      prefix: "$",
      suffix: "",
      length: 11,
      precision: 2
    },
    defaultItem: {
      detail: "",
      saleValue: "",
      barcode: "",
      existence: "",
      supplier: "",
      id: "",
    },
    defaultSupplierItem: {
      nit: "",
      supplier: "",
      phone: "",
      direction: "",
      supplier: "",
      id: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
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

    async getProducts() {
      let data = await axios.get("api/products");
      let products = await data.data.desserts;
      this.desserts = [];
      products.forEach((products) => {
        this.desserts.push({
          detail: products.detail,
          saleValue: products.sale_value,
          saleValue2: this.convert(products.sale_value),
          existence: products.existence,
          barcode: products.barcode,
          supplier: products.supplier,
          id: products.id,
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
      this.deleteProduct(this.editedItem);
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
      if (this.editedIndex > -1) {
        this.updateProduct(this.editedItem);
      } else {
        const id = shortid.generate();
        this.setProduct(this.editedItem, id);
      }
      this.close();
    },

    async deleteProduct(editedItem) {
      axios
        .put(`api/products/inactivate/${editedItem.id}`)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async updateProduct(editedItem) {
      axios
        .put(`api/products/update/${editedItem.id}`, {
          id: editedItem.id,
          detail: editedItem.detail,
          sale_value: editedItem.saleValue,
          existence: editedItem.existence,
          barcode: editedItem.barcode,
        })
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setProduct(editedItem, id) {
      axios
        .post(`api/products`, {
          id: id,
          detail: editedItem.detail,
          sale_value: editedItem.saleValue,
          existence: editedItem.existence,
          barcode: editedItem.barcode,
        })
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    convert(number) {
      return new Intl.NumberFormat().format(number);
    },

    replaceData(number) {
      let newNumber = number.replace(/\./g, '');
      return newNumber.replace(',', '.');
    },

  },
  created() {
    this.getProducts();
  },
};
</script>
  