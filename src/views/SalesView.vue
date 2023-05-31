<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount">Ventas</v-banner>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab @click="state = !state">Registrar</v-tab>
        <v-tab @click="state = !state">Listado</v-tab>
      </v-tabs>
      <ListShopping class="top" v-if="!state"/>
      <NewShopping class="top" v-if="state"/>
    </v-card>
  </v-container>
</template>
  
<script>
import ListShopping from "../components/ListSales.vue";
import NewShopping from "../components/NewSale.vue";

export default {
    data: () => ({
      state: true,
    }),
    components: {
      ListShopping,
      NewShopping
    },
  }
</script>
  
<style>
.top {
  margin-top: 20px;
}
</style>
  