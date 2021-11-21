<template>
    <v-dialog dense v-model="getVisible" @input="closeDialog()">
        <v-card>
            <v-card-text>
                <FormuiLocationTableComp @item-selected="selectedItem" :singleSelect="true"></FormuiLocationTableComp>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator';

@Component
export default class MovingDialogTable extends Vue {
    @Prop({default: false}) visible!: boolean
    @Prop({default: null}) findId!: number

    closeDialog(value: any){
      this.$emit('close', value);
    }

    get getVisible() {
        return this.visible;
    }

    set getVisible(value: any) {
        this.closeDialog(value);
    }

    selectedItem (value: object){
        this.$emit('select-id', value.id)
        this.$emit('select-object', value)
        this.closeDialog(false)
    }
}
</script>
