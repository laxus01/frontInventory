<template>
  <v-container>
    <v-dialog v-model="dialogProduct" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nuevo Producto</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Detalle*" v-model="newProduct.detail" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Valor Venta*" v-model="newProduct.saleValue" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Codigo Barra*" v-model="newProduct.barcode" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Existencia*" v-model="newProduct.existence" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialogProduct">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveProduct"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nuevo Proveedor</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Proveedor*" hint="Digite el nombre del proveedor" persistent-hint
                  v-model="supplierItem.supplier" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Nit*" hint="Digite el nit del proveedor" persistent-hint v-model="supplierItem.nit"
                  required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Telefono*" hint="Digite el telefono del proveedor" persistent-hint
                  v-model="supplierItem.phone" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Dirección*" hint="Digite la dirección del proveedor" persistent-hint
                  v-model="supplierItem.direction" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="close" text>
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" @click="setSupplier" text> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="shopping">
      <div class="shopping__left">
        <v-row>
          <v-col cols="12">
            <v-text-field label="No Factura*" v-model="shoppingItem.invoice_number" hide-details="auto"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete prepend-icon="production_quantity_limits" @click:prepend="dialogProduct = !dialogProduct"
              :items="items" return-object label="Producto*" item-value="value" item-text="detail"
              no-data-text="Producto no registrado" :menu-props="{ maxHeight: 100 }"
              v-model="shoppingItem.product_id"></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-autocomplete prepend-icon="person" @click:prepend="dialog = !dialog" :items="items2" return-object
              label="Proveedor*" hint="Seleccione el proveedor" item-value="value" item-text="supplier"
              no-data-text="Proveedor no registrado" :menu-props="{ maxHeight: 100 }"
              v-model="shoppingItem.supplier"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Cantidad*" v-model="shoppingItem.quantity" hide-details="auto"></v-text-field>
          </v-col>
          <v-col cols="6">
            <vuetify-money v-model="shoppingItem.total_value" label="Valor Total*" v-bind:clearable="clearable"
              v-bind:options="options" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="shoppingItem.date"
              transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="shoppingItem.date" label="Fecha*" hint="Seleccione la fecha" readonly
                  v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="shoppingItem.date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancelar
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(shoppingItem.date)">
                  Seleccionar
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="flex d-flex justify-center mb-6 bg-surface-variant">
          <v-col cols="4">
            <v-btn :disabled="disabledForm()" @click="saveShoppingProduct" class="mx-2" fab dark small color="primary">
              <v-icon dark> shopping_cart </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="shopping__right">
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
            <v-switch color="primary" label="Cuenta por pagar" v-model="payable" @change="change()">
            </v-switch>
          </v-col>
        </v-row>
        <v-row class="flex d-flex justify-center mb-6 bg-surface-variant">
          <v-col cols="4">
            <v-btn block class="text-none mt-5 mb-4" color="primary" size="x-large" variant="flat"
              :disabled="listProducs.length === 0" @click="saveShopping">
              Registrar Compra
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
    dialogProduct: false,
    dialog: false,
    payable: false,
    itemsPerPage: 5,
    dialogDelete: false,
    menu: false,
    totalSale: 0,
    dialog: false,
    stateAlert: false,
    newProduct: {},
    editedItem: {},
    supplierItem: {},
    defaultnewProduct: {
      detail: "",
      saleValue: "",
      barcode: "",
      existence: "",
      supplier: "",
      id: "",
    },
    defaultSupplierItem: {
      detail: "",
      saleValue: "",
      barcode: "",
      existence: "",
      supplier: "",
      id: "",
    },
    shoppingItem: {
      id: "",
      invoice_number: "",
      product_id: "",
      supplier_id: "",
      quantity: "",
      available: "",
      total_value: "",
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultShoppingItem: {
      id: "",
      invoice_number: "",
      product_id: "",
      supplier_id: "",
      quantity: "",
      available: "",
      total_value: "",
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    items: [],
    items2: [],
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

    async getSuppliers() {
      let data = await axios.get("api/suppliers");
      this.items2 = await data.data.suppliers;
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

    saveShoppingProduct() {
      this.listProducs.push({
        product_id: this.shoppingItem.product_id.id,
        detail: this.shoppingItem.product_id.detail,
        quantity: this.shoppingItem.quantity,
        unit: this.convert(this.shoppingItem.total_value / this.shoppingItem.quantity),
        total: this.convert(this.shoppingItem.total_value),
        date: this.shoppingItem.date,
        invoice_number: this.shoppingItem.invoice_number,
        supplier_id: this.shoppingItem.supplier.id,
        id: shortid.generate(),
      });
      this.calculateTotalShopping();
      this.shoppingItem.product_id = "";
      this.shoppingItem.quantity = "";
      this.shoppingItem.total_value = "";
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteSaleProduct(this.editedItem);
      this.dialogDelete = false;
    },

    deleteSaleProduct(shoppingItem) {
      this.listProducs = this.listProducs.filter((item) => item.id !== shoppingItem.id);
      this.calculateTotalShopping();
    },

    calculateTotalShopping() {
      let cont = 0;
      let value = 0;
      this.listProducs.forEach((item) => {
        value = parseFloat(this.replaceData(item.total));
        cont = cont + value;
      });
      this.totalSale = this.convert(cont);
    },

    saveShopping() {
      const id = shortid.generate();
      const data3 = {
        id: id,
        supplier_id: this.shoppingItem.supplier.id,
        date: this.listProducs[0].date,
      }
      this.listProducs.forEach((item) => {
        this.myArray.push(new Array(item.id, item.invoice_number, item.product_id, item.supplier_id, this.replaceData(item.unit), item.quantity, this.replaceData(item.total), id, item.date));
      })
      this.setShopping(this.myArray, data3);
    },

    async setShopping(myArray, data3) {
      axios
        .post(`api/transactions/saveShopping`, {
          data: myArray,
          data2: this.listProducs,
          data3: data3,
          payable: this.payable,
        })
        .then(() => {
          this.getProducts();
          this.payable = false;
          this.myArray = [];
          this.stateAlert = true;
          this.totalSale = 0;
          this.listProducs = [];
          setTimeout(() => {
            this.stateAlert = false;
          }, "500");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    close() {
      this.dialog = false;
      this.supplierItem = Object.assign({}, this.defaultSupplierItem);
    },

    async setSupplier() {
      const id = shortid.generate();
      axios
        .post(`api/suppliers`, {
          id: id,
          nit: this.supplierItem.nit,
          phone: this.supplierItem.phone,
          direction: this.supplierItem.direction,
          supplier: this.supplierItem.supplier,
        })
        .then(() => {
          this.close();
          this.getSuppliers();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    saveProduct() {
      const id = shortid.generate();
      this.setProduct(this.newProduct, id);
      this.closeDialogProduct();
    },

    closeDialogProduct() {
      this.dialogProduct = false;
      this.newProduct = Object.assign({}, this.defaultnewProduct);
    },

    async setProduct(newProduct, id) {
      axios
        .post(`api/products`, {
          id: id,
          detail: newProduct.detail,
          sale_value: newProduct.saleValue,
          existence: newProduct.existence,
          barcode: newProduct.barcode,
        })
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err);
        });
    },


    disabledForm() {
      if (
        this.shoppingItem.invoice_number === "" ||
        !this.shoppingItem.supplier ||
        !this.shoppingItem.product_id ||
        this.shoppingItem.quantity === "" ||
        this.shoppingItem.total_value === "" ||
        this.shoppingItem.date === ""
      ) {
        return true;
      }
    },

    change() {
      payable = !payable;
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
    this.getSuppliers();
  },
};

</script>
      
<style lang="scss" scoped>
.shopping {
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
      