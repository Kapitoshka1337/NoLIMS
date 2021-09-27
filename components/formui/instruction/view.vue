<template>
  <v-row>
    <v-col :cols="getCols">
        <v-autocomplete @input="selectItem" :loading="loadSelect" :disabled="loadSelect" :items="dropdown" dense label="Инструкция" outlined></v-autocomplete>
    </v-col>
    <v-col cols="1" v-if="showView">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon><v-icon>mdi-dots-horizontal</v-icon></v-btn>
            </template>
            <span>Инструкции</span>
        </v-tooltip>
    </v-col>
    <v-col cols="1" v-if="showCreate">
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="showDialogCreate = true"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
            <span>Создать инструкцию</span>
        </v-tooltip>
    </v-col>
    <create :visible="showDialogCreate" @close="closeDialog()" @save="Save"></create>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "nuxt-property-decorator"
import Create from './create.vue'

@Component({ components: { Create } })
export default class InstructionAutocomplete extends Vue
{
    loadSelect: boolean = false
    showDialogCreate: boolean = false
    createdItenm: boolean = false

    @Prop({default: true}) showCreate!: boolean
    @Prop({default: true}) showView!: boolean

    public instruction: Array<IInstruction> = {} as IInstruction

    closeDialog(value: boolean){
        this.showDialogCreate = false;
    }

    getData ()
    {
        try
        {
            this.loadSelect = true;
            this.$axios.get('/api/v1/instruction')
            .then(response => (this.instruction = response.data['data']))
            this.loadSelect = false
            this.$toast.success("Инструкции успешно загружены.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки инструкций.");
            this.loadSelect = false
        }
    }

    get dropdown(){
        if(this.instruction.length > 0)
        {
            let result = [];
            
            for (let row of this.instruction)
                result.push( { value: row['id'], text: `${row['name']}, ${row['number']}` } );
            
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