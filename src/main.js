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
import Equipment from "./components/equipment/index.vue";
import EquipmentMain from "./components/equipment/main.vue";
import Department from "./components/equipment/department/index.vue";
import DepartmentEquipment from "./components/equipment/department/equipment.vue";
import DepartmentEquipmentDetails from "./components/equipment/department/detail/index.vue";
import Metrolog from "./components/equipment/metrolog/index.vue";
import MetrologEquipment from "./components/equipment/metrolog/equipment.vue";
import MetrologEquipmentDetails from "./components/equipment/metrolog/detail/index.vue";
import MetrologVerification from "./components/equipment/metrolog/verification/index.vue";
import MetrologRepair from "./components/equipment/metrolog/repair/index.vue";
import MetrologInstructions from "./components/equipment/metrolog/instructions/index.vue";
import MetrologMaintenance from "./components/equipment/metrolog/maintenance/index.vue";
//GZ
import GzMain from "./components/gz/main.vue";
import GzIndex from "./components/gz/index/index.vue";
import GzAnimal from "./components/gz/animal/index.vue";
import GzMethods from "./components/gz/methods/index.vue";
import GzPlan from "./components/gz/plan/index.vue";
import GzReport from "./components/gz/report/index.vue";

Vue.prototype.$http = Axios;
Vue.prototype.$convert = Convert;
const token = localStorage.getItem('token');
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
if(process.env.NODE_ENV === 'production') Vue.prototype.$http.defaults.baseURL = 'http://192.168.0.156';

Vue.use(SuiVue);
Vue.use(VueRouter);

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login, meta: { requiresAuth: false, roles: [] } },
    { path: '/singup', component: Singup, meta: { requiresAuth: false, roles: [] } },
    { path: '/', component: Hub, meta: { requiresAuth: true, roles: [0, 1, 2, 3, 4, 5] } },
    { path: '/reagent', component: Reagent, meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
      children: [
        { path: 'storage', component: Storage, meta: { roles: [1, 2, 3, 4] } },
        { path: 'archive', component: Archive,  meta: { roles: [1, 2, 3, 4] } },
        { path: 'arrivals', component: Arrivals,  meta: { roles: [1, 2, 3, 4] } },
        { path: 'arrivals/create', component: AppendArrivals,  meta: { roles: [2, 3] } }, //ПЕРЕДЕЛАТЬ
        { path: 'moving', component: MovingReq, meta: { roles: [1, 2, 3, 4] } },
        { path: 'moving/history', component: MovingHistory, meta: { roles: [2, 3] } },
        { path: 'expenses', component: Expenses,  meta: { roles: [1, 2, 3, 4] } },
        { path: 'writeoff', component: Writreoff,  meta: { roles: [1, 2, 3, 4] } },
        { path: 'locations', component: Location,  meta: { roles: [1, 2, 3, 4] } },
        { path: 'corrections', component: Corrections, meta: { roles: [2, 3] } }
      ]
    },
    { path: '/equipment', component: Equipment, meta: { requiresAuth: true, roles: [1, 2, 4, 5] },
      children: [
        { path: 'main', component: EquipmentMain, meta: { roles: [1, 2, 4, 5] } },
        { path: 'department', component: Department, meta: { roles: [1, 2, 4, 5] },
          children: [
            { path: 'equipments', component: DepartmentEquipment, meta: { roles: [1, 2, 4, 5] } },
            { path: 'equipments/:id', props: true, name: 'details', component: DepartmentEquipmentDetails, meta: { roles: [1, 2, 4, 5] } }
          ]
        },
        { path: 'metrolog', component: Metrolog, meta: { roles: [4] },
          children: [
            { path: 'equipments', component: MetrologEquipment, meta: { roles: [4] } },
            { path: 'equipments/:id', props: true, name: 'details', component: MetrologEquipmentDetails, meta: { roles: [4] } },
            { path: 'verification', component: MetrologVerification, meta: { roles: [4] } },
            { path: 'instructions', component: MetrologInstructions, meta: { roles: [4] } },
            { path: 'maintenances', component: MetrologMaintenance, meta: { roles: [4] } },
          ]
        },
        { path: 'repair', component: MetrologRepair, meta: { roles: [4, 5] } },
      ]
    },
    { path: '/gz', component: GzMain, meta: { requiresAuth: true, roles: [6] },
      children: [
        { path: 'index', component: GzIndex, meta: { roles: [6] } },
        { path: 'animals', component: GzAnimal, meta: { roles: [6] } },
        { path: 'methods', component: GzMethods, meta: { roles: [6] } },
        { path: 'report', component: GzReport, meta: { roles: [6] } },
        { path: 'plan', component: GzPlan, meta: { roles: [6] } },
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
    else {alert('У вас нет доступа!')}
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
