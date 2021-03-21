<template>
	<v-treeview
		:active.sync="active"
		:items="kinds"
		:load-children="fetchController"
		:open.sync="open"
		activatable
		color="warning"
		open-on-click
		transition
	></v-treeview>
</template>
<script>
export default {
	data(){
		return {
			active: [],
			open: [],
			kinds: []
		}
	},
	//computed:{
	//	items(){
	//		this.kinds.forEach(element => { return [{ name: element.title, children: [] }] })
	//	}
	//},
	methods: {
		fetchKind(){
			this.$http.get('/api/equipment/services')
			.then(response => {
				response.data.forEach(element => {
					this.kinds.push({id: element.id, name: element.kind, children: [], type: 'type'})
				});
			})
			.catch(response => {
				alert(error.response.data.message)
			});
		},
		//fetchType(item){
		//	this.$http.get(`/api/equipment/services/${item.id}/type`)
		//	.then(response => {
		//		response.data.forEach(element => {
		//			item.children.push({id: element.id, name: element.title, children: [], type: 'equipment'})
		//		});
		//	})
		//	.catch(response => {
		//		alert(error.response.data.message)
		//	});
		//},
		//fetchEquipment(item){
		//	this.$http.get(`/api/equipment/services/${item.id}/equipments`)
		//	.then(response => {
		//		response.data.forEach(element => {
		//			item.children.push({id: element.id, name: element.title, children: []})
		//		});
		//	})
		//	.catch(response => {
		//		alert(error.response.data.message)
		//	});
		//},
		fetchController(item){
			this.$http.get(`/api/equipment/services/${item.id}/${item.type}`)
			.then(response => {
				response.data.forEach(element => {
					item.children.push({id: element.id, name: element.title, children: [], })
				});
			})
			.catch(response => {
				alert(error.response.data.message)
			});
		}
	},
	created(){
		this.fetchKind();
	}
}
</script>