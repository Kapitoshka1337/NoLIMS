<template>
  <v-row>
    <v-app-bar color="primary" dense dark app>
      <v-toolbar-title>НеЛИС</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{user}} ({{idDep}})</v-toolbar-title>
      <v-btn icon @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-row dense justify="start">
          <v-col cols="3" v-for="card in cards" :key="card.id">
            <v-card class="mx-auto" max-width="512" outlined>
              <v-card-title>{{ card.header }}</v-card-title>
              <v-divider></v-divider>
              <v-card-text>Описание</v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn block color="success" :ripple="false" :to="card.link">Открыть</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      cards: [
         {
           header: 'Госзадание',
           description: 'Описание',
           link: '/gz/index'
         },
        // {
        //   header: 'Виварий',
        //   description: 'Описание',
        //   link: '/vivarium'
        // },
        {
          id: 1,
          header: 'Реактив',
          description: 'Описание',
          link: '/reagent'
        },
        {
          id: 2,
          header: 'Оборудование',
          description: 'Описание',
          link: '/equipment/main'
        }
      ]
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