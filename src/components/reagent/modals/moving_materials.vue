<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
			{{ order.order.dep_from }} запрашивает следующие материалы:
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
                    <sui-table-row v-for="(material, index) in filteredRows" :key="index">
                        <sui-table-cell>{{material.id_material}}</sui-table-cell>
                        <sui-table-cell>{{material.material}}</sui-table-cell>
                        <sui-table-cell>{{material.order_measure}}</sui-table-cell>
                        <sui-table-cell>{{material.amount}} / {{material.total}}</sui-table-cell>
                        <sui-table-cell>{{today(material.date_create)}}</sui-table-cell>
                        <sui-table-cell
                        v-bind:class="{success: colorShelfLife(material.shelf_life) > 62, caution: colorShelfLife(material.shelf_life) <= 62, danger: colorShelfLife(material.shelf_life) <= 31}"
                        >{{today(material.shelf_life)}} <strong>({{colorShelfLife(material.shelf_life)}})</strong></sui-table-cell>
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
                    {'material': 'Материал'},
                    {'measure': 'Ед.изм'},
                    {'amount': 'Кол./Остаток'},
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
        },
        filteredRows(){
            let rows = this.order;
			return rows.materials.filter(r =>
			{
				//кг -> см3
				if((r.id_order_measure === 4 && r.id_measure === 6) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
				{
					r.amount = Math.round((r.amount / r.density) * 1000);
					r.order_measure = r.measure;
					//if(r.total === null) r.total = r.amount;
					//else r.total = Math.round(r.total * 1000);
				}
				//кг -> г
				if((r.id_order_measure === 4 && r.id_measure === 2) && (this.$store.getters.idDepartment != 5 && this.$store.getters.idDepartment != 15))
				{
					r.amount = Math.round(r.amount * 1000);
					r.order_measure = r.measure;
					if(r.total === null) r.total = r.amount;
					else r.total = Math.round(r.total * 1000);
				}
                if(r.total === null) r.total = r.arrival_amount;
                return r;
			});
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
		colorShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
        },
    }
}
</script>

<style scoped>
	.success {
		background-color: #ddffdd;
	}
	.caution {
		background-color: #ffffcc;
	}
	.danger {
		background-color: #ffdddd;
	}
</style>