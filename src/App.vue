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
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout")
        }
        throw err;
      });
    });
  }
}
</script>