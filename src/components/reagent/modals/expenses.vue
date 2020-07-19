<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
			{{ material.material }} ({{ material.measure }})
			<div class="meta">{{ material.material_id }} / {{ dateFormat(material.date_order) }}</div>
		</div>
		<sui-modal-content v-if="validationExpense">
			<div class="ui bottom warning message">
				<i class="icon warning"></i>
				{{ validationExpense }}
			</div>
		</sui-modal-content>
		<sui-modal-content>
			<sui-form>
				<sui-form-field>
					<label for="">Потраченное количество</label>
					<sui-input type="number" v-model="expensesAmount" min="0"></sui-input>
				</sui-form-field>
				<sui-form-field>
					<label for="">Дата потребления</label>
					<sui-input type="date" v-model="expensesDate"></sui-input>
				</sui-form-field>
			</sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<button class="ui approve green button" v-bind:disabled="validationExpense" v-on:click="saveExpenses">Потратить</button>
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
			expensesAmount: 0,
			expensesDate: null
		}
	},
	watch: {
		material(){
			let today = new Date();
			this.expensesDate = today.toISOString().split('T')[0];
		}
	},
	computed:{
		show(){
			return this.open
		},
		validationExpense(){
			if ((this.material.total - this.expensesAmount) < 0)
				return 'Нельзя потратить больше ' + this.material.total;
			if(this.expensesAmount <= 0)
				return 'Введите протраченное количество ';
		},
		today(){
			let today = new Date();
			this.expensesDate = today.toISOString().split('T')[0];
		},
	},
	methods: {
		hide(){
			this.$emit('close');
		},
		dateFormat(date){
			if(date === null) return;
			let today = new Date(date);
			return today.toLocaleString().split(',')[0];
		},
		saveExpenses(){
			if ((this.material.total - this.expensesAmount) >= 0)
			{
				let obj = { id_arrival: this.material.arrival_material_id, amount: this.expensesAmount, date: this.expensesDate};
				axios.post("/api/reagent/storage/expenses", JSON.stringify(obj), {
					headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success', this.expensesAmount), this.expensesAmount = 0)).catch(error => (alert(error)));
				//fetch('/api/reagent/storage/expenses', {
				//	method: 'post',
				//	//mode: 'no-cors',
				//	headers: {
				//		'Content-Type': 'application/json'
				//	},
				//	body: JSON.stringify(obj)
				//}).then(response => (response.json().then(this.$emit('success', this.expensesAmount)))).then(error => (alert(error.data)));
			}
		},
	}
}
</script>