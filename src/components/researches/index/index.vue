<template>
  <v-form>
    <div>
      <keep-alive>
        <!-- <ul>
          <li>
            <component
              v-for="index in object"
              :key="index"
              v-bind:is="component"
            ></component>
          </li>
        </ul> -->
        <v-container class="cont">
          <v-row class="rowt" align="center" justify="center">
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
              <v-autocomplete
                v-model="sample.indicator"
                :counter="10"
                label="Показатель"
                required
                hide-details
                v-bind:disabled="!users.length"
                :items="isUsers"
              ></v-autocomplete>
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
      </keep-alive>
    </div>

    <!-- <v-btn v-on:click="add()"
      >Добавить следующий образец в данное направление</v-btn
    > -->
    <!-- <v-btn v-on:click="del()"
      >Убрать последнюю строку в данном направлении</v-btn
    > -->
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn @click="submit()" :loading="loading"
          >Сформировать направление</v-btn
        ></v-col
      ></v-row
    >
  </v-form>
</template>


  <script>
import component from "./component.vue";

export default {
  components: {
    comp: component,
  },
  data() {
    return {
      component: "comp",
      object: 1,
      sample: {
        reg_num: null,
        name: null,
        massa: null,
        SI: null,
        metod: null,
        indicator: null,
        note: null,
        user: null,
      },
      gridData: [],
      users: [],
      dialog: false,
      editedIndex: -1,
      loading: false,
      load: false,
      overlay: false,
      changedSamples: {},
      indentificationData: null,
      indentificationDataCopy: null,
    };
  },
  computed: {
    user() {
      return this.$store.getters.name;
    },

    isUsers() {
      if (this.users.length) {
        let obj = [];
        for (let i in this.users)
          obj.push({
            key: this.users[i].name,
            value: this.users[i].id,
            text: this.users[i].name,
          });
        return obj;
      }
    },
  },
  methods: {
    submit() {
      // if (this.getInternalSubmit) {
      //   this.$emit("submit", this.passedData);
      //   this.loading = true;
      //   return true;
      // }

      let formData = new FormData();
      formData.append("reg_num", this.sample.reg_num);
      formData.append("name", this.sample.name);
      formData.append("massa", this.sample.massa);
      formData.append("SI", this.sample.SI);
      formData.append("metod", this.sample.metod);
      formData.append("indicator", this.sample.indicator);
      formData.append("note", this.sample.note);
      this.loading = true;
      this.$http
        .post("/api/direction", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(
          (response) => (
            (this.loading = false),
            (this.dialog = false),
            this.getInstructions()
          )
        )
        .catch(
          (error) => (
            (this.loading = false), alert(error.response.data.message)
          )
        );
    },
    add() {
      this.object++;
    },
    del() {
      this.object--;
    },
    getUsers() {
      this.loading = !this.loading;
      this.$http
        .get("/api/structure/indicator")
        .then(
          (response) => (
            (this.users = response.data), (this.loading = !this.loading)
          )
        )
        .catch(
          (error) => (
            alert(error.response.data.message), (this.loading = !this.loading)
          )
        );
    },
  },
  created() {
    this.getUsers();
  },
};
</script>