<template>
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
</template>

<script>
export default {
  data () {
    return {
      cards: [
        {
          header: 'Госзадание',
          description: 'Описание',
          link: '/assignment'
        },
        {
          header: 'Виварий',
          description: 'Описание',
          link: '/vivarium'
        },
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
  }
}
</script>