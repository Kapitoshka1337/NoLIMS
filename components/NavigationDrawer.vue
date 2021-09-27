<template>
    <v-navigation-drawer width="288" v-model="onDrawer" :clipped="clipped" @input="onInput" fixed app dark>
      <v-list dense router exact>
          <v-list-item v-for="item in MenuItems" :key="item.module" :to="item.to">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "nuxt-property-decorator"

@Component
export default class NavidationDrawer extends Vue
{
    @Prop({ default: true }) clipped!: boolean
    @Prop({ default: false }) drawer!: boolean

    _drawer: boolean = false

    @Emit()
    onInput (val: boolean) {}

    get onDrawer() { 
      this._drawer = this.drawer
      return this._drawer 
    }
    set onDrawer(val: boolean) {
      this._drawer = val
    }
    
    items: Array<object> = [
      {
        name: "Оборудование",
        module: 'equipment',
        visible: false,
        to: ""
      },
      {
        name: "Пользователь",
        module: 'user',
        visible: false,
        to: ""
      },
      {
        name: "Администрирование",
        module: 'administrator',
        visible: false,
        to: ""
      }
    ]

    get MenuItems (): Array<object>
    {
      let claims: any = this.$auth.user.claims;
      if (claims != null)
        this.items.forEach(item => {
          if (claims.filter(f => f.module == item.module ).length > 0)
          {
            item.visible = true
            item.to = `/${item.module}`
          }
        })

      return this.items.filter(el => el.visible);
    }
}
</script>
