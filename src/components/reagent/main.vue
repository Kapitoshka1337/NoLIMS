<template>
  <sui-grid>
    <sui-grid-column>
      <div class="ui pointing menu">
        <div class="left menu">
          <router-link to="/reagent" class="item">Главная</router-link>
          <router-link to="/reagent/storage" class="item">Склад</router-link>
          <router-link to="/reagent/archive" class="item">Архив</router-link>
          <router-link to="/reagent/corrections" class="item">Ошибки</router-link>
          <router-link to="#" class="item">Заявки</router-link>
        </div>
        <div class="right menu">
          <div class="item">{{ user }} ({{idDep}})</div>
          <a class="item" v-on:click="logout"><i class="icon sign out"></i></a>
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
    },
    idDep(){
      return this.$store.getters.idDepartment;
		},
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