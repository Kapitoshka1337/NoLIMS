<template>
  <sui-grid>
    <sui-grid-column>
      <sui-menu :width="3">
        <router-link to="#" is="sui-menu-item">Оборудование</router-link>
        <router-link to="#" is="sui-menu-item">План-график</router-link>
        <router-link to="/equipment/metrolog" is="sui-menu-item">Метролог</router-link>
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