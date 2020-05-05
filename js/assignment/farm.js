var animal = new Vue({
	el: "#farm",
	data: {
		listFarms: [],
		farmTitle: '',
		farmId: ''
	},
	methods: {
		getFarm(){
			axios.get("/assignment/get-farms").then( response => (this.listFarms = response.data));
		},
		farmEdit(id, title){
			axios.get("/assignment/edit-farm?id=" + id + "&title=" + title).then( response => (this.getFarm()));
		},
		farmDelete(id){
			axios.get("/assignment/delete-farm?id=" + id).then( response => (this.getFarm()));
		},
		showModal(modalName, id = null, title = null){
			this.farmId = id;
			this.farmTitle = title;
			$('#modal' + modalName).modal('show');
		},
		createFarm(){
			axios.get("/assignment/create-farm?farm=" + this.farmTitle).then( response => (this.getFarm()));
		}
	},
	mounted: function(){
		$('#accord').accordion();
		this.getFarm();
	}
})