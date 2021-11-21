<template>
	<v-dialog dense v-model="getVisible" max-width="512px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Перемещение оборудования</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <FormuiLocationView :title="'Текущее местоположение'" :showView="false" :existed-id="getLocaionId">></FormuiLocationView>
                            </v-col>
                            <v-col cols="11">
                                <FormuiLocationView :title="'Следующее местоположение'" @select-object="getLocationId"></FormuiLocationView>
                            </v-col>
                            <v-col cols="11">
                                <v-text-field type="date" dense label="Дата перемещения" outlined v-model="location.movingDate"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submit()" :loading="loadingBtn">ОК</v-btn>
                    <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "nuxt-property-decorator"

@Component
export default class DialogCreateMoving extends Vue
{
    loading: boolean = false
    loadingBtn: boolean = false
    loadSelect: boolean = false

    location = {
        equipmentId: 0,
        currentDepartmentId: 0,
        nextDepartmentId: 0,
        currentLocationId: 0,
        nextLocationId: 0,
        movingDate: ""
    }

    locationObject: Object = {}

    @Prop({default: false}) visible!: boolean
    @Prop() equipment!: Object

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
        this.location = {}
        this.locationObject = {}
    };

    getLocationId (value: object)
    {
        this.locationObject = value;
        this.location.nextLocationId = value.id
        this.location.nextDepartmentId = value.department.id
        this.location.nextLocationId = value.id
    }

    async submit(){
        this.loadingBtn = true
        let data = await this.$movings.add(this.location);
        this.location = data['data']
        this.loadingBtn = false
        this.$emit("save", true)
        this.closeDialog(false)
    };

    get Validation(): boolean
    {
        if (Object.keys(this.location).length > 0)
            if (this.location.nextLocationId != null || this.location.nextLocationId > 0)
                return false;


        return true;
    }

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        this.closeDialog(value);
    };

    get getLocaionId() {
        if (this.equipment != null)
            return this.equipment.locationId
        
        return null
    }

    @Watch("equipment")
    wExistedId(newVal: Object){
        if (newVal != null)
        {
            this.location.equipmentId = this.equipment.id
            this.location.currentDepartmentId = this.equipment.department.id
            this.location.currentLocationId = this.equipment.locationId
        }
    }
}
</script>