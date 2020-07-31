<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">Добавление местоположения
		</div>
		<sui-modal-content>
            <sui-form>
                <sui-form-field>
                    <label>Кабинет</label>
                    <sui-input type="text" v-model="material.cabinet_number"></sui-input>
                    <!-- <sui-dropdown :options="materials" search selection v-model="material.id"></sui-dropdown> -->
                </sui-form-field>
                <sui-form-field>
                    <label>Место (мебель)</label>
                    <sui-input type="text" v-model="material.place"></sui-input>
                </sui-form-field>
                <sui-form-field>
                    <label>Полка (номер)</label>
                    <sui-input type="text" v-model="material.notation"></sui-input>
                </sui-form-field>
            </sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<sui-button color="green" v-on:click="createLocation" v-bind:loading="loading">Сохранить</sui-button>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
export default {
	props: {
        open: Boolean
	},
	data(){
		return {
            material: {
                cabinet_number: null,
                place: null,
                notation: null
			},
			loading: false
		}
	},
	computed:{
		show(){
			return this.open
		}
	},
	methods: {
		hide(){
			this.$emit('close');
		},
		createLocation(){
			this.loading = !this.loading;
            this.$http.post("/api/reagent/locations", JSON.stringify(this.material), {headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success', response.data), this.loading = !this.loading)).catch(error => (alert(error.response.data.message), this.loading = !this.loading));
		},
	}
}
</script>