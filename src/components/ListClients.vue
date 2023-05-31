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
                    <v-text-field label="Cliente*" v-model="editedItem.client" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Identificación*" v-model="editedItem.identification" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Telefono*" v-model="editedItem.phone" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="Dirección*" v-model="editedItem.direction" required></v-text-field>
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
            <v-card-title class="text-h5">Esta seguro de eliminar este cliente?</v-card-title>
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
    search: "",
    desserts: [],
    headers: [
      {
        text: "Identificación",
        value: "identification",
      },
      {
        text: "Cliente",
        value: "client",
      },
      {
        text: "Telefono",
        value: "phone",
      },
      {
        text: "Dirección",
        value: "direction",
      },
      { text: "Acción", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    search: "",
    dialog: false,
    dialogDelete: false,
    desserts: [],
    editedItem: {},
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Editar Cliente";
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
    async getClients() {
      let data = await axios.get("api/clients");
      this.desserts = await data.data.clients;
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
      this.deleteClient(this.editedItem);
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
        this.updateClient(this.editedItem);
      } else {
        const id = shortid.generate();
        this.setClient(this.editedItem, id);
      }
      this.close();
    },

    async updateClient(editedItem) {
      axios
        .put(`api/clients/update/${editedItem.id}`, {
          id: editedItem.id,
          identification: editedItem.identification,
          client: editedItem.client,
          phone: editedItem.phone,
          direction: editedItem.direction,
        })
        .then(() => {
          this.getClients();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async deleteClient(editedItem) {
      axios
        .put(`api/clients/inactivate/${editedItem.id}`)
        .then(() => {
          this.getClients();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async setClient(editedItem, id) {
      axios
        .post(`api/clients`, {
          id: id,
          client: editedItem.client,
          identification: editedItem.identification,
          phone: editedItem.phone,
          direction: editedItem.direction,
        })
        .then(() => {
          this.getClients();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getClients();
  },
};
</script>
  
<style>
.table {
  top: 20px;
}
</style>
  