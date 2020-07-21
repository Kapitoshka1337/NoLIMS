<template>
    <sui-grid class="padded">
        <sui-grid-row>
            <sui-grid-column>
                <sui-menu>
                    <router-link to="/reagent/arrivals" is="sui-menu-item">Поступления</router-link>
                    <router-link to="/reagent/expenses" is="sui-menu-item">Потребление</router-link>
                    <router-link to="#" is="sui-menu-item">Списание</router-link>
                    <router-link to="#" is="sui-menu-item">
                        <sui-dropdown text="Передача">
                            <sui-dropdown-menu>
                                <sui-dropdown-item>Запрос</sui-dropdown-item>
                                <sui-dropdown-item>История</sui-dropdown-item>
                            </sui-dropdown-menu>
                        </sui-dropdown>
                    </router-link>
                    <router-link to="#" is="sui-menu-item" floated="right">Местоположение</router-link>
                </sui-menu>
            </sui-grid-column>
        </sui-grid-row>
        <sui-grid-row>
            <sui-grid-column>
                <sui-card class="fluid">
                    <sui-card-content>
                        <sui-form>
                            <sui-form-fields fields="three" inline>
                                <sui-form-field>
                                    <label>Заказ №</label>
                                    <sui-input type="text"></sui-input>
                                </sui-form-field>
                                <sui-form-field>
                                    <label>от</label>
                                    <sui-input type="date"></sui-input>
                                </sui-form-field>
                                <sui-form-field width="eight">
                                    <label>Отдел</label>
                                    <sui-input readonly></sui-input>
                                </sui-form-field>
                            </sui-form-fields>
                        </sui-form>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-card-group :items-per-row="4">
                            <sui-card>
                                <sui-card-content>
                                    <sui-card-header>h</sui-card-header>
                                    <sui-card-meta>m</sui-card-meta>
                                </sui-card-content>
                                <sui-card-content>            
                                    <sui-form>
                                        <sui-form-field>
                                            <label>Количество</label>
                                            <sui-input type="number"></sui-input>
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Местоположение</label>
                                            <sui-input></sui-input>
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Наименовение в накладной</label>
                                            <textarea cols="30" rows="3"></textarea>
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Дата изготовления</label>
                                            <sui-input type="date"></sui-input>
                                        </sui-form-field>
                                        <sui-form-field>
                                            <label>Годен до</label>
                                            <sui-input type="date"></sui-input>
                                        </sui-form-field>
                                    </sui-form>
                                </sui-card-content>
                                <sui-card-content>
                                    <sui-button content="Удалить" floated="left" color="red" fluid></sui-button>
                                </sui-card-content>
                            </sui-card>
                        </sui-card-group>
                    </sui-card-content>
                    <sui-card-content>
                        <sui-button icon="search" floated="left" color="yellow" v-on:click="showModal"></sui-button>
                        <router-link to="/reagent/arrivals" is="sui-button" class="ui right floated orange" content="Отмена"></router-link>
                        <sui-button content="Добавить" floated="right" color="green"></sui-button>
                    </sui-card-content>
                </sui-card>
                <search-material-modal :open="isShowModal" @close="hideModal" :material="materials"></search-material-modal>
            </sui-grid-column>
        </sui-grid-row>
    </sui-grid>
</template>

<script>
import SearchMaterialModal from '../modals/search_material.vue'
import axios from 'axios';

export default {
    components: {
        'search-material-modal': SearchMaterialModal
    },
    data(){
        return {
            isShowModal: false,
            materials: []
        }
    },
    methods: {
		hideModal(){
			this.isShowModal = false;
        },
		showModal(){
            axios.get('/api/reagent/material').then(response => (this.materials = response.data, this.isShowModal = true)).catch(error => (alert(error)));
        }
    }
}
</script>