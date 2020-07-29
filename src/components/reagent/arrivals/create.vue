<template>
    <sui-grid class="padded">
        <sui-grid-row>
            <sui-grid-column>
                <menu-nav></menu-nav>
            </sui-grid-column>
        </sui-grid-row>
        <sui-grid-row>
            <sui-grid-column>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields fields="three" inline>
                                <sui-form-field width="five">
                                    <label>Заказ №</label>
                                    <sui-input type="text" v-model="order.number"></sui-input>
                                </sui-form-field>
                                <sui-form-field width="three">
                                    <label>от</label>
                                    <sui-input type="date" v-model="order.date"></sui-input>
                                </sui-form-field>
                                <!--<sui-form-field width="eight">
                                    <label>Отдел</label>
                                    <sui-input readonly></sui-input>
                                </sui-form-field>-->
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-card-group :items-per-row="4">
                            <sui-card v-for="(material, index) in selectedMaterials" :key="material.id">
                                <sui-card-content>
                                    <sui-card-header>{{ material.material }}</sui-card-header>
                                    <sui-card-meta>{{ material.type }} ({{ material.measure }})</sui-card-meta>
                                </sui-card-content>
                                <sui-card-content>            
                                    <sui-form>
                                        <sui-form-field>
                                            <label>Количество</label>
                                            <input type="number" v-model="material.amount">
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Местоположение</label>
                                            <sui-dropdown :options="forDropdown" search selection v-model="material.id_location"></sui-dropdown>
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Наименование в накладной</label>
                                            <textarea cols="30" rows="3" v-model="material.post_name"></textarea>
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Дата изготовления</label>
                                            <input type="date" v-model="material.date_create">
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Годен до</label>
                                            <input type="date" v-model="material.shelf_life">
                                        </sui-form-field>
                                    </sui-form>
                                </sui-card-content>
                                <sui-card-content>
                                    <sui-button content="Удалить" floated="left" color="red" fluid v-on:click="deleteMaterial(index, material)"></sui-button>
                                </sui-card-content>
                            </sui-card>
                        </sui-card-group>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-button icon="search" floated="left" color="yellow" v-on:click="showModal"></sui-button>
                        <router-link to="/reagent/arrivals" is="sui-button" class="ui right floated orange" content="Отмена"></router-link>
                        <sui-button content="Добавить" floated="right" color="green" v-bind:disabled="!selectedMaterials.length || !order.number || !order.date" v-on:click="submitOrder"></sui-button>
                    </sui-card-content>
                </sui-card>
                <search-material-modal :open="isShowModal" @save="hideModal" @close="closeModal" :material="materials"></search-material-modal>
            </sui-grid-column>
        </sui-grid-row>
    </sui-grid>
</template>

<script>
import SearchMaterialModal from '../modals/search_material.vue';

export default {
    components: {
        'search-material-modal': SearchMaterialModal
    },
    data(){
        return {
            isShowModal: false,
            materials: [],
            selectedMaterials: [],
            listLocations: [],
            order: {
                number: '',
                date: '',
                materials: null
            }
        }
    },
    watch:{
        selectedMaterials(){
            if(!this.listLocations.length)
                this.$http.get('/api/reagent/locations').then(response => (this.listLocations = response.data)).catch(error => (alert(error)));
        }
    },
    computed:{
        forDropdown(){
            if(this.listLocations.length)
            {
                let rows = [];
                for(let item in this.listLocations){
                    rows.push({
                        key: this.listLocations[item].id,
                        value: this.listLocations[item].id,
                        text: this.listLocations[item].cabinet_number + " " + this.listLocations[item].place + " " + this.listLocations[item].notation
                    });
                }
                return rows;
            }
        }
    },
    methods: {
        hideModal(data){
            this.selectedMaterials = [];
            for(let material in data)
                this.selectedMaterials.push(data[material]);
            this.isShowModal = false;
        },
        closeModal(){
            this.isShowModal = false;
        },
		showModal(){
            if(this.materials.length > 0) this.isShowModal = true;
            else
                this.$http.get('/api/reagent/material').then(response => (this.materials = response.data, this.isShowModal = true)).catch(error => (alert(error)));
        },
		deleteMaterial(index, material) {
			var idx = this.selectedMaterials.indexOf(material);
			if (idx > -1) this.selectedMaterials.splice(idx, 1);
        },
        submitOrder(){
            this.order.materials = this.selectedMaterials;
            this.$http.post('/api/reagent/arrivals', this.order).then(response => (this.$router.push({path: '/reagent/storage'}))).catch(error => (alert(error.response.data.message)));            
        }
    }
}
</script>