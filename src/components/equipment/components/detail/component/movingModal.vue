<template>
	<v-dialog v-model="Visible" max-width="1024px">
		<v-card>
			<v-card-title>Смена местоположения {{ Equipment.title }} {{ Equipment.model }} {{ Equipment.serial_number }}</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-row>
					<v-col cols="6">
						<v-autocomplete :items="dropdownCreateKind()" v-model="moving.id_kind" clearable outlined dense label="Вид перемещения"></v-autocomplete>
					</v-col>
					<v-col cols="6">
						<v-autocomplete :items="filteredTypes" v-model="moving.id_moving_type" clearable outlined dense label="Тип перемещения"></v-autocomplete>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<v-autocomplete :items="dropdownCreate()" v-model="moving.id_department" clearable outlined dense label="Отдел"></v-autocomplete>
					</v-col>
					<v-col cols="6">
						<v-autocomplete :items="filteredLocation" v-model="moving.id_location" clearable outlined dense label="Кабинет"></v-autocomplete>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="success" :disabled="isKind || isType || isDep || isLoc" v-on:click="submit()" :loading="loading">Переместить</v-btn>
				<v-btn color="error" v-on:click="closeDialog(false)">Не перемещать</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	props:{
		visible: Boolean,
		equipment: Object
	},
	data(){
		return {
			dataMoving: null,
			movings: [],
			moving: {
				id_kind: null,
				id_moving_type: null,
				id_department: null,
				id_location: null
			},
			defaultMoving: {
				id_kind: null,
				id_moving_type: null,
				id_department: null,
				id_location: null
			},
			loading: false
		}
	},
	methods:{
		closeDialog(value){
			this.loading = false;
			this.moving = this.defaultMoving;
			this.$emit('close', value);
		},
		getData(){
			this.$http.get('/api/equipment/support/locations').then(response => (this.dataMoving = response.data)).catch(error => (alert(error.response.data.message)));
			this.$http.get('/api/equipment/support/moving').then(response => (this.movings = response.data)).catch(error => (alert(error.response.data.message)));
		},
		dropdownCreate(){
			if(this.dataMoving != null)
			{
				let result = [];
				for (let str of this.dataMoving['department'])
					result.push({value: str['id'], text: str['title'] || str['cabinet_number']});
				return result;
			}
		},
		dropdownCreateKind(){
			if(this.movings.length > 0)
			{
				let result = [];
				for (let str of this.movings)
					result.push({value: str['id'], text: str['kind']});
				return result;
			}
		},
		submit(){
			this.loading = true;
			this.$http.post(`/api/equipment/equipments/${this.Equipment.id}/moving`, this.moving, {headers: {'Content-Type': 'application/json'}})
			.then(response => (
				this.closeDialog(false),
				this.$emit('submit', response.data)
			)).catch(error => (alert(error.response.data.message), this.closeDialog(false)));
		},
	},
	computed: {
		Visible:{
			get(){
				return this.visible;
			},
			set(value){
				this.closeDialog(value);
			}
		},
		Equipment(){
			return this.equipment;
		},
		filteredLocation(){
			if(this.dataMoving != null)
			{
				let result = [];
				this.dataMoving.locations.filter(item => {
					if(item.id_department === this.moving.id_department)
						result.push({value: item.id, text: item.cabinet_number});
				});
				return result;
			}
		},
		filteredTypes(){
			if(this.movings.length > 0 && this.moving.id_kind)
			{
				let result = [];
				this.movings[this.moving.id_kind - 1]['types'].filter(item => {
					result.push({value: item.id, text: item.type});
				});
				return result;
			}
		},
		isKind(){
			return this.moving.id_kind == null || this.moving.id_kind == '';
		},
		isType(){
			return this.moving.id_moving_type == null || this.moving.id_moving_type == '';
		},
		isDep(){
			return this.moving.id_department == null || this.moving.id_department == '';
		},
		isLoc(){
			return this.moving.id_location == null || this.moving.id_location == '';
		}
	},
	mounted(){
		this.getData();
	}
}
</script>