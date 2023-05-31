<template>
  <div>
    <vuetify-money v-model="value" v-bind:label="label" v-bind:clearable="clearable" v-bind:options="options"/>
  </div>
</template>
<script>
export default {

  data: () => ({
    clearable: true,
    options: {
      locale: "pt-CO",
      prefix: "$",
      suffix: "",
      length: 11,
      precision: 2
    },
  }),
  props: {
    label: "",
    value: "",
  },
  methods: {
    mandarDatos() {
      this.$emit("closeModalCredit");
    }
  }
};
</script>