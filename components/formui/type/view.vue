<template>
  <v-row>
    <v-col cols="11">
        <v-text-field readonly dense label="Тип" outlined v-model="type.name"></v-text-field>
    </v-col>
    <v-col cols="1" v-if="showView">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="showTable = true"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </template>
            <span>Типы оборудования</span>
        </v-tooltip>
    </v-col>
    <table-department :visible="showTable" @close="closeTable()" @item-selected="selectedItem"></table-department>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator"
import TableDepartment from './table.vue'

@Component({ components: { TableDepartment } })
export default class TypeAutocomplete extends Vue
{
    loadSelect: boolean = false
    showTable: boolean = false

    @Prop({default: true}) showView!: boolean
    @Prop({default: null}) existedId!: number

    public type: object = {}

    get ExistedId(){
        if (this.existedId != null || this.existedId > 0)
            return this.existedId
    }

    closeTable(value: boolean){
        this.showTable = false;
    }

    selectedItem (value: object){
        this.type = value
        this.$emit('select-id', value.id)
        this.$emit('select-object', value)
    }

    async getData() {
        try
        {
            await this.$axios.get(`api/v1/type/${this.existedId}`).then(response => {
                    this.type = response.data["data"]
                }
            );

            this.$toast.success("Тип оборудования успешно загружен.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки типа оборудования.");
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

        this.type = {}
    }
}
</script>