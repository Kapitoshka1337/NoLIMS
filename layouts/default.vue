<template>
  <v-app>
    <navigation-drawer :drawer.sync="drawer" :clipped="clipped" @on-input="onDrawer"></navigation-drawer>
    <app-bar :drawer="drawer" :clipped="clipped" @on-drawer="onDrawer"></app-bar>
    
    <v-main>
      <v-container :fluid="true">
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import NavigationDrawer from "../components/NavigationDrawer.vue"
import AppBar from "../components/AppBar.vue"

@Component({ components: { NavigationDrawer, AppBar }, middleware: ['check'] })
export default class Default extends Vue {
  clipped: boolean = true
  drawer: boolean = false
  fixed: boolean = true

  onDrawer(val : boolean) {
      this.drawer = val;
  }
}
</script>
