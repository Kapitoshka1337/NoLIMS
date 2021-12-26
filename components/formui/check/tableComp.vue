<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :single-select="singleSelect"
        calculate-widths
        dense
        v-model="selected"
        :show-select="showSelect"
        :headers="filteredHeaders"
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
                <v-toolbar-title style="margin-right: 10px" v-if="showTitle">Журнал поверок</v-toolbar-title>
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
                    <v-btn v-bind="attrs" v-on="on" icon v-can:add="'checks'" :disabled="true"><v-icon>mdi-plus</v-icon></v-btn>
                    </template>
                    <span>Создать поверку</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="sentToCheck()" v-can:add="'verification'"><v-icon>mdi-alert-circle-check</v-icon></v-btn>
                    </template>
                    <span>Отправить на поверку</span>
                </v-tooltip>
                <v-menu :offset-y=true>
                    <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-bind="attrs" v-on="{ ...tooltip, ...menu }" icon v-can:view="'checks'"><v-icon>mdi-printer</v-icon></v-btn>
                        </template>
                        <span>Печать шаблонов</span>
                    </v-tooltip>
                    </template>
                    <v-list>
                        <v-list-item @click="printSticker()">
                            <v-list-item-title>Этикетка</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="printCheckTable()">
                            <v-list-item-title>Таблица поверок</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-divider inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="draw()"><v-icon>mdi-filter</v-icon></v-btn>
                    </template>
                    <span>Фильтрация</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="drawTune()"><v-icon>mdi-tune</v-icon></v-btn>
                    </template>
                    <span>Колонки</span>
                </v-tooltip>
            </v-toolbar>
        </template>
        <template v-slot:item.currentCheck="{ item }">
            {{ formatDate(item.currentCheck) }}
        </template>
        <template v-slot:item.nextCheck="{ item }">
            {{ formatDate(item.nextCheck) }}
        </template>
        <template v-slot:item.fileId="{ item }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon v-can:view="'file'" @click="download(item)"><v-icon>mdi-download</v-icon></v-btn>
                </template>
                <span>Экспортировать</span>
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
                          <v-col cols="9">
                                <v-text-field type="date" dense label="Пройденная поверка от" outlined v-model="filterBy.currentCheckStart"></v-text-field>
                                <v-text-field type="date" dense label="Пройденная поверка по" outlined v-model="filterBy.currentCheckEnd"></v-text-field>
                                <v-text-field type="date" dense label="Предстоящая поверка от" outlined v-model="filterBy.nextCheckStart"></v-text-field>
                                <v-text-field type="date" dense label="Предстоящая поверка по" outlined v-model="filterBy.nextCheckEnd"></v-text-field>
                                <v-text-field dense label="Наименование оборудования" outlined v-model="filterBy.equipmentName"></v-text-field>
                                <v-text-field dense label="Модель" outlined v-model="filterBy.equipmentModel"></v-text-field>
                                <v-text-field dense label="Серийный номер" outlined v-model="filterBy.equipmentSerialNumber"></v-text-field>
                                <FormuiTypeView @select-id="getTypeId" :show-view="true"></FormuiTypeView>
                                <FormuiDepartmentView @select-id="getDepartmentId" :show-view="true"></FormuiDepartmentView>
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
      <v-navigation-drawer v-model="drawerTune" absolute right temporary width="256">
        <v-list subheader two-line flat>
          <v-subheader>Отображаемые колонки</v-subheader>
          <v-list-item-group multiple>
            <v-list-item v-for="column in tableColumn" :key="column.value">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox v-model="column.visible" :key="column.value" color="primary"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ column.text }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator';
import FileSaver from 'file-saver';

@Component
export default class ChecksView extends Vue {
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false
    drawerTune: boolean = false

    @Prop({default: true}) singleSelect!: boolean
    @Prop({default: true}) showSelect!: boolean
    @Prop({default: true}) showTitle!: boolean
    @Prop({default: true}) showToolbar!: boolean
    @Prop({default: 0}) equipmentId!: number
    @Prop() tableColumn!: Array<object>

    get filteredHeaders () {
      return this.tableColumn.filter(column => column.visible)
    }

    getEquipmentId (value: number)
    {   
        this.filterBy.equipmentId = value
    }

    formatDate(date: any){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    draw() {
      this.drawer = !this.drawer;
    }

    drawTune() {
      this.drawerTune = !this.drawerTune;
    }

    created() {
        this.getData();
    }

    async getData()
    {
      this.load = true;
      
      if (this.equipmentId > 0)
        this.getEquipmentId(this.equipmentId);

      let data = await this.$checks.view(this.options, this.filterBy);
      this.gridData = data['data']
      this.totalRecord = data['totalRecords']
    }

    getTypeId(value: number) {
      this.filterBy.typeId = value
    }

    getDepartmentId(value: number) {
      this.filterBy.departmentId = value
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
        this.load = false
    }

    async printSticker(){
        if (this.selected == null || this.selected.length <= 0)
        {
            this.$toast.info("Не выбрано оборудование для печати этикеток.");
            return;
        }

        let obj = {
            equipmentId: []
        }

        this.selected.forEach(el => {
            obj.equipmentId.push(el.equipmentId)
        })

        try
        {
          this.$axios.post("api/v1/report/sticker", obj, { responseType: 'blob' })
              .then(response => {
                const fl = new Blob([response.data], {type: response.data['type']});
                FileSaver.saveAs(fl, "Этикетки.pdf");
                this.selected = [];
                this.$toast.success("Этикетки успешно сформированы.");
            });
            this.$toast.success("Формирование этикеток запущено.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время формирования этикеток.");
        }
    }

    printCheckTable(){
      if (this.selected == null || this.selected.length <= 0) {
        this.$toast.info("Не выбрано оборудование для печати таблицы поверок.");
        return;
      }

      let obj = {
        equipmentId: []
      }

      this.selected.forEach(el => {
        obj.equipmentId.push(el.equipmentId)
      })

      try {
        this.$axios.post("api/v1/report/checktable", obj, { responseType: 'blob' })
          .then(response => {
            const fl = new Blob([response.data], { type: response.data['type'] });
            FileSaver.saveAs(fl, "Таблица поверок.pdf");
            this.selected = [];
            this.$toast.success("Таблица поверок сформирована.");
          });
        this.$toast.success("Формирование таблицы поверок запущено.");
      }
      catch (e) {
        this.$toast.error("Ошибка во время формирования таблицы поверок.");
      }
    }

    download(item: any){
        try
        {
            if (item.fileId == null)
            {
                this.$toast.info("Отсутствует документ для экспорта.");
                return;
            }

            this.$toast.info("Начат экспорт файла.");
            this.$axios.get(`/api/file/download/?fileId=${item.fileId}`, {responseType: 'blob'})
            .then(response =>{
                const fl = new Blob([response.data], {type: response.data['type']});
                FileSaver.saveAs(fl, "Документ");
                this.$toast.success("Файл экспортирован.");
            })
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время экспорта файла.");
        }
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
            obj.equipments.push({ equipmentId: el.equipment.id })
        })

        let data = await this.$verifications.sentToCheck(obj);
        if (data)
            this.selected = []
    }
}
</script>
