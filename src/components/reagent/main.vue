<template>
  <sui-grid>
    <sui-grid-column>
      <sui-menu :width="5">
        <router-link to="#" is="sui-menu-item">Главная</router-link>
        <router-link to="/reagent/storage" is="sui-menu-item">Склад</router-link>
        <router-link to="#" is="sui-menu-item">Архив</router-link>
        <router-link to="#" is="sui-menu-item">Ошибки</router-link>
        <router-link to="#" is="sui-menu-item">Заявки</router-link>
      </sui-menu>
      <router-view></router-view>
    </sui-grid-column>
  </sui-grid>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>