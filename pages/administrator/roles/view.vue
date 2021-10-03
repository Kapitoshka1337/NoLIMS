<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        calculate-widths
        dense
        v-model="selected"
        :show-select="true"
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
      <v-navigation-drawer v-model="drawer" absolute right temporary></v-navigation-drawer>
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
        try
        {
            this.load = true;
            let url: string = this.computedUrl;
            let filterUrl: string = this.computedFilter();

            await this.$axios.get(url + filterUrl).then(response => {
                    this.gridData = response.data["data"]
                    this.totalRecord = response.data['totalRecords']
                }
            );
            this.load = false
            this.$toast.success("Поверки успешно загружены.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки поверок.");
            this.load = false
        }
    }

    computedFilter() : string
    {
        let url = '';

        if (Object.keys(this.filterBy).length > 0)
        {
            Object.keys(this.filterBy).forEach(el => {
                if (this.filterBy[el] != null || this.filterBy[el] != "" || this.filterBy[el] > 0)
                    url += `&${el}=${this.filterBy[el]}`
            })
        }

        return url
    }

    get computedUrl()
    {
        let url = ''

        if (this.options.sortBy.length <= 0)
            url = `api/v1/roles?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}`;
        else
            url = `api/v1/roles?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}&sortBy=${this.options.sortBy[0]} ${this.options.sortDesc[0] ? "desc" : ""}`;
        
        return url
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>){
    if (newVal.length > 0)
        this.load = false
    }

    @Watch("options", { deep: true })
    watchToOptions(newVal: Object){
        this.getData()
    }
}
</script>
