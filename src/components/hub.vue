<template>
<div>
  <div class="ui pointing menu">
    <div class="left menu">
    <div class="item header">НеЛИС</div>
    </div>
    <div class="right menu">
      <div class="item">{{ user }} ({{idDep}})</div>
      <a class="item" v-on:click="logout"><i class="icon sign out"></i></a>
    </div>
  </div>
  <sui-grid class="padded">
    <sui-grid-row>
      <sui-grid-column>
        <sui-card-group :items-per-row="4">
          <sui-card v-for="(card, index) in cards" :key="index">
            <sui-card-content>
              <sui-card-header>{{ card.header }}</sui-card-header>
            </sui-card-content>
            <sui-card-content>
              <sui-card-description>{{ card.description }}</sui-card-description>
            </sui-card-content>
            <sui-card-content extra>
              <router-link v-bind:to="card.link" is="sui-button" color="green" fluid>Открыть</router-link>
            </sui-card-content>
          </sui-card>
        </sui-card-group>
      </sui-grid-column>
    </sui-grid-row>
  </sui-grid>
</div>
</template>

<script>
export default {
  data () {
    return {
      cards: [
        // {
        //   header: 'Госзадание',
        //   description: 'Описание',
        //   link: '/assignment'
        // },
        // {
        //   header: 'Виварий',
        //   description: 'Описание',
        //   link: '/vivarium'
        // },
        {
          header: 'Реактив',
          description: 'Описание',
          link: '/reagent'
        },
        {
          header: 'Оборудование',
          description: 'Описание',
          link: '/equipment'
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