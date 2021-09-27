<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
        <!-- <NuxtLink to="/">
          Вернуться обратно
        </NuxtLink> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'Запрашиваемая страница не найдена.',
      otherError: 'При выполнении запроса возникла ошибка. Обратитесь к администратору.'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
