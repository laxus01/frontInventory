<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Clientes</v-banner
        >
      <ListClients class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListClients from "../components/ListClients.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListClients,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  