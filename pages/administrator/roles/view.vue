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
            <v-toolbar-title style="margin-right: 10px">Роли</v-toolbar-title>
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
                <v-btn v-bind="attrs" v-on="on" icon v-can:add="'roles'" @click="showCreateRole = true"><v-icon>mdi-plus</v-icon></v-btn>
              </template>
              <span>Создать роль</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon v-can:edit="'roles'" @click="dialogEdit"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
              </template>
              <span>Изменить роль</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="onSubmitDelete()" v-can:delete="'roles'"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
              <span>Удалить роль</span>
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
                  <v-text-field dense label="Имя" outlined v-model="filterBy.name"></v-text-field>
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
      <role :visible="showCreateRole" @close="closeDialogRole"></role>
      <role-edit :visible="showEditRole" @close="closeDialogRoleEdit" :role="getRole"></role-edit>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import Role from '../../../components/modal/create/role.vue'
import RoleEdit from '../../../components/modal/edit/role.vue'

@Component({ components: { Role, RoleEdit } })
export default class RolesView extends Vue {
    tableColumn: Array<object> = [
        { text: 'ИД', align: 'start', sortable: true, value: 'id'},
        { text: 'Имя', align: 'start', sortable: false, value: 'name'},
        { text: '', align: 'end', sortable: false, value: 'actions'}
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
          this.$toast.info("Не выбрана роль для редакирования.");
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
      let data = await this.$roles.view(this.options, this.filterBy);
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
        this.$toast.info("Не выбрана роль для удаления.");
        return
      }

      let obj = { roleId: this.selected[0].id }

      try {
        this.loadPlay = true;
        await this.$axios.post("api/v1/roles/delete", obj).then(response => (
          this.selected = [],
          this.getData(),
          this.$toast.success("Роль удалена.")
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
