import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

import CreateProduct from '../views/CreateProduct'
import SuppliersView from '../views/SuppliersView'
import ClientsView from '../views/ClientsView'
import ShoppingView from '../views/ShoppingView'
import SalesView from '../views/SalesView'
import Dashboard from '../views/Dashboard'
import GraphicState from '../views/GraphicState'
import Utilities from '../views/Utilities'
import PayableView from '../views/PayableView'
import ReceivableView from '../views/ReceivableView'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',  
    component: HomeView  
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '/register-product',
        name: 'RegisterProduct',
        component: CreateProduct,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/list-suppliers',
        name: 'ListSuppliers',
        component: SuppliersView,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/detail-utilities',
        name: 'DetailUtilities',
        component: Utilities,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/list-clients',
        name: 'ListClients',
        component: ClientsView,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/list-shopping',
        name: 'ListShopping',
        component: ShoppingView,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/list-sales',
        name: 'ListSales',
        component: SalesView,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/list-receivable',
        name: 'ListReceivalbe',
        component: ReceivableView,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/list-payable',
        name: 'ListPayable',
        component: PayableView,
        meta: {
          requiresAuth: true,
        },  
      },
      {
        path: '/graphic-state',
        name: 'GraphicState',    
        props: true,
        component: GraphicState,
        meta: {
          requiresAuth: true,
        },  
      },
    ],  
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
