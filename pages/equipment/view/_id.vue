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
                        <v-tab>Техническое обслуживание</v-tab>
                        <v-tab-item>
                            <v-card-text>
                                <v-form v-if="Object.keys(gridData).length > 0">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field clearable dense label="Наименование" outlined v-model="gridData.name"></v-text-field>
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
                                            <v-text-field clearable type="date" dense label="Дата изготовления" outlined v-model="gridData.dateCreate"></v-text-field>
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
                                        <v-col cols="6">
                                            <tags @select-id="getTagsId" :show-view="this.$permissions.can('edit', 'equipment')" :existed-id="gridData.tagId"></tags>
                                        </v-col>
                                        <v-col cols="6">
                                            <FormuiLocationView @select-id="getLocationId" :show-view="this.$permissions.can('edit', 'equipment')" :existed-id="gridData.locationId"></FormuiLocationView>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-textarea :rows="2" :height="100" dense label="Примечание" outlined v-model="gridData.description"></v-textarea>
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
                                <FormuiCheckTableComp :showSelect="false" :showToolbar="false" :tableColumn="checkTableHeaders" :equipmentId="$route.params.id"></FormuiCheckTableComp>
                            </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                          <v-card-text>
                              <FormuiMovingTableComp :singleSelect="false" :showSelect="false" :showToolbar="false" :equipmentId="$route.params.id" :showFilterPanel="true"></FormuiMovingTableComp>
                          </v-card-text>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card-text>
                                ТО
                            </v-card-text>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-card-actions>
                    <v-chip>±</v-chip>
                    <v-chip>°</v-chip>
                    <v-spacer></v-spacer>
                    <v-btn color="success" :disabled="!changed" @click="update()" v-can:edit="equipment" :loading="updateLoad">Сохранить</v-btn>
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
import Tags from '../../../components/formui/tags/view.vue'

@Component({ components: { Department, Manufacturer, Type, Tags } })
export default class EquipmentDetails extends Vue
{
    checkTableHeaders: Array<object> = [
        { text: 'Пройденная', align: 'start', sortable: false, value: 'currentCheck', visible: true},
        { text: 'Предстоящая', align: 'start', sortable: false, value: 'nextCheck', visible: true},
        { text: 'Вид документа', align: 'start', sortable: false, value: 'documentKind.name', visible: true},
        { text: '№ документа', align: 'start', sortable: false, value: 'numberDocument', visible: true},
        { text: 'Экспорт', align: 'start', sortable: false, value: 'fileId', visible: true}
    ]

    gridData: Object = {}
    changed: boolean = false
    updateLoad: boolean = false

    formatDate(date: any) {
      return date === null ? null : date.split("T")[0];
    }

    async getData (){
        try
        {
            await this.$axios.get(`api/v1/equipment/detail/${this.$route.params.id}`).then(response => {
                    this.gridData = response.data["data"]
                }
            );
            this.changed = false
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки оборудования.");
        }
    }

    formatDateLocalDate(date: any){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    getDepartmentId (value: number)
    {
        this.gridData.departmentId = value;
    }
    
    getManufacturerId (value: number)
    {
        this.gridData.manufacturerId = value;
    }

    getTagsId(value: number) {
      this.gridData.tagId = value;
    }

    getTypeId (value: number)
    {
        this.gridData.typeId = value;
    }

    getLocationId (value: number)
    {
        this.gridData.locationId = value;
    }

    @Watch("gridData", { deep: true })
    equipment(newVal: object, oldVal: object) {
        newVal.dateCreate = this.formatDate(newVal.dateCreate)
        newVal.dateCommissioning = this.formatDate(newVal.dateCommissioning)
        this.changed = true
    }

    can()
    {
        return this.$permissions.can('edit', 'equipment');
    }

    created (){
        this.getData()
    }

    activated () {
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
            this.$toast.success("Оборудование обновлено.");
        }
        catch (e)
        {
            this.updateLoad = false
            this.$toast.error("Ошибка во время обновления оборудования.");
        }
    }
}
</script>
