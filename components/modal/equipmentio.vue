<template>
	<v-dialog dense v-model="getVisible" max-width="1256px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Исследовательское оборудование</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea :rows="2" :height="60" dense label="Наименование" outlined v-model="equipment.name"></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <FormuiManufacturerView @select-id="getManufacturerId" :show-view="true"></FormuiManufacturerView>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field clearable dense label="Модель" outlined v-model="equipment.model"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field clearable dense label="Серийный номер" outlined v-model="equipment.serialNumber"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field type="date" clearable dense label="Дата изготовления" outlined v-model="equipment.dateCreate"></v-text-field>
                            </v-col>
                            <!-- <v-col cols="4">
                                <v-autocomplete clearable outlined dense label="Вид"></v-autocomplete>
                            </v-col> -->
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <FormuiDepartmentView @select-id="getDepartmentId" :show-view="true"></FormuiDepartmentView>
                            </v-col>
                            <v-col cols="6">
                                <FormuiLocationView @select-id="getlocationId" :show-view="true"></FormuiLocationView>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field clearable dense label="Инвентарный номер" outlined v-model="equipment.inventoryNumber"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field clearable dense label="Регистрационный номер" outlined v-model="equipment.number"></v-text-field>
                            </v-col>
                            <!-- <v-col cols="6">
                                <instruction @select="getInstructionId" :show-create="true" :show-view="false"></instruction>
                            </v-col> -->
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field clearable dense label="Точность" outlined v-model="equipment.accuracy"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field clearable dense label="Диапазон работы" outlined v-model="equipment.measuringWork"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-chip>±</v-chip>
                    <v-chip>°</v-chip>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submit()" :loading="loading">ОК</v-btn>
                    <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "nuxt-property-decorator"

@Component
export default class DialogCreateEquipmentIo extends Vue
{
    public equipment = {} as IEquipmentIO
    loading: boolean = false

    @Prop({default: false}) visible!: boolean

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
        this.equipment = {} as IEquipmentIO
    };

    getManufacturerId (value: number)
    {
        this.equipment.manufacturerId = value;
    }

    getDepartmentId (value: number)
    {
        this.equipment.departmentId = value;
    }

    getlocationId (value: number)
    {
        this.equipment.locationId = value;
    }

    getInstructionId (value: number)
    {
        this.equipment.instructionId = value;
    }

    submit(){
        try
        {
            this.loading = true;
            this.equipment.typeId = 2;
            this.$axios.post('/api/v1/equipment/io', this.equipment).then(reponse => {
              this.loading = false;
              this.closeDialog(true);
              this.$toast.success("Испытательное оборудование добавлено.");
            }).catch(error => {
              this.closeDialog(false);
              this.$toast.error("Ошибка во время добавление испытательного оборудования.");
              this.loading = false;
            })
        }
        catch (e)
        {
            this.closeDialog(false);
            this.$toast.error("Ошибка во время добавление испытательного оборудования.");
            this.loading = false
        }
    };

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        // this.closeDialog(value);
    };
}
</script>
