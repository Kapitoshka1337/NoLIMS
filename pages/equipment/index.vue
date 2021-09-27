<template>
  <v-sheet>
      <v-row>
          <v-col cols="12">
              <v-card-title>Оборудование</v-card-title>
              <v-card-subtitle>Модуль позволяет управлять оборудованием, поверками, техническим обслуживанием.</v-card-subtitle>
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
            title: "Оборудование",
            module: "equipment",
            actions: [
                {
                    title: "Оборудование",
                    link: "/equipment/view",
                    desctiption: "Отобразить список оборудования"
                },
                {
                    title: "Журнал поверок",
                    link: "/equipment/checks/view",
                    desctiption: "Отобразить журнал поверок оборудования"
                }
            ]
        },
        {
            title: "Поверки",
            module: "verification",
            actions: [
                {
                    title: "Поверки",
                    link: "/equipment/verification/view",
                    desctiption: "Отобразить список поверок"
                }
            ]
        },
        {
            title: "Инструкции к оборудованию",
            module: "instruction",
            actions: [
                {
                    title: "Инструкции",
                    link: "/equipment/instruction/view",
                    desctiption: "Отобразить список инструкций"
                }
            ]
        },
        {
            title: "Техническое обслуживание",
            module: "service",
            actions: [
                {
                    title: "Техническое обслуживание",
                    link: "/equipment/service/view",
                    desctiption: "Отобразить список обордования требующее ТО"
                }
            ]
        },
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