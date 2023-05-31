<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Proveedores</v-banner
        >
      <ListSuppliers class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListSuppliers from "../components/ListSuppliers.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListSuppliers,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  