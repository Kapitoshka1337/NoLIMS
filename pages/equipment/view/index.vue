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
          itemsPerPageOptions: [10, 50, 100],
          itemsPerPageText: 'Количество записей',
        }">
        <template #top>
            <v-toolbar color="white" flat>
                <v-toolbar-title style="margin-right: 10px">Оборудование</v-toolbar-title>
                <v-divider inset vertical></v-divider>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="getData()"><v-icon>mdi-refresh</v-icon></v-btn>
                    </template>
                    <span>Обновить</span>
                </v-tooltip>
                <v-divider inset vertical></v-divider>
                <v-menu :offset-y=true>
                    <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-bind="attrs" v-on="{ ...tooltip, ...menu }" icon v-can:add="'equipment'"><v-icon>mdi-plus</v-icon></v-btn>
                        </template>
                        <span>Создать оборудование</span>
                    </v-tooltip>
                    </template>
                    <v-list>
                        <v-list-item @click="showCreateEquipmentVO = true">
                            <v-list-item-title>Вспомогательное</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="showCreateEquipmentIO = true">
                            <v-list-item-title>Исследовательское</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="showCreateEquipmentCI = true">
                            <v-list-item-title>Средство измерения</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="sentToCheck()" v-can:add="'verification'"><v-icon>mdi-alert-circle-check</v-icon></v-btn>
                    </template>
                    <span>Отправить на поверку</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="updateLocation()"><v-icon>mdi-map-marker</v-icon></v-btn>
                    </template>
                    <span>Сменить местоположение</span>
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
        <template v-slot:item.tag="{ item }">
            <v-chip-group v-for="status in item.status">
                <v-chip color="teal" small text-color="white">{{ status.name }}</v-chip>
            </v-chip-group>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon @click="openDetail(item.id)"><v-icon>mdi-card-text</v-icon></v-btn>
                </template>
                <span>Карточка оборудования</span>
            </v-tooltip>
        </template>
      </v-data-table>
      <v-navigation-drawer v-model="drawer" absolute right temporary width="512">
          <v-card flat>
              <v-card-title>Фильтрация</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                  <v-form>
                      <v-row>
                          <v-col cols="10">
                                <type @select-id="getTypeId" :show-view="true"></type>
                          </v-col>
                          <v-col cols="10">
                                <department @select-id="getDepartmentId" :show-view="true"></department>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Имя" outlined v-model="filterBy.name"></v-text-field>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Номер" outlined v-model="filterBy.number"></v-text-field>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Модель" outlined v-model="filterBy.model"></v-text-field>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Серийный номер" outlined v-model="filterBy.serialNumber"></v-text-field>
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
      <create-equipment-vo :visible="showCreateEquipmentVO" @close="closeDialogVo"></create-equipment-vo>
      <create-equipment-io :visible="showCreateEquipmentIO" @close="closeDialogIo"></create-equipment-io>
      <create-equipment-ci :visible="showCreateEquipmentCI" @close="closeDialogCi"></create-equipment-ci>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import CreateEquipmentVo from '../../../components/modal/equipment.vue';
import CreateEquipmentIo from '../../../components/modal/equipmentio.vue';
import CreateEquipmentCi from '../../../components/modal/equipmentci.vue';
import Type from '../../../components/formui/type/view.vue'
import Department from '../../../components/formui/department/view.vue'

@Component({ components: { CreateEquipmentVo, CreateEquipmentIo, CreateEquipmentCi, Type, Department } })
export default class EquipmentView extends Vue {
    tableColumn: Array<object> = [
        { text: 'Номер', align: 'start', sortable: true, value: 'number'},
        { text: 'Отдел', align: 'start', sortable: true, value: 'department'},
        { text: 'Тип', align: 'start', sortable: true, value: 'type'},
        { text: 'Имя', align: 'start', sortable: true, value: 'name' },
        { text: 'Модель', align: 'start', sortable: true, value: 'model'},
        { text: 'С/Н', align: 'end', sortable: true, value: 'serialNumber'},
        { text: 'Тег', align: 'center', sortable: false, value: 'tag'},
        { text: '', align: 'center', sortable: false, value: 'actions'}
    ]
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false
    showCreateEquipmentVO: boolean = false
    showCreateEquipmentIO: boolean = false
    showCreateEquipmentCI: boolean = false

    getTypeId (value: number)
    {   
        this.filterBy.typeId = value
    }
    
    getDepartmentId (value: number)
    {   
        this.filterBy.departmentId = value
    }

    closeDialogVo(value: boolean){
        if (value == true)
            this.getData();
        
        this.showCreateEquipmentVO = false;
    }
    
    closeDialogIo(value: boolean){
        if (value == true)
            this.getData();

        this.showCreateEquipmentIO = false;
    }
    
    closeDialogCi(value: boolean){
        if (value == true)
            this.getData();

        this.showCreateEquipmentCI = false;
    }

    formatDate(date: any){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    draw() {
      this.drawer = !this.drawer;
    }

    openDetail(value: number){
        this.$router.push({name: 'equipment-view-id', params: { id: value }});
    }

    created() {
        this.getData();
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
            this.$toast.success("Оборудование успешно загружено.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки оборудования.");
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
            url = `api/v1/equipment?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}`;
        else
            url = `api/v1/equipment?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}&sortBy=${this.options.sortBy[0]} ${this.options.sortDesc[0] ? "desc" : ""}`;
        
        return url
    }

    submitFilter(){
        this.getData()
    }

    clearFilter(){
        this.filterBy = {}
        this.getData()
    }

    @Watch("options", { deep: true })
    watchToOptions(newVal: Object){
        this.getData()
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>){
    if (newVal.length > 0)
        this.load = false
    }

    async sentToCheck () {
        if (this.selected == null || this.selected.length <= 0)
        {
            this.$toast.info("Не выбрано оборудование для отправки на поверку.");
            return;
        }

        let obj = {
            equipments: []
        }

        this.selected.forEach(el => {
            obj.equipments.push({ equipmentId: el.id })
        })

        try
        {
            await this.$axios.post("api/v1/verification", obj).then(response => (this.selected = []));
            this.$toast.success("Оборудование добавлено в поверку");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время выполнения.");
        }
    }

  updateLocation() {
    this.$toast.info("Перемещние находится в разработке.");
  }
}
</script>
