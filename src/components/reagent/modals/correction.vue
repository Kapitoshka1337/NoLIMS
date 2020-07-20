<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
			Исправление записи
			<div class="meta">{{ material.material_id }} / {{ material.date_order }}</div>
		</div>
		<sui-modal-content>
			<sui-form>
				<sui-form-field>
					<label>Количество</label>
					<sui-input type="number" v-model="amountCorrect" min="0"></sui-input>
				</sui-form-field>
				<sui-form-field>
					<label>Причина исправления</label>
                    <textarea cols="30" rows="10" v-model="reasonCorrect"></textarea>
				</sui-form-field>
			</sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<button class="ui approve green button" v-on:click="saveCorrect">Отравить</button>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
import axios from 'axios';

export default {
	props: {
		open: Boolean,
		material: Object
	},
	data(){
		return {
            amountCorrect: 0,
            reasonCorrect: null
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
		saveCorrect(){
			if (this.amountCorrect != 0 && this.reasonCorrect != null)
			{
				// let obj = { id_arrival: this.material.arrival_material_id, amount: this.expensesAmount, date: this.expensesDate};
				axios.post("/api/reagent/expenses/correct", {
					headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success'))).catch(error => (alert(error)));
			}
		},
	}
}
</script>