<template>
  <sui-grid>
    <sui-grid-column>
      <router-view></router-view>
    </sui-grid-column>
  </sui-grid>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  }
}
</script>