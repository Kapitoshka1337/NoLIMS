<template>
  <sui-grid>
    <sui-grid-column>
      <!--<sui-menu :width="5" pointing>
        <router-link to="#" is="sui-menu-item">Главная</router-link>
        <router-link to="/reagent/storage" is="sui-menu-item">Склад</router-link>
        <router-link to="#" is="sui-menu-item">Архив</router-link>
        <router-link to="/reagent/corrections" is="sui-menu-item">Ошибки</router-link>
        <router-link to="#" is="sui-menu-item">Заявки</router-link>
        <sui-menu-item position="right">{{ user }}</sui-menu-item>
        <sui-menu-item position="right" v-on:click="logout">
          <sui-icon name="sign out"/>
        </sui-menu-item>
      </sui-menu>-->
      <div class="ui pointing menu">
        <div class="left menu">
          <router-link to="/reagent" class="item">Главная</router-link>
          <router-link to="/reagent/storage" class="item">Склад</router-link>
          <router-link to="#" class="item">Архив</router-link>
          <router-link to="/reagent/corrections" class="item">Ошибки</router-link>
          <router-link to="#" class="item">Заявки</router-link>
        </div>
        <div class="right menu">
          <div class="item">{{ user }}</div>
          <div class="item"><i class="icon sign out"></i></div>
        </div>
      </div>
      <router-view></router-view>
    </sui-grid-column>
  </sui-grid>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed:{
    user(){
      return this.$store.getters.name;      
    }
  },
  methods:{
    logout(){
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/login')});
      }
  }
}
</script>

<style scoped>
.right.item{
  margin-left: 0;
}
</style>