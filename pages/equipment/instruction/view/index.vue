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
                <v-toolbar-title style="margin-right: 10px">Инструкции</v-toolbar-title>
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
                    <v-btn v-bind="attrs" v-on="on" icon v-can:add="'instruction'" @click="showDialogCreate = true"><v-icon>mdi-plus</v-icon></v-btn>
                    </template>
                    <span>Создать инструкцию</span>
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
        <template #item.actions="{ item }">
          <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon @click="openDetail(item.id)"><v-icon>mdi-card-text</v-icon></v-btn>
              </template>
              <span>Открыть карточку</span>
          </v-tooltip>
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
                                <v-text-field dense label="Номер" outlined v-model="filterBy.number"></v-text-field>
                                <v-text-field dense label="Наименование инструкции" outlined v-model="filterBy.name"></v-text-field>
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
      <create-instruction :visible="showDialogCreate" @close="closeDialog()" @save="save()"></create-instruction>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import CreateInstruction from '../../../../components/formui/instruction/create.vue'

@Component({ components: { CreateInstruction } })
export default class InstructionView extends Vue {
    tableColumn: Array<object> = [
        { text: 'Номер', align: 'start', sortable: true, value: 'number'},
        { text: 'Наименование', align: 'start', sortable: true, value: 'name'},
        { text: '', align: 'start', sortable: false, value: 'actions'}
    ]
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false
    showDialogCreate: boolean = false

    closeDialog(value: boolean){
      this.showDialogCreate = false;
      this.getData();
    }

    save (value: boolean)
    {
        if (value == true)
            this.getData()
    }

    draw() {
      this.drawer = !this.drawer;
    }

    openDetail(value: number){
        this.$router.push({name: 'equipment-instruction-view-id', params: { id: value }});
    }

    created() {
        this.getData();
    }

    async getData()
    {
      this.load = true;
      let data = await this.$instructions.view(this.options, this.filterBy);
      this.gridData = data['data']
      this.totalRecord = data['totalRecords']
    }

    async download(item: any) {
      try {
        if (item.fileId == null) {
          this.$toast.info("Отсутствует документ для экспорта.");
          return;
        }
        await this.$files.download(item.fileId);
      }
      catch (e) {
        this.$toast.error("Ошибка во время экспорта файла.");
      }
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
}
</script>
