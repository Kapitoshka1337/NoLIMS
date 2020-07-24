<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">Изменение местоположения
		</div>
		<sui-modal-content>
            <sui-form>
                <sui-form-field>
                    <label>Кабинет</label>
                    <!-- <sui-input type="text" v-model="material.cabinet_number"></sui-input> -->
                    <sui-dropdown :options="materials" search selection v-model="material.cabinet_number"></sui-dropdown>
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
			<button class="ui approve green button" v-on:click="saveExpenses">Сохранить</button>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
import axios from 'axios';

export default {
	props: {
		open: Boolean,
        material: Object,
        materials: Array
	},
	data(){
		return {
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
		saveExpenses(){
            axios.put("/api/reagent/locations/" + this.material.id + "/update", JSON.stringify(this.material), {
					headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success'))).catch(error => (alert(error.response.data.message)));
		},
	}
}
</script>