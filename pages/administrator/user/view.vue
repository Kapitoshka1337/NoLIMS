<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        calculate-widths
        dense
        v-model="selected"
        :show-select="true"
        :single-select="true"
        :headers="tableColumn"
        :items="gridData"
        :items-per-page="50"
        :loading="load"
        :options.sync="options"
        :server-items-length="totalRecord"
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus',
          itemsPerPageOptions: [30, 50, 100],
          itemsPerPageText: 'Количество записей',
        }">
        <template #top>
          <v-toolbar color="white" flat>
            <v-toolbar-title style="margin-right: 10px">Сотрудники</v-toolbar-title>
            <v-divider inset vertical></v-divider>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="getData()"><v-icon>mdi-refresh</v-icon></v-btn>
              </template>
              <span>Обновить</span>
            </v-tooltip>
            <v-divider inset vertical></v-divider>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon v-can:add="'user'" @click="showCreateRole = true"><v-icon>mdi-plus</v-icon></v-btn>
              </template>
              <span>Создать сотрудника</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon v-can:edit="'user'" @click="dialogEdit"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
              </template>
              <span>Изменить сотрудника</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="onSubmitDelete()" v-can:delete="'user'"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
              <span>Удалить сотрудника</span>
            </v-tooltip>
            <v-divider inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="draw()"><v-icon>mdi-filter</v-icon></v-btn>
              </template>
              <span>Фильтрация</span>
            </v-tooltip>
          </v-toolbar>
        </template>
      </v-data-table>
      <v-navigation-drawer v-model="drawer" absolute right temporary width="512">
        <v-card flat>
          <v-card-title>Фильтрация</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="9">
                  <v-text-field dense label="Имя" outlined v-model="filterBy.firstName"></v-text-field>
                  <v-text-field dense label="Фамилия" outlined v-model="filterBy.middleName"></v-text-field>
                  <v-text-field dense label="Отчество" outlined v-model="filterBy.lastName"></v-text-field>
                  <department @select-id="getDepartmentId" :show-view="true"></department>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="warning" @click="clearFilter()">Сброс</v-btn>
            <v-btn color="success" @click="submitFilter()">Применить</v-btn>
          </v-card-actions>
        </v-card>
      </v-navigation-drawer>
      <user :visible="showCreateRole" @close="closeDialogRole"></user>
      <user-edit :visible="showEditRole" @close="closeDialogRoleEdit" :user="getRole"></user-edit>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import User from '../../../components/modal/create/user.vue';
import UserEdit from '../../../components/modal/edit/user.vue';
import Department from '../../../components/formui/department/view.vue';

  @Component({ components: { User, UserEdit, Department } })
export default class UserView extends Vue {
    tableColumn: Array<object> = [
      { text: 'ИД', align: 'start', sortable: true, value: 'id'},
      { text: 'Имя', align: 'start', sortable: true, value: 'firstName'},
      { text: 'Фамилия', align: 'start', sortable: true, value: 'middleName'},
      { text: 'Отчество', align: 'start', sortable: true, value: 'lastName' },
      { text: 'Учетная запись', align: 'start', sortable: true, value: 'userName'},
    ]
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false
    showCreateRole: boolean = false
    showEditRole: boolean = false

    getDepartmentId(value: number) {
      this.filterBy.departmentId = value;
    }

    closeDialogRole(value: boolean){
        if (value == true)
            this.getData();
        
        this.showCreateRole = false;
    }

    closeDialogRoleEdit(value: boolean){
        if (value == true)
            this.getData();
        
        this.showEditRole = false;
    }

    dialogEdit ()
    {
      if (this.selected == null || this.selected.length <= 0)
      {
          this.$toast.info("Не выбран сотрудник для редакирования.");
          return;
      }

      this.showEditRole = true;
    }

    draw() {
      this.drawer = !this.drawer;
    }

    created() {
        this.getData();
    }

    get getRole () {
      return this.selected[0]
    }

    async getData()
    {
      this.load = true;
      let data = await this.$employes.view(this.options, this.filterBy);
      this.gridData = data['data']
      this.totalRecord = data['totalRecords']
    }

    submitFilter() {
      this.getData()
    }

    clearFilter() {
      this.filterBy = {}
      this.getData()
    }

    async onSubmitDelete() {
      if (this.selected == null || this.selected.length <= 0) {
        this.$toast.info("Не выбран сотрудник для удаления.");
        return
      }

      let obj = { userId: this.selected[0].id }

      try {
        this.loadPlay = true;
        await this.$axios.post("api/v1/user/delete", obj).then(response => (
          this.selected = [],
          this.getData(),
          this.$toast.success("Пользователь удален.")
        )).catch(error => {
          this.$toast.error("Ошибка во время удаления.");
        });
      }
      catch (e) {
        this.$toast.error("Ошибка во время удаления.");
      }
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>){
            this.load = false
    }

    @Watch("options", { deep: true })
    watchToOptions(newVal: Object){
        this.getData()
    }
}
</script>
