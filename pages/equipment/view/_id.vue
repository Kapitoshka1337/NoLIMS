<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-text>
                    <v-tabs>
                        <v-tab>Карточка</v-tab>
                        <v-tab>Характеристики</v-tab>
                        <v-tab>Поверки</v-tab>
                        <v-tab>Перемещения</v-tab>
                        <v-tab>Ремонт</v-tab>
                        <v-tab>Техническое обслуживание</v-tab>
                        <v-tab-item>
                            <v-card-text>
                                <v-form v-if="Object.keys(gridData).length > 0">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field clearable dense label="Имя" outlined v-model="gridData.name"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <manufacturer @select-id="getManufacturerId" :show-view="this.$permissions.can('edit', 'equipment')" :existed-id="gridData.manufacturerId"></manufacturer>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field clearable dense label="Инвентарный номер" outlined v-model="gridData.inventoryNumber"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field clearable dense label="Серийный номер" outlined v-model="gridData.serialNumber"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field clearable dense label="Модель" outlined v-model="gridData.model"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field clearable type="date" dense label="Дата изготовления" outlined v-model="gridData.dateCreated"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field clearable dense label="Номер" outlined v-model="gridData.number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <type @select-id="getTypeId" :show-view="this.$permissions.can('edit', 'equipment')" :existed-id="gridData.typeId"></type>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field clearable type="date" dense label="Дата ввода в эксплуатацию" outlined v-model="gridData.dateCommissioning"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <department @select-id="getDepartmentId" :show-view="this.$permissions.can('edit', 'equipment')" :existed-id="gridData.departmentId"></department>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-textarea :rows="2" :height="100" dense label="Примечание" outlined></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text>
                                <v-form>
                                    <v-row v-if="Object.keys(gridData).length > 0">
                                        <v-col cols="12" md="12" v-if="gridData.typeId == 3">
                                            <v-text-field clearable dense label="ФИФ" outlined v-model="gridData.fifNumber"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" v-if="gridData.typeId == 2 || gridData.typeId == 3">
                                            <v-text-field clearable dense label="Точность" outlined v-model="gridData.accuracy"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" v-if="gridData.typeId == 3">
                                            <v-text-field clearable dense label="Класс точности" outlined v-model="gridData.classAccuracy"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" v-if="gridData.typeId == 3">
                                            <v-text-field clearable dense label="Диапазон измерений" outlined v-model="gridData.measuringRange"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" v-if="gridData.typeId == 2">
                                            <v-text-field clearable dense label="Диапазон работы" outlined v-model="gridData.measuringWork"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="12" v-if="gridData.typeId == 1">
                                            <v-textarea :rows="2" :height="100" dense label="Дополнительные характеристики" outlined v-model="gridData.characteristics"></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text>
                                <v-data-table dense :headers="tableColumn" :items="gridData.checks" :items-per-page="5" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [30, 50, 100, -1], itemsPerPageText: 'Количество записей'}">
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
                                    <template v-slot:no-data>
                                        Пока ничего нет :(
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text>
                                Перемещения
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text>
                                Ремонт
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text>
                                ТО
                            </v-card-text>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-card-actions v-if="can()">
                    <v-spacer></v-spacer>
                    <v-btn color="success" :disabled="!changed" @click="update()" :loading="updateLoad">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "nuxt-property-decorator"
import Department from '../../../components/formui/department/view.vue'
import Manufacturer from '../../../components/formui/manufacturer/view.vue'
import Type from '../../../components/formui/type/view.vue'
import FileSaver from 'file-saver'

@Component({ components: { Department, Manufacturer, Type } })
export default class EquipmentDetails extends Vue
{
    tableColumn: Array<object> = [
        { text: 'Пройденная', align: 'start', sortable: false, value: 'currentCheck' },
        { text: 'Предстоящая', align: 'start', sortable: false, value: 'nextCheck' },
        { text: 'Вид документа', align: 'start', sortable: false, value: 'documentKind.name' },
        { text: '№ документа', align: 'start', sortable: false, value: 'numberDocument' },
        { text: 'Документ', align: 'start', sortable: false, value: 'fileId'}
    ]

    gridData: Object = {}
    changed: boolean = false
    updateLoad: boolean = false

    async getData (){
        try
        {
            await this.$axios.get(`api/v1/equipment/detail/${this.$route.params.id}`).then(response => {
                    this.gridData = response.data["data"]
                }
            );
            this.changed = false
            this.$toast.success("Оборудование успешно загружено.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки оборудования.");
        }
    }

    formatDate(date: any){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    formatDateUTC(date: any){
        return date === null ? null : new Date(date).toUTCString().split(',')[0];
    }

    getDepartmentId (value: number)
    {
        this.gridData.departmentId = value;
    }
    
    getManufacturerId (value: number)
    {
        this.gridData.manufacturerId = value;
    }

    getTypeId (value: number)
    {
        this.gridData.typeId = value;
    }

    @Watch("gridData", { deep: true })
    equipment(newVal: object, oldVal: object){
        this.changed = true
    }

    can()
    {
        return this.$permissions.can('edit', 'equipment');
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
                this.$toast.success("Файл успешно экспортирован.");
            })
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время экспорта файла.");
        }
    }

    created (){
        this.getData()
    }

    activated(){
        this.getData()
    }

    async update(){
        if (!this.changed)
            return
        
        try
        {
            this.updateLoad = true
            await this.$axios.post(`api/v1/equipment/update/${this.$route.params.id}`, this.gridData).then(response => {
                    this.getData()
                    this.updateLoad = false
                }
            );
            this.changed = false
            this.$toast.success("Оборудование успешно обновлено.");
        }
        catch (e)
        {
            this.updateLoad = false
            this.$toast.error("Ошибка во время обновления оборудования.");
        }
    }

    paramId () {
        return this.$route.params.id
    }
}
</script>