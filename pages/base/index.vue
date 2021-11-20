<template>
  <v-sheet>
      <v-row>
          <v-col cols="12">
              <v-card-title>Лаборатория</v-card-title>
              <v-card-subtitle>Модуль позволяет управлять подразделением, метосположением.</v-card-subtitle>
              <v-divider></v-divider>
          </v-col>
      </v-row>
      <v-row>
      <v-col v-for="card in cards" :key="card.title" cols="4">
        <v-card outlined tile v-can:view='card.module'>
          <v-card-title>{{ card.title }}</v-card-title>
          <v-card-text>
              <div class="actions" v-for="action in card.actions" :key="action.title">
                  <NuxtLink :to="action.link" class="link">{{ action.title }}</NuxtLink>
                  <span>{{ action.desctiption }}</span>
              </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class ProductCover extends Vue
{
    cards: Array<object> = [
        {
            title: "Подразделения",
            module: "department",
            actions: [
                {
                    title: "Подразделения",
                    link: "/base/department/view",
                    desctiption: "Отобразить список подразделений"
                }
            ]
        },
        {
            title: "Местоположения",
            module: "location",
            actions: [
                {
                    title: "Местоположения",
                    link: "/base/location/view",
                    desctiption: "Отобразить список местоположений"
                }
            ]
        }
    ];
}
</script>

<style scoped lang="css">
.link 
{
    display: block;
}

.actions
{
    margin-bottom: 12px;
}
</style>