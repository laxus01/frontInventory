<template>
  <v-list dense>
    <template>
      <v-list dense>
        <template>
          <div v-for="item in items" :key="item.title">
            <v-list-group
              v-if="item.items"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
              link
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                :to="subItem.to"
              >
                <v-list-item-icon>
                  <v-icon v-text="subItem.action"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item v-else :to="item.to" link>
              <v-list-item-icon>
                <v-icon v-text="item.action"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </template>
  </v-list>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      items: [   
        {
          action: "inventory",
          title: "Información",
          items: [
            {
              action: "production_quantity_limits",
              title: "Productos",
              to: "/register-product",
            },
            {
              action: "account_circle",
              title: "Clientes",
              to: "/list-clients",
            },
            {
              action: "account_box",
              title: "Proveedores",
              to: "/list-suppliers",
            },
          ],
        },  
        {
          action: "paid",
          title: "Transacciones",
          items: [
            {
              action: "login",
              title: "Compras",
              to: "/list-shopping",
            },
            {
              action: "logout",
              title: "Ventas",
              to: "/list-sales",
            },
          ],
        },   
        {
          action: "contact_page",
          title: "Cuentas",
          items: [
            {
              title: "Por Pagar",
              action: "contact_page",
              to: "/list-payable",
            },
            {
              title: "Por Cobrar",
              action: "contact_page",
              to: "/list-receivable",
            },
          ],
        },
        {
          action: "assignment",
          title: "Informes",
          items: [
            {
              title: "Utilidades",
              action: "article",
              to: "/detail-utilities",
            },
          ],
        },
        {
          action: "assessment",
          title: "Estadisticas",
          items: [
            {
              title: "Ingresos vs Egresos",
              action: "assessment",
              to: "/graphic-state",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped></style>
