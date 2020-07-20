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
        <sui-grid-column :width="3">
		<div class="ui fluid card">
			<div class="content">
				<div class="ui bottom attached buttons">
                    <router-link to="#" class="ui yellow button">Новое</router-link>
				</div>
			</div>
		</div>
		<div class="ui fluid card">
			<div class="content">
				<div class="center aligned header">
					<h2>Поиск</h2>
				</div>
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field" v-for="(key, index) in gridColumns.filterColumn" v-show="filters.hasOwnProperty(Object.keys(key))" :key="index">
						<label>{{ Object.values(key)[0] }}</label>
                        <sui-dropdown fluid multiple search selection v-model="filters[Object.keys(key)]"></sui-dropdown>
					</div>
				</div>
			</div>
		</div>
        </sui-grid-column>
        <sui-grid-column :width="13">
            <sui-loader centered v-bind:active="gridData.length <= 0" inline/>
            <div class="ui cards" v-if="gridData.length > 0">
                <div class="ui fluid card" v-for="(order, index) in filteredRows" :key="index">
                    <div class="content">
                        <span v-bind:class="{
                        'ui top attached green right label': order.moving_type === 'Поступление',
                        'ui top attached blue right label': order.moving_type === 'Перевод'
                        }">{{ order.moving_type }}</span>
                        <div class="header">Заказ № {{ order.num_order }} от {{ today(order.date_order) }}</div>
                        <div class="meta">
                            <span class="category">Отдел: {{ order.department }}</span>
                        </div>
                    </div>
                    <div class="content">
                        <sui-button size="mini" content="Поступившие материалы" color="orange" floated="right" v-on:click="showModal(index)"></sui-button>
                    </div>
                </div>
            </div>
            <arrival-modal :open="isShowModal" @close="hideModal" :order="gridData[orderIndex]"></arrival-modal>
        </sui-grid-column>
    </sui-grid-row>
</sui-grid>
</template>

<script>
import axios from 'axios';
import ArrivalModal from '../modals/arrival_material.vue'

export default {
    components: {
        'axios': axios,
        'arrival-modal': ArrivalModal
    },
    data(){
        return {
            gridColumns: {
                tableColumn: [
                ],
                filterColumn: [
                    {'num_order':'Номер заказа'},
                    {'date_order':'Дата заказа'},
                    {'moving_type':'Вид поступления'}
                ]
            },
            gridData: [],
            filters: {
                department: [],
                date_order: [],
                moving_type: [],
                num_order: []
            },
            isShowModal: false,
            orderIndex: null
        }
    },
	computed: {
		filteredRows: function () {
			let rows = this.gridData;
			return rows.filter(r =>
			{
				return Object.keys(this.filters).every(f =>
				{
					return this.filters[f].length < 1 || this.filters[f].includes(r[f]);
				})
			})
		}
	},
	methods: {
		getArrivals(){
			axios.get("/api/reagent/arrivals").then( response => (this.gridData = response.data));
        },
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
        },
        //ПЕРЕДЕЛАТЬ
		returnUniq(column){
            let result = [];
            let resa = [];
			for (let str of this.gridData)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
                })
            for (let res of result)
            {
                resa.push({key: res, value: res, text: res});
            }
			return resa;
        },
		showModal(index = null){
            this.orderIndex = index;
			this.isShowModal = true;
        },
		hideModal(){
			this.isShowModal = false;
		},
    },
    mounted(){
        this.getArrivals();
    }
}
</script>