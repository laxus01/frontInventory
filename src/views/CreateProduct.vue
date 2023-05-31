<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Productos</v-banner
        >
      <ListProducts class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import ListProducts from "../components/ListProducts.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      ListProducts,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>
  