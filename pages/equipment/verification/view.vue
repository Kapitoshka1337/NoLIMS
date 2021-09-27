<template>
  <v-row>
    <v-col cols="12">
      <v-data-table calculate-widths
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
          itemsPerPageText: 'Количество строк',
        }">
        <template #top>
          <v-toolbar color="white" flat>
            <v-toolbar-title style="margin-right: 10px">Поверки</v-toolbar-title>
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
                <v-btn v-bind="attrs" v-on="on" icon @click="onSubmitDelete()" :disabled="!canDelete()"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
              <span>Удалить оборудование из поверки</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="printCsm()"><v-icon>mdi-printer</v-icon></v-btn>
              </template>
              <span>Печать заявки в ЦСМ</span>
            </v-tooltip>
            <v-divider inset vertical></v-divider>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="onSubmit()"><v-icon>mdi-play</v-icon></v-btn>
              </template>
              <span>Запустить поверку</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="onCancelVerification()"><v-icon>mdi-cancel</v-icon></v-btn>
              </template>
              <span>Отменить поверку</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="beforeRecieved()" :disabled=true><v-icon>mdi-download</v-icon></v-btn>
              </template>
              <span>Получить из ЦСМ</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-upload</v-icon></v-btn>
              </template>
              <span>Отдать в отдел</span>
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
                <v-btn v-bind="attrs" v-on="on" icon @click="beforeRecieved(item)" :disabled="item.statusId == 1 || item.statusId == 3"><v-icon>mdi-download</v-icon></v-btn>
              </template>
              <span>Получить из ЦСМ</span>
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
                              <v-text-field dense label="Имя оборудования" outlined v-model="filterBy.equipmentName"></v-text-field>
                        </v-col>
                        <v-col cols="9">
                              <v-text-field dense label="Модель" outlined v-model="filterBy.equipmentModel"></v-text-field>
                        </v-col>
                        <v-col cols="9">
                              <v-text-field dense label="Серийный номер" outlined v-model="filterBy.equipmentSerialNumber"></v-text-field>
                        </v-col>
                        <v-col cols="9">
                              <v-autocomplete :items="statusesId" :clearable="true" outlined dense label="Состояние" v-model="filterBy.statusId"></v-autocomplete>
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
      <passed-dialog :visible="showPassed" @close="closeDialog()" :equipment="getSelected()" :internal-submit="false"></passed-dialog>
      <csm-dialog :visible="showPrintCsm" @close="closeCsmDialog()" :equipments="EquipmentsId"></csm-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import passedDialog from '../../../components/modal/passed.vue';
import csmDialog from '../../../components/modal/csm.vue';

  @Component({ components: { passedDialog, csmDialog } })
  export default class VerificationView extends Vue {
    tableColumn: Array<object> = [
      { text: 'Номер', align: 'start', sortable: true, value: 'equipment.number' },
      { text: 'Оборудование', align: 'start', sortable: true, value: 'equipment.name' },
      { text: 'Модель', align: 'start', sortable: true, value: 'equipment.model' },
      { text: 'Серийный номер', align: 'start', sortable: true, value: 'equipment.serialNumber' },
      { text: 'Состояние', align: 'start', sortable: true, value: 'status.name' },
      { text: '', align: 'start', sortable: false, value: 'actions' }
    ]
    gridData: Array<object> = []
    selected: Array<IEquipment> = []
    options: Object = {}
    filterBy: Object = {}
    totalRecord: number = 0
    load: boolean = false
    loadPlay: boolean = false
    dialogPlay: boolean = false
    dialogDelete: boolean = false
    numberTicket: string = ""
    drawer: boolean = false
    upload: boolean = true
    showPassed: boolean = false
    showPrintCsm: boolean = false
    equipment: IEquipment = {}
    equipmentId: Array<number> = []
    statusesId: Array<Object> = [
        { value: 1, text: "Подготовка"},
        { value: 2, text: "На поверке"},
        { value: 3, text: "Получено с поверки"},
        { value: 4, text: "Отдано в отдел"}
    ]

    canDelete()
    {
        return this.$permissions.can('delete', 'verification');
    }

    created() {
      this.getData();
    }

    async getData() {
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

    @Watch("options", { deep: true })
    watchToOptions(newVal: Object){
        this.getData()
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>) {
      if (newVal.length > 0)
        this.load = false
    }

    draw() {
      this.drawer = !this.drawer;
    }

    onShowDialog() {
      if (this.selected == null || this.selected.length <= 0) {
        this.$toast.info("Не выбрано оборудование для отправки на поверку.");
        return
      }

      this.dialogPlay = true;
    }

    getSelected() {
      if (this.equipment == null)
      {
        this.showPassed = false
        return
      }
      
      return this.equipment;
    }

    // Запустить поверку.
    async onSubmit() {
      if (this.selected == null || this.selected.length <= 0)
      {
          this.$toast.info("Не выбрано оборудование для отправки на поверку.");
          return
      }

      let badEq = this.selected.filter(el => el.statusId > 2) 

      if (badEq.length > 0)
      {
        this.$toast.error("Оборудование не отправлено на поверку. Проверьте состояние!");
          return
      }

      let obj = { equipments: [] }
      
      this.selected.forEach(el => {
        obj.equipments.push({ equipmentId: el.id })
      })

      try {
        this.loadPlay = true;
        await this.$axios.post("api/v1/verification/play", obj).then(response => (
          this.selected = [],
          this.onCloseDialog(),
          this.getData(),
          this.$toast.success("Оборудование отправлено на поверку.")
        ));
      }
      catch (e) {
        this.$toast.error("Ошибка во время выполенения.");
      }
    }

    // Отменить поверку.
    async onCancelVerification(){
      if (this.selected == null || this.selected.length <= 0)
      {
          this.$toast.info("Не выбрано оборудование для сброса состояния.");
          return
      }

      let badEq = this.selected.filter(el => el.statusId > 2) 

      if (badEq.length > 0)
      {
          this.$toast.error("Сброс состояния оборудования не возможен. Проверьте состояние!");
          return
      }

      let obj = { verifications: [] }

      this.selected.forEach(el => {
        obj.verifications.push({ verificationId: el.id })
      })

      try {
        this.loadPlay = true;
        await this.$axios.post("api/v1/verification/reset", obj).then(response => (
          this.selected = [],
          this.onCloseDialog(),
          this.getData(),
          this.$toast.success("Состояние оборудование сброшено..")
        ));
      }
      catch (e) {
        this.$toast.error("Ошибка во время выполенения.");
      }
    }

    closeDialog(){
			this.showPassed = false;
      this.equipment = {}
		}

    closeCsmDialog() {
      this.showPrintCsm = false;
      this.selected = [];
    }

    beforeRecieved (item: IEquipment) {
      if (item == null){
        this.$toast.info("Не выбрано оборудование.");
        return
      }

      this.equipment = item.equipment
      this.showPassed = true;
		}

    onCloseDialog() {
      this.dialogPlay = false;
      this.loadPlay = false;
    }

    async onSubmitDelete() {
      if (this.selected == null || this.selected.length <= 0)
      {
          this.$toast.info("Не выбрано оборудование для удаления.");
          return
      }

      let badEq = this.selected.filter(el => el.statusId > 1) 

      if (badEq.length > 0)
      {
          this.$toast.error("Удаление оборудования не возможно. Проверьте состояние!");
          return
      }

      let obj = { equipments: [] }

      this.selected.forEach(el => {
        obj.equipments.push({ equipmentId: el.id })
      })

      try {
        this.loadPlay = true;
        await this.$axios.post("api/v1/verification/delete", obj).then(response => (
          this.selected = [],
          this.getData(),
          this.$toast.success("Оборудование удалено из поверки.")
        ));
      }
      catch (e) {
        this.$toast.error("Ошибка во время выполенения.");
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
            url = `api/v1/verification?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}`;
        else
            url = `api/v1/verification?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}&sortBy=${this.options.sortBy[0]} ${this.options.sortDesc[0] ? "desc" : ""}`;
        
        return url
    }

    submitFilter(){
        this.getData()
    }

    clearFilter(){
        this.filterBy = {}
        this.getData()
    }

    get EquipmentsId() {
      if (this.equipmentId.length > 0)
        return this.equipmentId;

      return null;
    }

    printCsm() {
      if (this.selected == null || this.selected.length <= 0) {
        this.$toast.info("Не выбрано оборудование для печати заявки в Удмуртский ЦСМ.");
        return;
      }

      this.equipmentId = []

      this.selected.forEach(el => {
        this.equipmentId.push(el.equipmentId)
      })

      this.showPrintCsm = true;
    }
  }
</script>
