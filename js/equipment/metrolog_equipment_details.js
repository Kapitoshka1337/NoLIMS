Vue.config.devtools = true;
let details = new Vue({
	el: "#details",
	data: {
		id_eq: null,
		listDetails: [],
		listDetailsCopy: [],
		listType: [],
		listLocations: [],
		listDepartment: [],
		listError: [],
		listObjectStudy: [],
		listMaintenance: [],
		maintenance: {
			id_type_maintenance: null,
			id_maintenance: null,
			id_executor: null,
			periodicity: null,
		}
	},
	methods: {
		getIdEquipmnent(){
			//КОСТЫЛЬ
			this.id_eq = document.location.href.substring(document.location.href.lastIndexOf('/') + 1,document.location.href.length);
		},
		getDetails(){
			axios.get("/equipment/get-details?id=" + this.id_eq).then( response => (this.listDetails = response.data));
		},
		//Перевод из гггг-мм-дд в дд.мм.гггг
		today(date){
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		Submit(){
			let det = this.listDetails;
			let detCopy = this.listDetailsCopy;
			let eq = {}, cw = {}, mtnc = {};
				// Object.keys(det.maintenance).forEach(function(row){
				// 	if(detCopy.maintenance[row] != det.maintenance[row])
				// 		mtnc[row] = det.maintenance[row];
				// });
				Object.keys(det.equipment).forEach(function(row){
					if(detCopy.equipment[row] != det.equipment[row])
						eq[row] = det.equipment[row];
				});
				if(det.condition_working)
					Object.keys(det.condition_working).forEach(function(row){
						if(detCopy.condition_working[row] != det.condition_working[row])
							cw[row] = det.condition_working[row];
					});
				obj = {id: this.id_eq, equipment: eq, condition_working: cw, maintenance: mtnc};
			axios.post("/equipment/save-equipment", JSON.stringify(obj), {headers: {'Content-Type': 'application/json'}}).then(response => (this.getDetails())).catch(error => (this.listError = error));
		},
		getDepartment(){
			axios.get("/equipment/get-department").then( response => (this.listDepartment = response.data));
		},
		getObjectStudy(){
			axios.get("/equipment/get-object-study").then( response => (this.listObjectStudy = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		},
		clearDropdown(){
			$('.dropdown').dropdown('clear');
		},
		showModal(modalName){
			$('#modal' + modalName).modal('show');
		},
		setHandoff(){
			let handoff = {
				id_department_to: this.listDetails.equipment.id_department,
				id_location: this.listDetails.equipment.id_location,
				id_equipment: this.listDetails.equipment.id
			};
			axios.post("/equipment/set-handoff", JSON.stringify(handoff), {headers: {'Content-Type': 'application/json'}}).then
			(response => (this.getDetails())).catch(error => (this.listError = error));
		},
		getMaintenance(){
			axios.get("/equipment/get-maintenance").then( response => (this.listMaintenance = response.data));
		},
		appendMaintenance(){
			this.maintenance['id_equipment'] = +this.id_eq;
			axios.post("/equipment/append-maintenance", JSON.stringify(this.maintenance), {headers: {'Content-Type': 'application/json'}}).then
			(response => (this.clearDropdown(), this.getDetails(), this.maintenance = {})).catch(error => (this.listError = error));
		},
		addPlus(){
			this.listDetails.equipment.accuracy += String.fromCharCode(177);
		},
		addTemp(){
			this.listDetails.equipment.accuracy += String.fromCharCode(176);
		}
		// returnUniq(column){
		// 	let result = [];
		// 	for (let str of this.gridData)
		// 		if (!result.includes(str[column]))
		// 			result.push(str[column]);
		// 		result = result.slice().sort(function (a, b){
		// 			if(a === b) return 0 ;
		// 			else if (a > b) return 1;
		// 			else return - 1;
		// 		})
		// 	return result;
		// }
	},
	computed: {
		filteredLocation(){
			let rows = this.listDepartment;
			let id_department = this.listDetails.equipment.id_department;
			let locs = [];
			if(id_department)
			{
				rows = rows.filter(r => { return r.id_department === id_department });
				rows.forEach(function(key){
					if(key.locations)
						key.locations.forEach(function(location){
							locs.push({
								id: location.id_location,
								cabinet_number: location.cabinet_number,
							});
						})
				})
				return locs;
			}
			else return null;
		},
		filteredFunctionOfUse(){
			let rows = this.listDetails.types.function_of_use;
			let id_equipment_type = this.listDetails.equipment.id_equipment_type;
			if(rows = rows.filter(r => { return r.id_equipment_type === id_equipment_type }))
				return rows;
			else return null;
		}
	},
	watch:{
		//КОПИЯ ОБЪЕКТА
		listDetails(){
			this.listDetailsCopy = JSON.parse(JSON.stringify(this.listDetails));
		},
		listDepartment(){
			let interval = setInterval(function()
			{ 
				if($('.dropdown').dropdown({fullTextSearch: true}).length <= 0)
					$('.dropdown').dropdown({fullTextSearch: true});
				else clearInterval(interval);
			}, 1000);
		}
	},
	mounted: function(){
		this.getIdEquipmnent();
		this.getDetails();
		this.getDepartment();
		this.getObjectStudy();
		this.getMaintenance();
	}
})