<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        calculate-widths
        dense
        :headers="tableColumn"
        :items="gridData"
        :items-per-page="15"
        :loading="load"
        :search="search"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
          itemsPerPageOptions: [15, 50, 100, -1],
          itemsPerPageText: 'Отобразить на странице',
        }"
      >
        <template v-slot:top>
          <v-toolbar flat dense>
            <v-toolbar-title>Управление ролями пользователей</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              label="Поиск"
              clearable
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text class="text">Значение ролей</v-card-text>
          <v-card-text class="text"
            >1. executor - для пользователей для просмотра данных. Возможность
            тратить реактивы.</v-card-text
          >
          <v-card-text class="text"
            >2. head_executor - руководители подразделений. Дополнительные
            возможности в реактивах.</v-card-text
          >
          <v-card-text class="text"
            >3. warehouse - заведующая складом</v-card-text
          >
          <v-card-text class="text"
            >4. metrolog - метролог. Дополнительны функционал в оборудовании.
            Право менять уровень доступа пользователей.</v-card-text
          >
          <v-card-text class="text">5. energy - главный энергетик</v-card-text>
          <v-card-text class="text"
            >6. opirp - сотрудник отдела приёма и регистрации проб.
            Дополнительный функционал для работы с направлениями.</v-card-text
          >
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
                label="Номер пользователя"
                v-model="item.id"
              ></v-text-field>
              <v-text-field
                disabled
                label="ФИО"
                v-model="item.name"
              ></v-text-field>
              <v-autocomplete
              dense
                outlined
                clearable
                v-model="item.id_rol"
                label="Роль"
                required
                hide-details
                v-bind:disabled="!users.length"
                :items="isUsers"
              ></v-autocomplete>
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
          text: "id_role",
          align: "start",
          sortable: true,
          value: "id",
        },
        { text: "id_users", align: "start", sortable: true, value: "id_users" },
        { text: "ФИО", align: "start", sortable: true, value: "name" },
        { text: "Роль", align: "start", sortable: true, value: "role" },
        { text: "", align: "start", sortable: false, value: "actions" },
      ],
      gridData: [],
      users: [],
      user: [],
      search: "",
      item: {
        id: null,
        id_roles: null,
        name: null,
        role: null,
      },
      defaultItem: {
        id: null,
        id_users: null,
        id_rol: null,
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
    isUsers() {
      if (this.users.length) {
        let obj = [];
        for (let i in this.users)
          obj.push({
            key: this.users[i].role,
            value: this.users[i].id,
            text: this.users[i].role,
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
        .get("/api/users")
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
      this.loading = true;
				this.$http.put(`/api/users/${this.item.id}/update`, this.item, {headers: {'Content-Type': 'application/json'}})
				.then(response => {this.loading = false; this.dialog = false; Object.assign(this.gridData[this.editedIndex], this.item); this.close();})
				.catch(error => (this.loading = false, alert(error.response.data.message)));
        // location.reload();
        //.then(response => (this.save = false, this.indentificationDataCopy = {}, this.changedItem = {})).catch(error => (this.save = false, alert(error.response.data.message)));

    },
    getUsers() {
      this.loading = !this.loading;
      this.$http
        .get("/api/structure/role")
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
<!-- this.loading = true;
this.$http.put(`/api/indicator/${this.item.id}`, this.item, {headers: {'Content-Type': 'application/json'}})
.then(response => {this.loading = false; this.dialog = false; Object.assign(this.gridData[this.editedIndex], this.item); this.close();})
.catch(error => (this.loading = false, alert(error.response.data.message)));
location.reload(); -->