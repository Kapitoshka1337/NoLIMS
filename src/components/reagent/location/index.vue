<template>
    <sui-grid class="padded">
		<sui-grid-row>
			<sui-grid-column>
				<menu-nav></menu-nav>
			</sui-grid-column>
		</sui-grid-row>
        <sui-grid-row>
            <sui-grid-column>
				<sui-loader centered v-bind:active="gridData.length <= 0" inline/>
				<sui-container>
                    <sui-table selectable compact v-if="gridData.length > 0">
                        <sui-table-header>
                            <sui-table-row>
                                <sui-table-header-cell :colspan="gridColumns.tableColumn.length + 1">
                                        Местоположение
                                        <button class="ui right floated mini icon yellow button" v-on:click="showModalCreate()"><i class="icon plus"></i></button>
                                </sui-table-header-cell>
                            </sui-table-row>
                            <sui-table-row>
                                <sui-table-header-cell v-for="(column, index) in gridColumns.tableColumn" :key="index" @click="sortBy(Object.keys(column)[0])">
                                    {{ Object.values(column)[0] }}
                                    <i :class="{'icon caret up': (sortColumns[Object.keys(column)[0]] > 0) && Object.keys(column)[0] === sortKey, 'icon caret down': (sortColumns[Object.keys(column)[0]] < 0) && Object.keys(column)[0] === sortKey}"></i>
                                </sui-table-header-cell>
                            </sui-table-row>
                        </sui-table-header>
                        <sui-table-body>
                            <sui-table-row v-for="(location, index) in paginateRows" :key="index">
                                <sui-table-cell collapsing>{{ location.cabinet_number }}</sui-table-cell>
                                <sui-table-cell collapsing>{{ location.place }}</sui-table-cell>
                                <sui-table-cell collapsing>{{ location.notation }}</sui-table-cell>
                                <sui-table-cell collapsing>
                                    <button class="ui right floated mini icon blue button" v-on:click="showModalEdit(index)"><i class="icon edit"></i></button>       
                                </sui-table-cell>
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
                                            <input type="text" :value="currentPage">
                                        </sui-form-field>
                                    </sui-form>
                                    <sui-button class="ui button" v-on:click="currentPage++" v-if="currentPage < listPages.length"><i class="icon angle right"></i></sui-button>
                                    <sui-button class="ui button" v-on:click="currentPage = listPages.length"><i class="icon angle double right"></i></sui-button>
                                </div>
                            </sui-table-header-cell>
                        </sui-table-footer>
                    </sui-table>
				    <location-modal-edit :open="isShowModalEdit" @close="hideModalEdit" @success="successEdit" :material="paginateRows[materialIndex]" :materials="forDropdown"></location-modal-edit>
                    <location-modal-create :open="isShowModalCreate" @close="hideModalCreate" @success="successCreate"></location-modal-create>
                </sui-container>
            </sui-grid-column>
        </sui-grid-row>
    </sui-grid>
</template>

<script>
import LocationModalEdit from '../modals/location_edit.vue';
import LocationModalCreate from '../modals/location_create.vue';

export default {
	components: {
		'location-modal-edit': LocationModalEdit,
		'location-modal-create': LocationModalCreate,
	},
	data () {
		return {
			gridColumns: {
				tableColumn: [
                    {'cabinet_number':'Кабинет'},
                    {'place':'Место (мебель)'},
                    {'notation':'Полка (номер)'},
                    {'action':''}
				],
				filterColumn: []
			},
			gridData: [],
			sortKey: '',
			sortColumns: Object,
			currentPage: 1,
			listPages: [],
			countPost: 100,
			isShowModalEdit: false,
			isShowModalCreate: false,
			materialIndex: null,
		}
	},
	methods: {
		showModalEdit(index = null){
			this.materialIndex = index;
			this.isShowModalEdit = true;
		},
		hideModalEdit(){
			this.isShowModalEdit = false;
        },
		showModalCreate(){
			this.isShowModalCreate = true;
		},
		hideModalCreate(){
			this.isShowModalCreate = false;
		},
		successEdit(){
			this.isShowModalEdit = false;
        },
        successCreate(data){
            this.isShowModalCreate = false;
            this.gridData.push(data);
        },
		getLocation(){
			this.$http.get('/api/reagent/locations').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		sortBy: function (key) {
			if(key === 'action') return;
			this.sortKey = key;
			this.sortColumns[key] = this.sortColumns[key] * -1;
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
		setSortColumn(){
			let sortColumns = {};
			this.gridColumns.tableColumn.forEach(function (key){
				Object.keys(key).some(function(row){
					if (row !== 'action')
						sortColumns[row] = 1;
				});
			});
			this.sortColumns = sortColumns;
		}
	},
	watch: {
		gridData(){
			this.setSortColumn();
		},
		filteredRows() {
			this.listPages = [];
			this.setPages();
		}
	},
	computed: {
		filteredRows: function () {
			let sortKey = this.sortKey;
			let order = this.sortColumns[sortKey] || 1;
			let rows = this.gridData;
			if (sortKey)
			{
				rows = rows.slice().sort(function (a, b) {
					a = a[sortKey];
					b = b[sortKey];
					if(a === b) return 0 * order;
					else if (a > b) return 1 * order;
					else return - 1 * order;
				})
            }
            return rows;
		},
		paginateRows(){
			return this.paginate(this.filteredRows);
        },
        forDropdown(){
            let rows = [];
            for(let item in this.gridData){
                rows.push({key: this.gridData[item].id, value: this.gridData[item].cabinet_number, text: this.gridData[item].cabinet_number});
            }
            return rows;
        }
	},
	created(){
		this.getLocation();
	}
  }
</script>