<template>
	<v-row>
		<v-col cols="12">
			<!-- <Pivot v-if="reports.dataSource.data.length" ref="pivot" toolbar height="800" :report="reports"
			v-bind:licenseKey="key"
			v-bind:beforetoolbarcreated="customizeToolbar">
			</Pivot> -->
		</v-col>
	</v-row>
</template>

<script>
// import {Pivot} from "vue-flexmonster";
// import 'flexmonster/flexmonster.css';
// import loc from "../../../plugins/localization.json";

export default {
	// components: {
	// 	'Pivot': Pivot
	// },
	data(){
		return {
			reports: {
				dataSource: {
					data: []
				},
				slice: {
					rows: [
						{uniqueName: 'ветстанция'},
						{uniqueName: 'район'},
						{uniqueName: 'животное'}
					],
					columns: [{
						uniqueName: 'исследование'
					}],
					measures: [
						{
							uniqueName: 'количество',
							aggregation: 'sum'
						}
					],
				},
				localization: loc
			},
			//'Z77J-XA6G4X-3F2K0O-0A1D4J'
		}
	},
	methods:{
		getReport(){
			this.$http.get('/api/gz/report').then(response => (this.reports.dataSource.data = response.data)).catch(error => (alert(error.response.data.message)));
		},
		customizeToolbar(toolbar){
			let tabs = toolbar.getTabs();
			toolbar.getTabs = function()
			{
				delete tabs[0];
				delete tabs[8];
				return tabs;
			}
		}
	},
	computed: {
		key(){
			return this.$store.getters.key;
		}
	},
	created(){
		// this.getReport();
	}
}
</script>