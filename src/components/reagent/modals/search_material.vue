<template>
	<sui-modal v-model="show">
		<sui-modal-content scrolling>
            <sui-table compact>
                <sui-table-header>
                    <sui-table-row>
						<sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index">
							{{ Object.values(column)[0] }}
						</sui-table-header-cell>
                    </sui-table-row>
                    <sui-table-row>
                        <sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
                            <sui-form>
                                <sui-form-field>
                                    <sui-input type="text" placeholder="Поиск" v-model="filterKey"></sui-input>
                                </sui-form-field>
                            </sui-form>
                        </sui-table-header-cell>
                    </sui-table-row>
                </sui-table-header>
                <sui-table-body>
                    <sui-table-row v-for="(material, index) in paginateRows" :key="index">
                        <!-- <sui-table-cell>{{material.id_material}}</sui-table-cell> -->
                        <sui-table-cell>{{material.type}}</sui-table-cell>
                        <sui-table-cell>{{material.material}}</sui-table-cell>
                        <sui-table-cell>{{material.measure}}</sui-table-cell>
                    </sui-table-row>
                </sui-table-body>
                <sui-table-footer>
                    <sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
                        <sui-label >
                            Страница {{ currentPage }} из {{ listPages.length }}
                        </sui-label>
                        <div class="ui icon basic right floated small buttons">
                            <sui-button v-on:click="currentPage = listPages[0]"><i class="icon angle double left"></i></sui-button>
                            <sui-button class="ui button" v-on:click="currentPage--" v-if="currentPage != 1"><i class="icon angle left"></i></sui-button>
                            <sui-form>
                                <sui-form-field>
                                    <input is="sui-input" type="text" :value="currentPage">
                                </sui-form-field>
                            </sui-form>
                            <sui-button class="ui button" v-on:click="currentPage++" v-if="currentPage < listPages.length"><i class="icon angle right"></i></sui-button>
                            <sui-button class="ui button" v-on:click="currentPage = listPages.length"><i class="icon angle double right"></i></sui-button>
                        </div>
                    </sui-table-header-cell>
                </sui-table-footer>
            </sui-table>
		</sui-modal-content>
		<sui-modal-actions>
			<sui-button color='green' v-on:click="hide">ОК</sui-button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
// import axios from 'axios';

export default {
	props: {
        open: Boolean,
        material: Array
	},
	data(){
		return {
			gridColumns: {
                tableColumn: [
                    {'type': 'Тип'},
                    {'material': 'Материал'},
                    {'measure': 'Ед.изм.'}
                ],
                filterColumn: []
            },
            filterKey: '',
			currentPage: 1,
			listPages: [],
			countPost: 100
		}
    },
	watch: {
		filteredRows() {
			this.listPages = [];
			this.setPages();
		}
	},
	computed:{
		show(){
			return this.open
        },
		filteredRows() {
			let filterKey = this.filterKey && this.filterKey.toLowerCase();
			let rows = this.material;
			if (filterKey)
			{
				rows = rows.filter(function(row)
				{
					return Object.keys(row).some(function(key)
					{
						return (String(row[key]).toLowerCase().indexOf(filterKey) > -1);});
				});
			}
        },
		paginateRows(){
			return this.paginate(this.filteredRows);
		}
	},
	methods: {
		hide(){
			this.$emit('close');
        },
		setPages () {
			let numOfPage = Math.ceil(this.filteredRows.length / this.countPost);
			for (let i = 1; i <= numOfPage; i++)
				this.listPages.push(i);
		},
		paginate (rows) {
			let page = this.currentPage;
			let curPost = this.countPost;
			let from = (page * curPost) - curPost;
			let to = ((page * curPost));
			return rows.slice(from, to);
		},
		// saveExpenses(){
		// 	if ((this.material.total - this.expensesAmount) >= 0)
		// 	{
		// 		let obj = { id_arrival: this.material.arrival_material_id, amount: this.expensesAmount, date: this.expensesDate};
		// 		axios.post("/api/reagent/storage/expenses", JSON.stringify(obj), {
		// 			headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success', this.expensesAmount), this.expensesAmount = 0)).catch(error => (alert(error)));
		// 	}
		// },
	}
}
</script>