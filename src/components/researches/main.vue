<template>
  <v-row>
    <v-navigation-drawer v-model="drawer" dark app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Направление </v-list-item-title>
          <v-list-item-subtitle> БУ УР "УВДЦ" </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item to="/researches">
          <v-list-item-icon>
            <v-icon color="orange">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Создать направление</v-list-item-title>
        </v-list-item>
        <v-list-item to="/samples">
          <v-list-item-icon>
            <v-icon color="orange">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Образцы</v-list-item-title>
        </v-list-item>
        <v-list-item to="/indicator">
          <v-list-item-icon>
            <v-icon color="orange">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Показатели</v-list-item-title>
        </v-list-item>
        <v-list-item to="/researche">
          <v-list-item-icon>
            <v-icon color="orange">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Исследования</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" dense dark app>
      <v-app-bar-nav-icon
        v-on:click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Направление</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ user }} ({{ idDep }})</v-toolbar-title>
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
import guide from "./../guide/index.vue";

export default {
  components: {
    guide: guide,
  },
  data() {
    return {
      drawer: false,
      dialogGuide: false,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
    prompt() {
      this.$store.dispatch("enterKey", window.prompt("Ключ"));
    },
    dialogClose(data) {
      this.dialogGuide = data;
    },
  },
  computed: {
    user() {
      return this.$store.getters.name;
    },
    idDep() {
      return this.$store.getters.idDepartment;
    },
  },
};
</script>