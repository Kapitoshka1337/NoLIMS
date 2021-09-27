<template>
  <v-row>
    <v-col :cols="getCols">
        <v-autocomplete @input="selectItem" :loading="loadSelect" :disabled="loadSelect" :items="dropdown" dense label="Местоположение" outlined></v-autocomplete>
    </v-col>
    <v-col cols="1" v-if="showView">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </template>
            <span>Местоположения</span>
        </v-tooltip>
    </v-col>
    <v-col cols="1" v-if="showCreate">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="showDialogCreate = true"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
            <span>Создать местоположение</span>
        </v-tooltip>
    </v-col>
    <create-location :visible="showDialogCreate" @close="closeDialog()" @save="Save"></create-location>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "nuxt-property-decorator"
import CreateLocation from './create.vue'

@Component({ components: { CreateLocation } })
export default class LocationAutocomplete extends Vue
{
    loadSelect: boolean = false
    showDialogCreate: boolean = false
    createdItenm: boolean = false

    @Prop({default: true}) showCreate!: boolean
    @Prop({default: true}) showView!: boolean
    @Prop({default: null}) departmentId!: boolean

    public locations: Array<ILocation> = {} as ILocation

    closeDialog(value: boolean){
        this.showDialogCreate = false;
    }

    getData ()
    {
        try
        {
            this.loadSelect = true;
            this.$axios.get('/api/v1/location')
            .then(response => (this.locations = response.data['data']))
            this.loadSelect = false
            this.$toast.success("Местоположения успешно загружены.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки местоположений.");
            this.loadSelect = false
        }
    }

    get dropdown(){
        if(this.locations.length > 0)
        {
            let result = [];
            
            for (let row of this.locations)
                result.push( { value: row['id'], text: `${row['name']}` } );
            
            return result;
        }
    };

    get getCols(): string
    {
        if (this.showView && this.showCreate)
            return "10"
        
        if (this.showView && !this.showCreate)
            return "11"

        if (!this.showView && this.showCreate)
            return "11"
        
        return "12"
    }

    selectItem (value: any)
    {
        this.$emit('select', value)
    }

    Save (value: boolean)
    {
        this.createdItenm = value
    }

    created() {
        this.getData()
    }

    @Watch("createdItenm")
    saved(newVal: boolean)
    {
        if (newVal == true)
        {
            this.getData()
        }
    }
}
</script>