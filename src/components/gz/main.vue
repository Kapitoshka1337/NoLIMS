<template>
    <v-row>
      <v-navigation-drawer v-model="drawer" dark app>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Госзадание
              </v-list-item-title>
              <v-list-item-subtitle>
                БУ УР "УВДЦ"
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item to="/gz">
              <v-list-item-icon>
                <v-icon color="orange">mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Главная</v-list-item-title>
            </v-list-item>
            <v-list-item to="/gz/report">
              <v-list-item-icon>
                <v-icon color="green">mdi-file-chart</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Отчет</v-list-item-title>
            </v-list-item>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-notebook-outline</v-icon>
                </v-list-item-icon>
                  <v-list-item-title>План</v-list-item-title>
              </template>
              <v-list-item to="/gz/plan">
                  <v-list-item-title>Изменение</v-list-item-title>
              </v-list-item>
              <v-list-item to="/gz/animals">
                  <v-list-item-title>Животные</v-list-item-title>
              </v-list-item>
              <v-list-item to="/gz/methods">
                  <v-list-item-title>Исследования</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-item @click="prompt()">
              <v-list-item-icon>
                <v-icon color="yellow">mdi-key</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Ввести ключ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar color="primary" dense dark app>
          <v-app-bar-nav-icon v-on:click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>Госзадание</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{user}} ({{idDep}})</v-toolbar-title>
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
export default {
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    logout(){
      this.$store.dispatch('logout').then(() => {
      this.$router.push('/login')});
    },
    prompt(){
      this.$store.dispatch('enterKey', window.prompt('Ключ'));
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