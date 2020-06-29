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
		maintenance: {
			id_type_maintenance: null,
			id_maintenance: null,
			id_executor: null,
			periodicity: null,
		},
		listDocType: [],
		dateCheck: {}
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
		getDepartment(){
			axios.get("/equipment/get-department").then( response => (this.listDepartment = response.data));
		},
		getObjectStudy(){
			axios.get("/equipment/get-object-study").then( response => (this.listObjectStudy = response.data));
		},
		setDropdown(){
			$('.dropdown').dropdown({fullTextSearch: true});
		}
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
	}
})