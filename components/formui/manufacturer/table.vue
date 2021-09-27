<template>
    <v-dialog dense v-model="getVisible" @input="closeDialog()">
        <v-card>
            <v-card-title>Производители</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-data-table
                single-select
                calculate-widths
                dense
                v-model="selected"
                :show-select="true"
                :headers="tableColumn"
                :items="gridData"
                :items-per-page="50"
                :loading="load"
                :options.sync="options"
                :server-items-length="totalRecord"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus',
                    itemsPerPageOptions: [10, 50, 100],
                    itemsPerPageText: 'Количество записей',
                }">
                <template #top>
                    <v-toolbar color="white" flat>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on" icon @click="getData()"><v-icon>mdi-refresh</v-icon></v-btn>
                            </template>
                            <span>Обновить</span>
                        </v-tooltip>
                        <v-divider inset vertical></v-divider>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on" icon @click="showDialogCreate = true"><v-icon>mdi-plus</v-icon></v-btn>
                            </template>
                            <span>Создать производителя</span>
                        </v-tooltip>
                        <v-divider inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on" icon @click="draw()"><v-icon>mdi-filter</v-icon></v-btn>
                            </template>
                            <span>Фильтрация</span>
                        </v-tooltip>
                    </v-toolbar>
                </template>
                </v-data-table>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
            </v-card-actions>
        </v-card>
        <v-navigation-drawer v-model="drawer" absolute right temporary></v-navigation-drawer>
        <create :visible="showDialogCreate" @close="closeDialogCreate()" @save="Save"></create>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator';
import Create from './create.vue'

@Component({ components: { Create }})
export default class ManufacturerTable extends Vue {
    tableColumn: Array<object> = [
        { text: 'Имя', align: 'start', sortable: true, value: 'name'},
        { text: 'Страна', align: 'start', sortable: true, value: 'Country'},
        { text: 'Город', align: 'start', sortable: true, value: 'City'}
    ]
    gridData: Array<object> = []
    selected: Array<object> = []
    options: Object = {}
    totalRecord: number = 0
    load: boolean = false
    drawer: boolean = false
    showDialogCreate: boolean = false
    createdItem: boolean = false

    @Prop({default: false}) visible!: boolean

    closeDialogCreate(value: boolean){
        this.showDialogCreate = false;
    }

    Save (value: boolean) {
        if (value == true)
            this.getData()
    }

    closeDialog(value: any){
        this.$emit('close', value);
    };

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        this.closeDialog(value);
    };

    draw() {
      this.drawer = !this.drawer;
    }

    created() {
        this.getData();
    }

    async getData() {
        try
        {
            this.load = true;
            let url: string = "";

            if (this.options.sortBy.length <= 0)
                url = `api/v1/manufacturer?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}`;
            else
                url = `api/v1/manufacturer?pageNumber=${this.options.page}&pageSize=${this.options.itemsPerPage}&sortBy=${this.options.sortBy[0]} ${this.options.sortDesc[0] ? "desc" : ""}`;

            await this.$axios.get(url).then(response => {
                    this.gridData = response.data["data"]
                    this.totalRecord = response.data['totalRecords']
                }
            );

            this.$toast.success("Производители успешно загружены.");
            this.load = false
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки производетелей.");
            this.load = false
        }
    }

    @Watch("options", { deep: true })
    watchToOptions(newVal: Object){
        this.getData()
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>){
        if (newVal.length > 0)
            this.load = false
    }

    @Watch("selected")
    watchToSelected(newVal: Array<object>){
        if (Object.keys(newVal).length > 0)
        {
            this.$emit('item-selected', newVal[0])
            this.closeDialog(false)
        }
    }
}
</script>