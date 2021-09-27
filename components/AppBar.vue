<template>
    <v-app-bar :clipped-left="clipped" flat fixed dense app>
      <v-app-bar-nav-icon @click="localDrawer = !localDrawer" />
      <v-spacer></v-spacer>
      <v-menu dense bottom min-width="200px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on"><v-icon>mdi-account</v-icon></v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <h3>{{ userName }}</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text>
                Профиль
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="Logout()">
                Выход
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "nuxt-property-decorator"

@Component
export default class AppBar extends Vue
{
    @Prop({ default: true }) clipped!: boolean
    @Prop({ default: true }) drawer!: boolean

    localDrawer : boolean = false;

    get drawers() {
      this.localDrawer = this.drawer
      return this.localDrawer
    }

    set drawers(val: boolean) {
      this.drawers = val
    }

    @Watch("localDrawer")
    watchDrawer(newVal: boolean)
    {
        this.onDrawer(newVal)
    }

    @Emit("on-drawer")
    onDrawer(state: boolean) {}

    get userName()
    {
        let userName = this.$auth.user.userName;

        if (userName != null)
            return userName;
        
        return;
    }
    
    Logout() {
        this.$auth.logout()
    }
}
</script>
