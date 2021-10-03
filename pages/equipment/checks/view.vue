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
                <v-toolbar-title style="margin-right: 10px">Журнал поверок</v-toolbar-title>
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
                <v-menu :offset-y=true>
                    <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-bind="attrs" v-on="{ ...tooltip, ...menu }" icon v-can:add="'equipment'"><v-icon>mdi-printer</v-icon></v-btn>
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
            </v-toolbar>
        </template>
        <template v-slot:item.currentCheck="{ item }">
            {{ formatDate(item.currentCheck) }}
        </template>
        <template v-slot:item.nextCheck="{ item }">
            {{ formatDate(item.nextCheck) }}
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
                          </v-col>
                          <v-col cols="9">
                                <v-text-field type="date" dense label="Предстоящая поверка от" outlined v-model="filterBy.nextCheckStart"></v-text-field>
                                <v-text-field type="date" dense label="Предстоящая поверка по" outlined v-model="filterBy.nextCheckEnd"></v-text-field>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Имя оборудования" outlined v-model="filterBy.equipmentName"></v-text-field>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Модель" outlined v-model="filterBy.equipmentModel"></v-text-field>
                          </v-col>
                          <v-col cols="9">
                                <v-text-field dense label="Серийный номер" outlined v-model="filterBy.equipmentSerialNumber"></v-text-field>
                          </v-col>
                          <v-col cols="10">
                                <type @select-id="getTypeId" :show-view="true"></type>
                          </v-col>
                          <v-col cols="10">
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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import FileSaver from 'file-saver';
import Type from '../../../components/formui/type/view.vue';
import Department from '../../../components/formui/department/view.vue';

@Component({ components: { Type, Department } })
export default class ChecksView extends Vue {
    tableColumn: Array<object> = [
        { text: 'Пройденная', align: 'start', sortable: true, value: 'currentCheck'},
        { text: 'Предстоящая', align: 'start', sortable: true, value: 'nextCheck'},
        { text: 'Подразделение', align: 'start', sortable: true, value: 'equipment.department' },
        { text: 'Номер', align: 'start', sortable: true, value: 'equipment.number' },
        { text: 'Оборудование', align: 'start', sortable: true, value: 'equipment.name'},
        { text: 'Вид', align: 'start', sortable: true, value: 'equipment.type'},
        { text: 'Модель', align: 'start', sortable: true, value: 'equipment.model'},
        { text: 'С/Н', align: 'end', sortable: true, value: 'equipment.serialNumber'},
    ]
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false

    formatDate(date: any){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    draw() {
      this.drawer = !this.drawer;
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
            this.$toast.success("Поверки успешно загружены.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки поверок.");
            this.load = false
        }
    }

    getTypeId(value: number) {
      this.filterBy.typeId = value
    }

    getDepartmentId(value: number) {
      this.filterBy.departmentId = value
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
            url = `api/v1/check?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}`;
        else
            url = `api/v1/check?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}&sortBy=${this.options.sortBy[0]} ${this.options.sortDesc[0] ? "desc" : ""}`;
        
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
            this.$toast.success("Таблица поверок успешно сформирована.");
          });
        this.$toast.success("Формирование таблицы поверок запущено.");
      }
      catch (e) {
        this.$toast.error("Ошибка во время формирования таблицы поверок.");
      }
    }
}
</script>
