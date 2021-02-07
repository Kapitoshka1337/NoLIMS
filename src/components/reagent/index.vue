<template>
  <v-row>
      <v-navigation-drawer v-model="drawer" dark app absolute>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Реактив
              </v-list-item-title>
              <v-list-item-subtitle>
                БУ УР "УВДЦ"
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item to="/reagent">
              <v-list-item-icon>
                <v-icon color="purple">mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Главная</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/storage">
              <v-list-item-icon>
                <v-icon color="green">mdi-package-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Склад</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/archive">
              <v-list-item-icon>
                <v-icon color="blue">mdi-package-variant-closed</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Архив</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/corrections">
              <v-list-item-icon>
                <v-icon color="orange">mdi-alert</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Ошибки</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/arrivals">
              <v-list-item-icon>
                <v-icon color="teal">mdi-package-up</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Поступления</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/expenses">
              <v-list-item-icon>
                <v-icon color="red">mdi-history</v-icon>
              </v-list-item-icon>
              <v-list-item-title>История расхода</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/locations">
              <v-list-item-icon>
                <v-icon color="yellow">mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Места хранения</v-list-item-title>
            </v-list-item>
            <v-list-item to="/reagent/writeoff">
              <v-list-item-icon>
                <v-icon color="orange">mdi-content-copy</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Списание</v-list-item-title>
            </v-list-item>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-folder-swap</v-icon>
                </v-list-item-icon>
                  <v-list-item-title>Передача</v-list-item-title>
              </template>
              <v-list-item to="/reagent/moving">
                <v-list-item-content>
                  <v-list-item-title>Запрос</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/reagent/moving/history">
                <v-list-item-content>
                  <v-list-item-title>История</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar color="primary" dense dark app>
          <v-app-bar-nav-icon v-on:click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Реактив</v-toolbar-title>
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
  computed:{
    user(){
      return this.$store.getters.name;      
    },
    idDep(){
      return this.$store.getters.idDepartment;
		},
  },
  methods:{
    logout(){
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login')});
    },
    dialogClose(data){
      this.dialogGuide = data;
    }
  }
}
</script>