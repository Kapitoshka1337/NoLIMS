<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
      :single-select="singleSelect"
      calculate-widths
      dense
      v-model="selected"
      :show-select="showSelect"
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
          <v-toolbar color="white" flat v-if="showToolbar">
              <v-toolbar-title v-if="showTitle" style="margin-right: 10px">Перемещения</v-toolbar-title>
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
                      <v-btn v-bind="attrs" v-on="on" icon @click="showDialogCreate = true" v-can:add="'moving'"><v-icon>mdi-plus</v-icon></v-btn>
                  </template>
                  <span>Создать перемещение</span>
              </v-tooltip>
              <v-divider inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" icon @click="draw()" :disabled="!showFilterPanel"><v-icon>mdi-filter</v-icon></v-btn>
                  </template>
                  <span>Фильтрация</span>
              </v-tooltip>
          </v-toolbar>
      </template>
      <template v-slot:item.movingDate="{ item }">
        {{ formatDateLocalDate(item.movingDate) }}
      </template>
      <!-- <template v-slot:item.actions="{ item }">
          <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon @click="openDetail(item.id)"><v-icon>mdi-card-text</v-icon></v-btn>
              </template>
              <span>Открыть карточку</span>
          </v-tooltip>
      </template> -->
      </v-data-table>
      <v-navigation-drawer v-model="drawer" absolute right temporary width="512">
        <v-card flat>
          <v-card-title>Фильтрация</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="9">
                  <!-- <v-text-field dense label="Номер кабинета" outlined v-model="filterBy.numberRoom"></v-text-field> -->
                  <!-- <FormuiDepartmentView @select-id="getDepartmentId" :show-view="true"></FormuiDepartmentView> -->
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
      <!-- <FormuiLocationCreate :visible="showDialogCreate" @close="closeDialogCreate()" @save="Save"></FormuiLocationCreate> -->
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator';

@Component
export default class MovingTable extends Vue {
    tableColumn: Array<object> = [
      { text: 'Текущий отдел', align: 'start', sortable: true, value: 'nextDepartment.name' },
      { text: 'Прошлый отдел', align: 'start', sortable: true, value: 'currentDepartment.name' },
      { text: 'Дата перемещения', align: 'right', sortable: true, value: 'movingDate' }
      // { text: '', align: 'start', sortable: false, value: 'actions'},
    ]
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false
    showDialogCreate: boolean = false
    createdItem: boolean = false

    @Prop({default: true}) singleSelect!: boolean
    @Prop({default: true}) showSelect!: boolean
    @Prop({default: true}) showTitle!: boolean
    @Prop({default: true}) showToolbar!: boolean
    @Prop({default: true}) equipmentId!: number
    @Prop({default: true}) showFilterPanel!: boolean

    getEquipmentId (value: number)
    {   
        this.filterBy.equipmentId = value
    }

    formatDateLocalDate(date: any){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    openDetail(value: number){
        this.$router.push({name: 'equipment-moving-view-id', params: { id: value }});
    }

    closeDialogCreate(value: boolean){
        this.showDialogCreate = false;
    }

    Save (value: boolean) {
        if (value == true)
            this.getData()
    }

    draw() {
      this.drawer = !this.drawer;
    }

    created() {
        this.getData();
    }

    async getData() {
      this.load = true;
      
      if (this.equipmentId >= 0)
        this.getEquipmentId(this.equipmentId);
      
      let data = await this.$movings.view(this.options, this.filterBy);
      this.gridData = data['data']
      this.totalRecord = data['totalRecords']
    }

    @Watch("options", { deep: true })
    watchToOptions(newVal: Object){
        this.getData()
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>){
      this.load = false
    }

    @Watch("selected")
    watchToSelected(newVal: Array<object>){
        if (Object.keys(newVal).length > 0)
        {
            this.$emit('item-selected', newVal[0])
        }
    }

    submitFilter() {
      this.getData()
    }

    clearFilter() {
      this.filterBy = {}
      this.getData()
    }
}
</script>
