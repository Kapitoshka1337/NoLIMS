<template>
    <v-row>
        <v-col cols="12">
            <v-card outlined>
                <v-card-title>Добавление поступления</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field outlined dense label="Заказ №" clearable v-model="order.num_order"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field type="date" outlined dense label="Дата заказа" clearable v-model="order.date_order"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row dense justify="start">
                        <v-col cols="3" v-for="card in selected" :key="card.id">
                            <v-card class="mx-auto" max-width="400px" outlined>
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title class="text-md-body-1">{{ card.material }}</v-list-item-title>
                                        <v-list-item-subtitle>({{ card.id }}) {{ card.type }} ({{ card.measure }})</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="card.amount" clearable type="number" outlined dense label="Количество"></v-text-field>
                                            <v-text-field v-model="card.density" clearable type="number" outlined dense label="Плотность"></v-text-field>
                                            <v-autocomplete v-model="card.id_location" clearable :items="dropdownLocation" outlined dense label="Местоположение"></v-autocomplete>
                                            <v-textarea v-model="card.post_name" :rows="2" :height="100" outlined dense label="Наименование в накладной"></v-textarea>
                                            <v-text-field v-model="card.date_create" clearable type="date" outlined dense label="Дата изготовления"></v-text-field>
                                            <v-text-field v-model="card.shelf_life" clearable type="date" outlined dense label="Срок хранения"></v-text-field>
                                            <v-textarea v-model="card.description" :rows="2" :height="100" outlined dense label="Дополнительная информация"></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn block color="error" :ripple="false" @click="deleteMaterial(card)">Удалить</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="orange" :ripple="false" @click=loadMaterials() :loading="loading"><v-icon color="white">mdi-magnify</v-icon></v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submitOrder()" :ripple="false" v-bind:disabled="!selected.length || !order.num_order || !order.date_order" :loading="submit">Добавить</v-btn>
                    <v-btn color="error" :ripple="false" to="/reagent/arrivals">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-dialog v-model="dialogMaterial" max-width="1256px">
            <v-card>
                <v-card-text>
                    <v-data-table calculate-widths dense item-key="id" v-model="selected"
                        :headers="tableColumn"
                        :items="materials"
                        :items-per-page="50"
                        :search="search"
			            :show-select="true"
                        :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [10, 30, 50, 100], itemsPerPageText: 'Отобразить на странице'}">
                        <template v-slot:top>
                            <v-toolbar flat dense>
                                <v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
                            </v-toolbar>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success">ОК</v-btn>
                    <v-btn color="error" @click="dialogMaterial = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    data(){
        return {
            tableColumn: [
                { text: 'Код', align: 'start', sortable: true, value: 'id'},
                { text: 'Материал', align: 'start', sortable: true, value: 'material'},
                { text: 'Тип', align: 'start', sortable: true, value: 'type'},
                { text: 'Ед.изм.', align: 'start', sortable: true, value: 'measure'}
            ],
            search: '',
            materials: [],
            selected: [],
            listLocations: [],
            order: {
                num_order: '',
                date_order: '',
                materials: null
            },
            dialogMaterial: false,
            loading: false,
            submit: false
        }
    },
    computed: {
        dropdownLocation(){
            if(!this.listLocations.length)
                this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error.response.data.message)));
            else
            {
                let result = [];
				for (let str of this.listLocations)
                    result.push({value: str['id'], text: `${str['cabinet_number']} ${str['place']} ${str['notation']}`});
                return result;
            }
        }
    },
    methods: {
        loadMaterials(){
            if(!this.materials.length)
            {
                this.loading = true;
                this.$http.get('/api/reagent/material').then(response => (this.materials = response.data, this.loading = false, this.dialogMaterial = true)).catch(error => (this.loading = false, alert(error.response.data.message)));
            }
            else this.dialogMaterial = true;
        },
        deleteMaterial(material) {
            var idx = this.selected.indexOf(material);
            if (idx > -1) this.selected.splice(idx, 1);
        },
        submitOrder(){
            this.order.materials = this.selected;
            this.submit = true;
            this.$http.post('/api/reagent/arrivals', this.order).then(response => (this.$router.push({path: '/reagent/storage'}))).catch(error => (this.submit = false, alert(error.response.data.message)));            
        }
    }
}
</script>