Vue.config.devtools = true;
var arrival = new Vue({
	el: "#arrival",
	data: {
		listError: [],
		listDepartment: [],
		listLocations: [],
		listType: [],
		listEquipment: []
	},
	methods: {
		appendEq() {
			this.listEquipment.push({
				number: null,
				id_department: null,
				id_equipment_type: null,
				title: null,
				model: null,
				serial_number: null,
				manufacturer: null,
				date_create: null,
				inventory_number: null,
				id_location: null
			});
		},
		deleteEq(index, eq) {
			let idx = this.listEquipment.indexOf(eq);
			if (idx > -1) this.listEquipment.splice(idx, 1);
		},
		Submit(){
			if (this.listEquipment.length > 0)
			{
				// let obj = [{
				// 	num_order: this.order.num_order,
				// 	date_order: this.order.date_order,
				// 	materials: this.listMaterialForTable
				// }];
				axios.post("/equipment/append", JSON.stringify(this.listEquipment), {headers: {'Content-Type': 'application/json'}}).then(function (response)
				{ 
					if (response.status === 200) 
					{
						document.location.href = '/equipment/equipments';
					}
				});
			}
		},
		Cancel(){
			document.location.href = '/equipment/equipments';
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		returnUniq(column){
			let result = [];
			for (let str of this.listDepartment)
				if (!result.includes(str[column]))
					result.push(str[column]);
				result = result.slice().sort(function (a, b){
					if(a === b) return 0 ;
					else if (a > b) return 1;
					else return - 1;
				})
			return result;
		},
		filteredLocation(id_department){
			let rows = this.listDepartment;
			let locs = [];
			if(id_department)
			{
				rows = rows.filter(r => { return r.id_department === id_department })
				rows.forEach(function(key){
					key.locations.forEach(function(location){
						locs.push({
							id: location.id,
							cabinet_number: location.cabinet_number,
							place: location.place,
							notation: location.notation
						});
					})
				})
			}
			this.listLocations = locs;
		},
		getDepartment(){
			axios.get("/equipment/get-department").then( response => (this.listDepartment = response.data));
		},
		getType(){
			axios.get("/equipment/get-type").then( response => (this.listType = response.data));
		},
	},
	computed: {
		// filteredLocation(){
		// 	let rows = this.listDepartment;
		// 	let locs = [];
		// 	if(this.filters.department != '')
		// 	{
		// 		rows = rows.filter(r => { return r.department === this.filters.department })
		// 		rows.forEach(function(key){
		// 			key.locations.forEach(function(location){
		// 				locs.push({
		// 					id: location.id,
		// 					cabinet_number: location.cabinet_number,
		// 					place: location.place,
		// 					notation: location.notation
		// 				});
		// 			})
		// 		})
		// 	}
		// 	return locs;
		// }
	},
	mounted: function(){
		this.setDropdown();
		this.getDepartment();
		this.getType();
	}
});