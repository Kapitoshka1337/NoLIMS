<template>
  <v-row>
    <v-col cols="11">
        <v-text-field readonly dense label="Производитель" outlined v-model="manufacturer.name"></v-text-field>
    </v-col>
    <v-col cols="1" v-if="showView">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="showTable = true"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </template>
            <span>Производители</span>
        </v-tooltip>
    </v-col>
    <table-manufacturer :visible="showTable" @close="closeTable()" @item-selected="selectedItem"></table-manufacturer>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator"
import TableManufacturer from './table.vue'

@Component({ components: { TableManufacturer } })
export default class ManufacturerAutocomplete extends Vue
{
    loadSelect: boolean = false
    showTable: boolean = false

    @Prop({default: true}) showView!: boolean
    @Prop({default: null}) existedId!: number

    public manufacturer: object = {}

    closeTable(value: boolean){
        this.showTable = false;
    }

    selectedItem (value: object){
        this.manufacturer = value
        this.$emit('select-id', value.id)
        this.$emit('select-object', value)
    }

    async getData() {
        try
        {
            await this.$axios.get(`api/v1/manufacturer/${this.existedId}`).then(response => {
                    this.manufacturer = response.data["data"]
                }
            );

            this.$toast.success("Подразделение успешно загружено.");
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
    }
}
</script>