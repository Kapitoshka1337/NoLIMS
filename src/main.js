//VUE
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
//VUEX
import store from './components/store/store.js';
//SEMANTIC UI
import 'semantic-ui-css/semantic.min.css';
import SuiVue from 'semantic-ui-vue';
//VUETIFY
import vuetify from './plugins/vuetify.js';
//AXIOS
import Axios from 'axios';
import Convert from './components/reagent/convert.js';
//COMPONENTS
import Login from "./components/auth/login.vue";
import Singup from "./components/auth/singup.vue";
import Hub from "./components/hub.vue";
import MenuNav from './components/reagent/menu.vue';
//REAGENT
import Reagent from "./components/reagent/main.vue";
import Corrections from "./components/reagent/correction/index.vue";
import Storage from "./components/reagent/storage/index.vue";
import Archive from "./components/reagent/archive/index.vue";
import Arrivals from "./components/reagent/arrivals/index.vue";
import AppendArrivals from "./components/reagent/arrivals/create.vue";
import Expenses from "./components/reagent/expenses/index.vue";
import Writreoff from "./components/reagent/writeoff/index.vue";
import MovingReq from "./components/reagent/moving/request.vue";
import MovingHistory from "./components/reagent/moving/history.vue";
import Location from "./components/reagent/location/index.vue";
//EQUIPMENT
import MenuEquipment from './components/equipment/menu.vue';
import Equipment from "./components/equipment/main.vue";
import Metrolog from "./components/equipment/metrolog/index.vue";
import MetrologEquipment from "./components/equipment/metrolog/equipment.vue";
import MetrologEquipmentDetails from "./components/equipment/metrolog/detail.vue";
import MetrologVerification from "./components/equipment/metrolog/verification.vue";


Vue.prototype.$http = Axios;
Vue.prototype.$convert = Convert;
const token = localStorage.getItem('token');
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
//  if(process.env.NODE_ENV === 'production') Vue.prototype.$http.defaults.baseURL = 'http://192.168.0.152';
//  else Vue.prototype.$http.defaults.baseURL = 'http://laravel';

Vue.use(SuiVue);
Vue.use(VueRouter);
Vue.component('menu-nav', MenuNav);
Vue.component('menu-equipment', MenuEquipment);

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login, meta: { requiresAuth: false, roles: [] } },
    { path: '/singup', component: Singup, meta: { requiresAuth: false, roles: [] } },
    { path: '/', component: Hub, meta: { requiresAuth: true, roles: [0, 1, 2, 3] } },
    { path: '/reagent', component: Reagent, meta: { requiresAuth: true, roles: [1, 2, 3] },
      children: [
        { path: 'storage', component: Storage, meta: { roles: [1, 2, 3] } },
        { path: 'archive', component: Archive,  meta: { roles: [1, 2, 3] } },
        { path: 'arrivals', component: Arrivals,  meta: { roles: [1, 2, 3] } },
        { path: 'arrivals/create', component: AppendArrivals,  meta: { roles: [2, 3] } }, //ПЕРЕДЕЛАТЬ
        { path: 'moving', component: MovingReq, meta: { roles: [2, 3] } },
        { path: 'moving/history', component: MovingHistory, meta: { roles: [2, 3] } },
        { path: 'expenses', component: Expenses,  meta: { roles: [1, 2, 3] } },
        { path: 'writeoff', component: Writreoff,  meta: { roles: [1, 2, 3] } },
        { path: 'locations', component: Location,  meta: { roles: [1, 2, 3] } },
        { path: 'corrections', component: Corrections, meta: { roles: [2, 3] } }
      ]
    },
    { path: '/equipment', component: Equipment, meta: { requiresAuth: true, roles: [1, 2, 3] },
      children: [
        { path: 'metrolog', component: Metrolog, meta: { roles: [1, 2, 3] },
          children: [
            { path: 'equipments', component: MetrologEquipment, meta: { roles: [1, 2, 3] } },
            { path: 'equipments/:id', props: true, name: 'details', component: MetrologEquipmentDetails, meta: { roles: [1, 2, 3] } },
            { path: 'verification', component: MetrologVerification, meta: { roles: [1, 2, 3] } },
          ]
        },
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuth = to.matched.some(record => record.meta.requiresAuth);
  const isRoles = to.matched.some(record => record.meta.roles);
  const roles = to.meta.roles;
  if(isAuth && isRoles)
  {
    if(!store.getters.isLoggedIn)
    {
      next('/login');
    }

    if(store.getters.isLoggedIn && roles.includes(store.getters.isRoles))
    {
      return next();
    }
    else alert('У вас нет доступа!');
  }
  else
  {
    next();
  }
});
new Vue({
  el: '#app',
  router: router,
  render: h => h(App),
  vuetify,
  store: store
})
