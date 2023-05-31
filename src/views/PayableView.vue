<template>
  <v-container>
    <v-card class="cards" elevation="5">
      <v-banner color="blue darken-3" dark elevation="7" icon="$mdiAccount">Cuentas por pagar</v-banner>
      <ListPayable class="top" />
    </v-card>
  </v-container>
</template>
  
<script>
import ListPayable from "../components/ListPayable.vue";

export default {
  data() {
    return {}
  },
  components: {
    ListPayable,
  },
};
</script>
  
<style>
.top {
  margin-top: 20px;
}
</style>
  