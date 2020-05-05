var animal = new Vue({
	el: "#method",
	data: {
		listMethods: [],
		methodTitle: '',
		methodId: ''
	},
	methods: {
		getMethod(){
			axios.get("/assignment/get-methods").then( response => (this.listMethods = response.data));
		},
		methodEdit(id, title){
			axios.get("/assignment/edit-method?id=" + id + "&title=" + title).then( response => (this.getMethod()));
		},
		methodDelete(id){
			axios.get("/assignment/delete-method?id=" + id).then( response => (this.getMethod()));
		},
		showModal(modalName, id = null, title = null){
			this.methodId = id;
			this.methodTitle = title;
			$('#modal' + modalName).modal('show');
		},
		createMethod(){
			axios.get("/assignment/create-method?method=" + this.methodTitle).then( response => (this.getMethod()));
		}
	},
	mounted: function(){
		this.getMethod();
	}
})