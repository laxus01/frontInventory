<template>
    <v-container>
      <v-card class="cards" elevation="5">
        <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount"
          >Utilidades</v-banner
        >
      <DetailUtilities class="top"/>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import DetailUtilities from "../components/DetailUtilities.vue";
  
  export default {
    data() {
        return {}
    },
    components: {
      DetailUtilities,
    },
  };
  </script>
  
  <style>
  .top {
    margin-top: 20px;
  }
  </style>