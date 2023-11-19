<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        calculate-widths
        dense
        :headers="tableColumn"
        :items="gridData"
        :items-per-page="30"
        :loading="load"
        :search="search"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
          itemsPerPageOptions: [30, 50, 100, -1],
          itemsPerPageText: 'Отобразить на странице',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat dense>
            <v-toolbar-title>Образцы</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              label="Поиск"
              clearable
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon color="blue" @click="editedItem(item)"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
        </template>
        <template v-slot:no-data> Пока ничего нет :( </template>
      </v-data-table>
    </v-col>
    <v-dialog dense v-model="dialog" max-width="512">
      <v-card>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                disabled
                label="id"
                v-model="item.id"
              ></v-text-field>
              <v-text-field
                dense
                outlined
                clearable
                label="Номер образца"
                v-model="item.reg_num"
              ></v-text-field>
              <v-text-field
                dense
                outlined
                clearable
                label="Название образца"
                v-model="item.name"
              ></v-text-field>
              <v-autocomplete
                dense
                outlined
                clearable
                v-bind:disabled="!users.length"
                :items="isUsers"
                label="Зарегестрировал"
                v-model="item.id_user"
              ></v-autocomplete>
              <v-text-field
                dense
                outlined
                clearable
                label="Дата регистрации"
                v-model="item.date_current_check"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="submit()" :loading="loading">ОК</v-btn>
          <v-btn color="error" @click="dialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
        color="yellow"
      ></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<style scoped>
.text {
  padding: 0;
}
</style>
<script>
export default {
  data() {
    return {
      tableColumn: [
      {
          text: "id",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "Номер образца",
          align: "start",
          sortable: true,
          value: "reg_num",
        },
        {
          text: "Название образца",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Зарегистрировал",
          align: "start",
          sortable: true,
          value: "user_name",
        },
        {
          text: "Дата регистрации",
          align: "start",
          sortable: true,
          value: "date_current_check",
        },
        { text: "", align: "start", sortable: false, value: "actions" },
      ],
      gridData: [],
      users: [],
      search: "",
      item: {
        id: null,
        id_user: null,
        reg_num: null,
        name: null,
        user_name: null,
        date_current_check: null,
      },
      defaultItem: {
        id: null,
        id_user: null,
        reg_num: null,
        name: null,
        date_current_check: null,
      },
      dialog: false,
      editedIndex: -1,
      loading: false,
      load: false,
      overlay: false,
      changedItem: {},
      indentificationData: null,
      indentificationDataCopy: null,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Добавление показателя"
        : "Изменение показателя";
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
  watch: {
    dialog(newVal) {
      if (!newVal) this.item = {};
    },
  },
  indentificationData: {
    handler: function (val, old) {
      let ob = this.indentificationDataCopy;
      let ch = this.changedItem;
      Object.keys(val.id_roles).forEach(function (row) {
        if (ob[row] != val.id_roles[row]) ch[row] = val.id_roles[row];
      });
    },
    deep: true,
  },
  methods: {
    getInstructions() {
      this.load = true;
      this.$http
        .get("/api/samples")
        .then(
          (response) => ((this.load = false), (this.gridData = response.data))
        )
        .catch(
          (error) => ((this.load = false), alert(error.response.data.message))
        );
    },
    editedItem(item) {
      this.editedIndex = this.gridData.indexOf(item);
      this.item = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.item = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    submit() {
      if (this.editedIndex > -1) {
        this.loading = true;
        this.$http
          .put(`/api/samples/${this.item.id}`, this.item, {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            this.loading = false;
            this.dialog = false;
            Object.assign(this.gridData[this.editedIndex], this.item);
            this.close();
          })
          .catch(
            (error) => (
              (this.loading = false), alert(error.response.data.message)
            )
          );
        location.reload();
      } else {
        // let formData = new FormData();
        // formData.append("name", this.item.name);
        // formData.append("metod", this.item.metod);
        // formData.append("id_department", this.item.id_department);
        // this.loading = true;
        // this.$http
        //   .post("/api/samples", formData, {
        //     headers: { "Content-Type": "multipart/form-data" },
        //   })
        //   .then(
        //     (response) => (
        //       (this.loading = false),
        //       (this.dialog = false),
        //       this.getInstructions()
        //     )
        //   )
        //   .catch(
        //     (error) => (
        //       (this.loading = false), alert(error.response.data.message)
        //     )
        //   );
      }
    },
    today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
    getUsers() {
      this.loading = !this.loading;
      this.$http
        .get("/api/structure/usersON")
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
    this.getInstructions();
    this.getUsers();
  },
};
</script>