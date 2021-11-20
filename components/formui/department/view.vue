<template>
  <v-row>
    <v-col cols="11">
        <v-text-field readonly dense label="Подразделение" outlined v-model="department.name"></v-text-field>
    </v-col>
    <v-col cols="1" v-if="showView">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="showTable = true"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </template>
            <span>Подразделения</span>
        </v-tooltip>
    </v-col>
    <FormuiDepartmentDialog :visible="showTable" @close="closeTable()" @select-object="selectedItem"></FormuiDepartmentDialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator"

@Component
export default class DepartmentAutocomplete extends Vue
{
    loadSelect: boolean = false
    showTable: boolean = false

    @Prop({default: true}) showView!: boolean
    @Prop({default: null}) existedId!: number

    public department: object = {}

    get ExistedId(){
        if (this.existedId != null || this.existedId > 0)
            return this.existedId
    }

    closeTable(value: boolean){
        this.showTable = false;
    }

    selectedItem (value: object){
        this.department = value
        this.$emit('select-id', value.id)
        this.$emit('select-object', value)
    }

    async getData() {
        try
        {
            if (this.$permissions.can('view', 'department'))
                await this.$axios.get(`api/v1/department/${this.existedId}`).then(response => {
                        this.department = response.data["data"]
                        this.$toast.success("Подразделение успешно загружено.")
                    }
                );
            else
                this.$toast.success("У вас нет прав на просмотр подразделений!");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки подразделения.");
        }
    }

    getExistedData(){
        if (this.existedId != null || this.existedId > 0)
            this.getData()
    }

    created() {
        this.getExistedData()
    }

    @Watch("existedId")
    wExistedId(newVal: number){
        if (this.existedId != null || this.existedId > 0)
            this.getData()
        
        this.department = {}
    }
}
</script>