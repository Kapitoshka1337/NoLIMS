<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
			Заказ № {{ order.order.num_order }} от {{ today(order.order.date_order) }}
		</div>
		<sui-modal-content scrolling>
            <sui-table compact>
                <sui-table-header>
                    <sui-table-row>
						<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index">
							{{ Object.values(column)[0] }}
						</sui-table-header-cell>
                    </sui-table-row>
                </sui-table-header>
                <sui-table-body>
                    <sui-table-row v-for="(material, index) in order.materials" :key="index">
                        <sui-table-cell>{{material.id_material}}</sui-table-cell>
                        <sui-table-cell>{{material.location}}</sui-table-cell>
                        <sui-table-cell>{{material.type}}</sui-table-cell>
                        <sui-table-cell>{{material.material}}</sui-table-cell>
                        <sui-table-cell>{{material.measure}}</sui-table-cell>
                        <sui-table-cell>{{material.amount}}</sui-table-cell>
                        <sui-table-cell>{{material.date_create}}</sui-table-cell>
                        <sui-table-cell>{{material.shelf_life}}</sui-table-cell>
                    </sui-table-row>
                </sui-table-body>
            </sui-table>
		</sui-modal-content>
		<sui-modal-actions>
			<sui-button color="green" v-on:click="hide">ОК</sui-button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
export default {
	props: {
        open: Boolean,
        order: Object
	},
	data(){
		return {
			gridColumns: {
                tableColumn: [
                    {'id_material': 'Код'},
                    {'location': 'Кабинет/Мебель/Полка'},
                    {'type': 'Тип'},
                    {'material': 'Материал'},
                    {'measure': 'Ед.изм'},
                    {'amount': 'Кол.'},
                    {'date_create': 'Дата изг.'},
                    {'shelf_life': 'Срок хранения'}
                ],
                filterColumn: []
			}
        }
	},
	computed:{
		show(){
			return this.open
		}
    },
    methods: {
		hide(){
			this.$emit('close');
		},
		today(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
    }
}
</script>