//VUE
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import store from './components/store/store.js';
//SEMANTIC UI
import 'semantic-ui-css/semantic.min.css';
import SuiVue from 'semantic-ui-vue';
//AXIOS
import Axios from 'axios';
//COMPONENTS
import Login from "./components/auth/login.vue";
import Singup from "./components/auth/singup.vue";
import Hub from "./components/hub.vue";
import MenuNav from './components/reagent/menu.vue';

import Reagent from "./components/reagent/main.vue";
import Corrections from "./components/reagent/correction/index.vue";

import Storage from "./components/reagent/storage/index.vue";
import Archive from "./components/reagent/archive/index.vue";
import Arrivals from "./components/reagent/arrivals/index.vue";
import AppendArrivals from "./components/reagent/arrivals/create.vue";
import Expenses from "./components/reagent/expenses/index.vue";
import MovingReq from "./components/reagent/moving/request.vue";
import MovingHistory from "./components/reagent/moving/history.vue";
import Location from "./components/reagent/location/index.vue";

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
if(process.env.NODE_ENV === 'production') Vue.prototype.env='http://laravel/api/';
else Vue.prototype.env='/api/';

Vue.use(SuiVue);
Vue.use(VueRouter);
Vue.component('menu-nav', MenuNav);

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
        { path: 'arrivals/create', component: AppendArrivals,  meta: { roles: [1, 2, 3] } }, //ПЕРЕДЕЛАТЬ
        { path: 'moving', component: MovingReq, meta: { roles: [2, 3] } },
        { path: 'moving/history', component: MovingHistory, meta: { roles: [2, 3] } },
        { path: 'expenses', component: Expenses,  meta: { roles: [1, 2, 3] } },
        { path: 'locations', component: Location,  meta: { roles: [1, 2, 3] } },
        { path: 'corrections', component: Corrections, meta: { roles: [2, 3] } }
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
  store: store
})
