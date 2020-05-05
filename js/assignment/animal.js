var animal = new Vue({
	el: "#animal",
	data: {
		listAnimals: [],
		animalTitle: '',
		animalId: ''
	},
	methods: {
		getAnimal(){
			axios.get("/assignment/get-animal").then( response => (this.listAnimals = response.data));
		},
		animalEdit(id, title){
			axios.get("/assignment/edit-animal?id=" + id + "&title=" + title).then( response => (this.getAnimal()));
		},
		animalDelete(id){
			axios.get("/assignment/delete-animal?id=" + id).then( response => (this.getAnimal()));
		},
		showModal(modalName, id = null, title = null){
			this.animalId = id;
			this.animalTitle = title;
			$('#modal' + modalName).modal('show');
		},
		createAnimal(){
			axios.get("/assignment/create-animal?animal=" + this.animalTitle).then( response => (this.getAnimal()));
		}
	},
	mounted: function(){
		this.getAnimal();
	}
})