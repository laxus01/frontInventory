<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount">Cuentas por cobrar</v-banner>
      <ListReceivable class="top" />
    </v-card>
  </v-container>
</template>
  
<script>
import ListReceivable from "../components/ListReceivable.vue";

export default {
  data() {
    return {}
  },
  components: {
    ListReceivable,
  },
};
</script>
  
<style>
.top {
  margin-top: 20px;
}
</style>
  