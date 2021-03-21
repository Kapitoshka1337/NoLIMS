<template>
    <v-row>
      <v-navigation-drawer v-model="drawer" dark app>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Оборудование
              </v-list-item-title>
              <v-list-item-subtitle>
                БУ УР "УВДЦ"
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item to="/equipment">
              <v-list-item-icon>
                <v-icon color="purple">mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Главная</v-list-item-title>
            </v-list-item>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="green">mdi-pencil-ruler</v-icon>
                </v-list-item-icon>
                  <v-list-item-title>Метролог</v-list-item-title>
              </template>
              <v-list-item to="/equipment/metrolog/equipments">
                  <v-list-item-title>Оборудование</v-list-item-title>
              </v-list-item>
              <v-list-item to="/equipment/metrolog/verification">
                  <v-list-item-title>Поверки</v-list-item-title>
              </v-list-item>
              <v-list-item to="/equipment/metrolog/instructions">
                  <v-list-item-title>Инструкции</v-list-item-title>
              </v-list-item>
              <v-list-item to="/equipment/metrolog/services">
                  <v-list-item-title>ТО</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-factory</v-icon>
                </v-list-item-icon>
                  <v-list-item-title>Подразделения</v-list-item-title>
              </template>
              <v-list-item to="/equipment/department/equipments">
                  <v-list-item-title>Оборудование</v-list-item-title>
              </v-list-item>
              <!--<v-list-item to="/equipment/department/verification">
                  <v-list-item-title>Поверки</v-list-item-title>
              </v-list-item>-->
            </v-list-group>
              <v-list-item to="/equipment/metrolog/calendar">
                  <v-list-item-icon>
                    <v-icon color="orange">mdi-calendar-month-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Календарь работ</v-list-item-title>
              </v-list-item>
              <v-list-item to="/equipment/repair">
                <v-list-item-icon>
                  <v-icon color="red">mdi-bug</v-icon>
                </v-list-item-icon>
                  <v-list-item-title>Ремонт</v-list-item-title>
              </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar color="primary" dense dark app>
          <v-app-bar-nav-icon v-on:click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Оборудование</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{user}} ({{idDep}})</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogGuide = true">
            <v-icon>mdi-help-circle-outline</v-icon>
            <guide v-bind:dialog-open="dialogGuide" @close="dialogClose()"></guide>
          </v-btn>
          <v-btn icon to="/">
            <v-icon>mdi-home-circle-outline</v-icon>
          </v-btn>
          <v-btn icon @click="logout">
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </v-app-bar>
        <v-main>
          <v-container fluid>
            <router-view></router-view>
          </v-container>
        </v-main>
    </v-row>
</template>

<script>
import guide from './../guide/index.vue';

export default {
  components: {
    guide: guide
  },
  data () {
    return {
      drawer: false,
      dialogGuide: false
    }
  },
  methods: {
    logout(){
      this.$store.dispatch('logout').then(() => {
      this.$router.push('/login')});
    },
    dialogClose(data){
      this.dialogGuide = data;
    }
  },
  computed: {
    user(){
      return this.$store.getters.name;
    },
    idDep(){
      return this.$store.getters.idDepartment;
		}
  }
}
</script>