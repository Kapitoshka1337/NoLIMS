//VUE
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
//SEMANTIC UI
import 'semantic-ui-css/semantic.min.css';
import SuiVue from 'semantic-ui-vue';
//COMPONENTS
import Hub from "./components/hub.vue";

import Reagent from "./components/reagent/main.vue";
import Storage from "./components/reagent/storage/index.vue";
import Arrivals from "./components/reagent/arrivals/index.vue";
import AppendArrivals from "./components/reagent/arrivals/create.vue";
import Expenses from "./components/reagent/expenses/index.vue";
import Location from "./components/reagent/location/index.vue";

Vue.use(SuiVue);
Vue.use(VueRouter);
Vue.component('Hub', Hub);

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Hub},
    { path: '/reagent', component: Reagent,
      children: [
        { path: 'storage', component: Storage },
        { path: 'arrivals', component: Arrivals },
        { path: 'arrivals/create', component: AppendArrivals }, //ПЕРЕДЕЛАТЬ
        { path: 'expenses', component: Expenses },
        { path: 'location', component: Location }
      ]
    }
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
