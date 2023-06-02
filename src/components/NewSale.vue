<template>
  <v-container>
    <v-dialog v-model="dialogClient" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nuevo Cliente</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Cliente*" hint="Digite el nombre del cliente" persistent-hint
                  v-model="newClient.client" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Identificación*" hint="Digite la identificación del cliente" persistent-hint
                  v-model="newClient.identification" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Telefono*" hint="Digite el telefono del cliente" persistent-hint
                  v-model="newClient.phone" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Dirección*" hint="Digite la dirección del cliente" persistent-hint
                  v-model="newClient.direction" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialogClient">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveClient"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="sale">
      <div class="sale__left">
        <v-col cols="12">
          <v-text-field label="Codigo de barra*" @change="getProductsByBarcode()" v-model="saleItem.barcode" required></v-text-field>
        </v-col>
        <v-row>
          <v-col cols="12">
            <v-autocomplete @change="getStatusProduct()" :items="items" return-object label="Producto*" item-value="value"
              item-text="detail" no-data-text="Producto no registrado" :menu-props="{ maxHeight: 100 }"
              v-model="saleItem.product_id"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Cantidad" v-model="saleItem.quantity" @keyup="calculateTotal()"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Disponible" v-model="saleItem.existence"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <vuetify-money v-model="saleItem.unit_value" label="Valor Unitario" v-bind:clearable="clearable"
              v-bind:options="options" />
          </v-col>
          <v-col cols="12">
            <vuetify-money v-model="saleItem.total_value" label="Valor Total" readonly="readonly"
              v-bind:options="options" />
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="saleItem.date"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="saleItem.date" label="Fecha*" hint="Seleccione la fecha" readonly v-bind="attrs"
                v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="saleItem.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                Cancelar
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(saleItem.date)">
                Seleccionar
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-row class="flex d-flex justify-center mb-6 bg-surface-variant">
          <v-col cols="4">
            <v-btn :disabled="disabledForm()" @click="saveSaleProduct" class="mx-2" fab dark small color="primary">
              <v-icon dark> shopping_cart </v-icon>

            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="sale__right">
        <v-data-table :headers="headers" :items="listProducs" class="elevation-1" :items-per-page="itemsPerPage">
          <template v-slot:top>
            <v-toolbar flat>
              <v-row class="d-flex justify-end mr-5">
                <h2>${{ totalSale }}</h2>
              </v-row>
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
            <v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>
          </template>
        </v-data-table>
        <v-row>
          <v-col cols="6">
            <v-switch color="primary" label="Cuenta por cobrar" v-model="receivable" @change="change()">
            </v-switch>
          </v-col>
          <v-col v-if="receivable"><v-autocomplete prepend-icon="person" @click:prepend="dialogClient = !dialogClient"
              :items="clients" return-object item-value="value" item-text="client" no-data-text="Cliente no registrado"
              :menu-props="{ maxHeight: 100 }" v-model="clients">
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row class="flex d-flex justify-center mb-6 bg-surface-variant">
          <v-col cols="4">
            <v-btn block class="text-none mt-5 mb-4" color="primary" size="x-large" variant="flat"
              :disabled="disabledForm2()" @click="saveSale">
              Registrar Venta
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>
    
<script>
const shortid = require("shortid");
import axios from "axios";

export default {
  data: () => ({
    dialogClient: false,
    receivable: false,
    itemsPerPage: 5,
    dialogDelete: false,
    menu: false,
    totalSale: 0,
    dialog: false,
    stateAlert: false,
    editedItem: {},
    newClient: {},
    defaultNewClient: {
      client: "",
      identification: "",
      phone: "",
      direction: "",
    },
    saleItem: {
      id: "",
      product_id: "",
      existence: "",
      quantity: "",
      total_value: 0,
      unit_value: 0,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    items: [],
    clients: [],
    defaultSaleItem: {
      id: "",
      product_id: "",
      quantity: "",
      total_value: 0,
      unit_value: 0,
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
    headers: [
      {
        text: "Producto",
        value: "detail",
      },
      {
        text: "Cantidad",
        value: "quantity",
      },
      {
        text: "Valor Unitario",
        value: "unit",
      },
      {
        text: "Valor Total",
        value: "total",
      },
      { text: "Acción", value: "actions", sortable: false },
    ],
    listProducs: [],
    myArray: [],
  }),

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {

    getStatusProduct() {
      this.saleItem.unit_value = this.saleItem.product_id.saleValue;
      this.saleItem.existence = this.saleItem.product_id.existence;
      this.saleItem.barcode = this.saleItem.product_id.barcode;
    },

    async getClients() {
      let data = await axios.get("api/clients");
      this.clients = await data.data.clients;
    },


    calculateTotal() {
      this.saleItem.total_value = this.saleItem.unit_value * this.saleItem.quantity;
    },

    async getProducts() {
      let data = await axios.get("api/products");
      let products = await data.data.desserts;
      this.items = [];
      products.forEach((products) => {
        this.items.push({
          detail: products.detail,
          saleValue: products.sale_value,
          existence: products.existence,
          barcode: products.barcode,
          supplier: products.supplier,
          id: products.id,
        });
      });
    },

    async getProductsByBarcode() {
      let data = await axios.get(`api/products/getProductsByBarcode/${this.saleItem.barcode}`);
      let products = await data.data.products;
      console.log(products[0]);
      this.saleItem.product_id = products[0];
      this.saleItem.existence = products[0].existence;
      this.saleItem.unit_value = products[0].sale_value;
    },

    saveSaleProduct() {
      this.listProducs.push({
        product_id: this.saleItem.product_id.id,
        detail: this.saleItem.product_id.detail,
        existence: this.saleItem.product_id.existence,
        quantity: this.saleItem.quantity,
        unit: this.convert(this.saleItem.unit_value),
        total: this.convert(this.saleItem.total_value),
        date: this.saleItem.date,
        id: shortid.generate(),
      });
      this.calculateTotalSale();
      this.saleItem = Object.assign({}, this.defaultSaleItem);
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteSaleProduct(this.editedItem);
      this.closeDelete();
    },

    deleteSaleProduct(saleItem) {
      this.listProducs = this.listProducs.filter((item) => item.id !== saleItem.id);
      this.calculateTotalSale();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.saleItem = Object.assign({}, this.defaultSaleItem);
      });
    },

    calculateTotalSale() {
      let cont = 0;
      let value = 0;
      this.listProducs.forEach((item) => {
        value = parseInt(item.total.replace(/\./g, ''))
        cont = cont + value;
      });
      this.totalSale = this.convert(cont);
    },

    saveSale() {
      const id = shortid.generate();
      const data3 = {
        id: id,
        client_id: this.clients.id,
        date: this.listProducs[0].date,
      }
      this.listProducs.forEach((item) => {
        this.myArray.push(new Array(item.id, item.product_id, item.quantity, item.unit.replace(/\./g, ''), item.date, id));
      })
      this.setSale(this.myArray, data3);
    },

    async setSale(myArray, data3) {
      axios
        .post(`api/transactions/saveSale`, {
          data: myArray,
          data2: this.listProducs,
          data3: data3,
          receivable: this.receivable,
        })
        .then(() => {
          this.getProducts();
          this.receivable = false;
          this.myArray = [];
          this.stateAlert = true;
          this.totalSale = 0;
          this.listProducs = [];
          this.saleItem = Object.assign({}, this.defaultSaleItem);
          setTimeout(() => {
            this.stateAlert = false;
          }, "500");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    saveClient() {
      const id = shortid.generate();
      this.setClient(this.newClient, id);
      this.closeDialogClient();
    },

    closeDialogClient() {
      this.dialogClient = false;
      this.newClient = Object.assign({}, this.defaultNewClient);
    },

    async setClient(newClient, id) {
      axios
        .post(`api/clients`, {
          id: id,
          client: newClient.client,
          identification: newClient.identification,
          phone: newClient.phone,
          direction: newClient.direction,
        })
        .then(() => {
          this.getClients();
        })
        .catch((err) => {
          console.log(err);
        });
    },


    disabledForm() {
      if (
        this.saleItem.quantity > this.saleItem.existence ||
        this.saleItem.product_id === "" ||
        this.saleItem.quantity === "" ||
        this.saleItem.unit_value === "" ||
        this.saleItem.total_value === "" ||
        this.saleItem.date === ""
      ) {
        return true;
      }
    },


    disabledForm2() {
      const x = this.clients.id;
      if (this.receivable && !this.clients.id) {
        return true;
      }

      if (this.listProducs.length === 0) {
        return true;
      }

      return false
    },

    change() {
      receivable = !receivable;
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
    this.getProducts();
    this.getClients();
  },
};
</script>
    
<style lang="scss" scoped>
.sale {
  height: 550px;
  width: 100%;
  display: flex;

  &__left {
    width: 30%;
  }

  &__right {
    padding: 20px;
    width: 70%;
  }
}
</style>
    