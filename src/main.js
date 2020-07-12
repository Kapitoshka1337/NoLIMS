//VUE
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
//SEMANTIC UI
import 'semantic-ui-css/semantic.min.css';
import SuiVue from 'semantic-ui-vue';
//COMPONENTS
import Hub from "./components/hub.vue";
import Equipment from "./components/equipment/main.vue";
import Metrolog from "./components/equipment/metrolog/index.vue";
import MetrologEquipment from "./components/equipment/metrolog/equipment.vue";

Vue.use(SuiVue);
Vue.use(VueRouter);
Vue.component('Hub', Hub);

var router = new VueRouter({
  routes: [
    { path: '/', component: Hub},
    { path: '/equipment', component: Equipment,
      children: [
        {
          path: 'metrolog', component: Metrolog,
          children: [
            { path: 'equipments', component: MetrologEquipment}
          ]
        }
      ]
    },
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
