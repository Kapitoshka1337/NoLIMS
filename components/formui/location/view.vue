<template>
  <v-row>
    <v-col :cols="11">
        <v-text-field readonly dense label="Местоположение" outlined v-model="location.numberRoom"></v-text-field>
        <!-- <v-autocomplete @input="selectItem" :loading="loadSelect" :disabled="loadSelect" :items="dropdown" dense label="Местоположение" outlined></v-autocomplete> -->
    </v-col>
    <v-col cols="1" v-if="showView">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="showTable = true"><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </template>
            <span>Местоположения</span>
        </v-tooltip>
    </v-col>
    <FormuiLocationDialog :visible="showTable" @close="closeTable()" @select-object="selectedItem"></FormuiLocationDialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "nuxt-property-decorator"

@Component
export default class LocationAutocomplete extends Vue
{
    loadSelect: boolean = false
    showTable: boolean = false

    @Prop({default: true}) showView!: boolean
    @Prop({default: null}) existedId!: number

    public location: object = {}

    get ExistedId(){
        if (this.existedId != null || this.existedId > 0)
            return this.existedId
    }

    closeTable(value: boolean){
        this.showTable = false;
    }

    selectedItem (value: object){
        this.location = value
        this.$emit('select-id', value.id)
        this.$emit('select-object', value)
    }

    async getData() {
        try
        {
            if (this.$permissions.can('view', 'location'))
                await this.$axios.get(`api/v1/location/${this.existedId}`).then(response => {
                        this.location = response.data["data"]
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

        this.location = {}
    }
}
</script>