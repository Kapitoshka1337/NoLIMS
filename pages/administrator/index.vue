<template>
  <v-sheet>
      <v-row>
          <v-col cols="12">
              <v-card-title>Администрирование</v-card-title>
              <v-card-subtitle>Модуль позволяет управлять сотрудниками, ролями, правами доступа.</v-card-subtitle>
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
export default class AdministratorCover extends Vue
{
    cards: Array<object> = [
        {
            title: "Сотрудники",
            module: "user",
            actions: [
                {
                    title: "Просмотр",
                    link: "administrator/user/view",
                    desctiption: "Отобразить список сотрудников"
                }
            ]
        },
        {
            title: "Роли",
            module: "roles",
            actions: [
                {
                    title: "Просмотр",
                    link: "administrator/roles/view",
                    desctiption: "Отобразить список ролей"
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
