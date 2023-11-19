<template>
  <v-container class="cont">
    <v-row class="rowt">
      <v-col cols="12" md="2">
        <v-text-field
          v-model="sample.reg_num"
          :counter="10"
          label="Регистрационный номер"
          required
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="sample.name"
          :counter="10"
          label="Название"
          required
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="sample.massa"
          :counter="10"
          label="Объём \ масса"
          required
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="1">
        <v-text-field
          v-model="sample.SI"
          :counter="10"
          label="Указать СИ"
          required
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="1">
        <v-text-field
          v-model="sample.metod"
          :counter="10"
          label="Метод выбирает заказчик"
          required
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="sample.indicator"
          :counter="10"
          label="Показатель"
          required
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="sample.note"
          :counter="10"
          label="Примечание"
          required
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
col {
  width: 100%;
  margin: auto;
  padding: 0;
}
</style>

  <script>
export default {
  data() {
    return {
      sample: {
        reg_num: null,
        name: null,
        massa: null,
        SI: null,
        metod: null,
        indicator: null,
        note: null,
      },
    };
  },
};
</script>