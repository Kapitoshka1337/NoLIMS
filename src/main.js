//VUE
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
//VUEX
import store from "./components/store/store.js";
//SEMANTIC UI
import "semantic-ui-css/semantic.min.css";
import SuiVue from "semantic-ui-vue";
//VUETIFY
import vuetify from "./plugins/vuetify.js";
//AXIOS
import Axios from "axios";
import Convert from "./components/reagent/convert.js";
//COMPONENTS
import Login from "./components/auth/login.vue";
import Singup from "./components/auth/singup.vue";
import Hub from "./components/hub.vue";
//REAGENT
import Reagent from "./components/reagent/index.vue";
import ReagentDashboard from "./components/reagent/main.vue";
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
//import DepartmentVerification from "./components/equipment/department/verification/index.vue";
import Metrolog from "./components/equipment/metrolog/index.vue";
import MetrologEquipment from "./components/equipment/metrolog/equipment.vue";
import MetrologEquipmentDetails from "./components/equipment/components/detail/index.vue";
import MetrologVerification from "./components/equipment/metrolog/verification/index.vue";
import MetrologRepair from "./components/equipment/metrolog/repair/index.vue";
import MetrologInstructions from "./components/equipment/metrolog/instructions/index.vue";
import MetrologMaintenance from "./components/equipment/metrolog/services/index.vue";
import Calendar from "./components/equipment/components/calendar/index.vue";
//Researches
// import ResearchesMain from "./components/researches/main.vue";
// import ResearchesIndex from "./components/researches/index/index.vue";
// import ResearchesSamples from "./components/researches/samples/index.vue";
// import ResearchesIndicator from "./components/researches/indicator/index.vue";
// import ResearchesDirection from "./components/researches/direction/index.vue";
//Users
import UserMain from "./components/users/main.vue";
import UserIndex from "./components/users/users/index.vue";
//GZ
// import GzMain from "./components/gz/main.vue";
// import GzIndex from "./components/gz/index/index.vue";
// import GzAnimal from "./components/gz/animal/index.vue";
// import GzMethods from "./components/gz/methods/index.vue";
// import GzPlan from "./components/gz/plan/index.vue";
// import GzReport from "./components/gz/report/index.vue";

Vue.prototype.$http = Axios;
Vue.prototype.$convert = Convert;
const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] =
    "Bearer " + token;
}
if (process.env.NODE_ENV === "production")
  // Vue.prototype.$http.defaults.baseURL = "http://nolims/public/";
Vue.prototype.$http.defaults.baseURL = 'http://192.168.0.156';

Vue.use(SuiVue);
Vue.use(VueRouter);

var router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/login",
      component: Login,
      meta: { requiresAuth: false, roles: [] }
    },
    {
      path: "/singup",
      component: Singup,
      meta: { requiresAuth: false, roles: [] }
    },
    {
      path: "/",
      component: Hub,
      meta: { name: "hub", requiresAuth: true, roles: [0, 1, 2, 3, 4, 5, 6] }
    },
    {
      path: "/reagent",
      component: Reagent,
      meta: { name: "reagent", requiresAuth: true, roles: [1, 2, 3, 4] },
      children: [
        {
          path: "",
          component: ReagentDashboard,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "storage",
          component: Storage,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "archive",
          component: Archive,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "arrivals",
          component: Arrivals,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "arrivals/create",
          component: AppendArrivals,
          meta: { name: "reagent", roles: [2, 3] }
        }, //ПЕРЕДЕЛАТЬ
        {
          path: "moving",
          component: MovingReq,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "moving/history",
          component: MovingHistory,
          meta: { name: "reagent", roles: [2, 3] }
        },
        {
          path: "expenses",
          component: Expenses,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "writeoff",
          component: Writreoff,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "locations",
          component: Location,
          meta: { name: "reagent", roles: [1, 2, 3, 4] }
        },
        {
          path: "corrections",
          component: Corrections,
          meta: { name: "reagent", roles: [2, 3] }
        }
      ]
    },
    {
      path: "/equipment",
      component: Equipment,
      meta: { name: "equipment", requiresAuth: true, roles: [1, 2, 4, 5] },
      children: [
        {
          path: "",
          component: EquipmentMain,
          meta: { name: "equipment", roles: [1, 2, 4, 5] }
        },
        {
          path: "department",
          component: Department,
          meta: { name: "equipment", roles: [1, 2, 4, 5] },
          children: [
            {
              path: "equipments",
              component: DepartmentEquipment,
              meta: { name: "equipment", roles: [1, 2, 4, 5] }
            },
            {
              path: "equipments/:id",
              props: true,
              name: "details",
              component: MetrologEquipmentDetails,
              meta: { name: "equipment", roles: [1, 2, 4, 5] }
            }
            //{ path: 'verification', component: DepartmentVerification, meta: { name: 'equipment', roles: [1, 2, 4, 5] } },
          ]
        },
        {
          path: "metrolog",
          component: Metrolog,
          meta: { name: "equipment", roles: [4] },
          children: [
            {
              path: "equipments",
              component: MetrologEquipment,
              meta: { name: "equipment", roles: [4] }
            },
            {
              path: "equipments/:id",
              props: true,
              name: "details",
              component: MetrologEquipmentDetails,
              meta: { name: "equipment", roles: [4] }
            },
            {
              path: "verification",
              component: MetrologVerification,
              meta: { name: "equipment", roles: [4] }
            },
            {
              path: "instructions",
              component: MetrologInstructions,
              meta: { name: "equipment", roles: [4] }
            },
            {
              path: "services",
              component: MetrologMaintenance,
              meta: { name: "equipment", roles: [4] }
            },
            {
              path: "calendar",
              component: Calendar,
              meta: { name: "equipment", roles: [4] }
            }
          ]
        },
        {
          path: "repair",
          component: MetrologRepair,
          meta: { name: "equipment", roles: [4, 5] }
        }
      ]
    },
    // {
    //   path: "/researches",
    //   component: ResearchesMain,
    //   meta: { name: "researches", requiresAuth: true, roles: [4] },
    //   children: [
    //     {
    //       path: "",
    //       component: ResearchesIndex,
    //       meta: { name: "researches", roles: [4] }
    //     },
    //     {
    //       path: "samples",
    //       component: ResearchesSamples,
    //       meta: { name: "researches", roles: [4] }
    //     },
    //     {
    //       path: "indicator",
    //       component: ResearchesIndicator,
    //       meta: { name: "researches", roles: [4] }
    //     },
    //     {
    //       path: "direction",
    //       component: ResearchesDirection,
    //       meta: { name: "direction", roles: [4] }
    //     }
    //   ]
    // },
    {
      path: "/users",
      component: UserMain,
      meta: { name: "users", requiresAuth: true, roles: [4] },
      children: [
        {
          path: "",
          component: UserIndex,
          meta: { name: "users", roles: [4] }
        }
      ]
    },
    // { path: '/gz', component: GzMain, meta: { name: 'gz', requiresAuth: true, roles: [6] },
    //   children: [
    //     { path: '', component: GzIndex, meta: { name: 'gz', roles: [6] } },
    //     { path: 'animals', component: GzAnimal, meta: { name: 'gz', roles: [6] } },
    //     { path: 'methods', component: GzMethods, meta: { name: 'gz', roles: [6] } },
    //     { path: 'report', component: GzReport, meta: { name: 'gz', roles: [6] } },
    //     { path: 'plan', component: GzPlan, meta: { name: 'gz', roles: [6] } },
    //   ]
    // },
    {
      path: "*",
      redirect: "/login"
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuth = to.matched.some(record => record.meta.requiresAuth);
  const isRoles = to.matched.some(record => record.meta.roles);
  const roles = to.meta.roles;
  if (isAuth && isRoles) {
    if (!store.getters.isLoggedIn) {
      next("/login");
    }

    if (store.getters.isLoggedIn && roles.includes(store.getters.isRoles)) {
      return next();
    } else {
      alert("У вас нет доступа!");
    }
  } else {
    next();
  }
});
new Vue({
  el: "#app",
  router: router,
  render: h => h(App),
  vuetify,
  store: store
});
