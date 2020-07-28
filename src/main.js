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

import Reagent from "./components/reagent/main.vue";
import Corrections from "./components/reagent/correction/index.vue";

import Storage from "./components/reagent/storage/index.vue";
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

Vue.use(SuiVue);
Vue.use(VueRouter);
Vue.component('Hub', Hub);

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Hub, meta: { requiresAuth: true } },
    { path: '/login', component: Login },
    { path: '/singup', component: Singup },
    { path: '/reagent', component: Reagent, meta: { requiresAuth: true, active: true },
      children: [
        { path: 'storage', component: Storage },
        { path: 'arrivals', component: Arrivals },
        { path: 'arrivals/create', component: AppendArrivals }, //ПЕРЕДЕЛАТЬ
        { path: 'moving', component: MovingReq },
        { path: 'moving/history', component: MovingHistory },
        { path: 'expenses', component: Expenses },
        { path: 'locations', component: Location },
        { path: 'corrections', component: Corrections }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth))
  {
    if(store.getters.isLoggedIn)
    {
      next();
      return;
    }
    next('/login');
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
