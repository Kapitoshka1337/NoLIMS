<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
			{{ material.material }} ({{ material.measure }})
			<div class="meta">{{ material.material_id }} / {{ dateFormat(material.date_order) }}</div>
		</div>
		<sui-modal-content>
			<div class="ui bottom warning message" v-if="isTime">
				<i class="icon warning"></i>
				{{ isTime }}
			</div>
			<div class="ui bottom warning message" v-if="isAmount">
				<i class="icon warning"></i>
				{{ isAmount }}
			</div>
			<div class="ui bottom warning message" v-if="isTotal">
				<i class="icon warning"></i>
				{{ isTotal }}
			</div>
		</sui-modal-content>
		<sui-modal-content v-if="isTime">
			<sui-form>
				<sui-form-field>
					<sui-checkbox label="Продлить срок годности" v-model="renewalShelfLife"/>
				</sui-form-field>
				<sui-form-field>
					<sui-input type="date" v-if="renewalShelfLife" v-model="renewalDate"></sui-input>
				</sui-form-field>
			</sui-form>
		</sui-modal-content>
		<sui-modal-content>
			<sui-form>
				<sui-form-field>
					<label for="">Потраченное количество</label>
					<sui-input type="number" v-model="expensesAmount"></sui-input>
				</sui-form-field>
				<sui-form-field>
					<label for="">Дата потребления</label>
					<sui-input type="date" v-model="expensesDate"></sui-input>
				</sui-form-field>
			</sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<sui-button class="ui approve green button" v-bind:loading="loading" v-on:click="saveExpenses" v-bind:disabled="(isAmount || isTotal) && (isAmount || !renewalShelfLife || isTotal)">Потратить</sui-button>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
//import axios from 'axios';

export default {
	props: {
		open: Boolean,
		material: Object
	},
	data(){
		return {
			expensesAmount: null,
			expensesDate: null,
			//dangerShelfLife: false,
			renewalShelfLife: false,
			renewalDate: null,
			url: 'storage/expenses',
			loading: false
		}
	},
	beforeDestroy(){
		//this.dangerShelfLife = !this.dangerShelfLife;
		this.renewalShelfLife = !this.renewalShelfLife;
		this.expensesAmount = null;
		this.material = null;
	},
	watch: {
		material(){
			let today = new Date();
			this.expensesDate = today.toISOString().split('T')[0];
		},
		renewalShelfLife(newVal, oldVal){
			if(newVal === true)
				this.url = 'expenses/' + this.material.arrival_material_id + "/renewal";
			else this.url = 'storage/expenses';
		},
		//open(newVal){
		//	if(newVal === false)
		//	{
		//		this.dangerShelfLife = false;
		//		this.renewalShelfLife = false;
		//		this.expensesAmount = null;
		//		this.material = null;
		//	}
		//}
	},
	computed:{
		show(){
			return this.open
		},
		//afterHide(){
		//	if(!this.open)
		//	{
		//		this.dangerShelfLife = false;
		//		this.renewalShelfLife = false;
		//		this.expensesAmount = null;
		//		this.material = null;
		//	}
		//},
		isTime(){
			if(this.timeShelfLife(this.material.shelf_life) <= 0){
				//this.dangerShelfLife = true;
				return 'Расход материала по истечение установленного срока годности (' + this.dateFormat(this.material.shelf_life) + ') запрещается';
			}
		},
		isAmount(){
			if(this.expensesAmount < 0)
				this.expensesAmount = this.expensesAmount * -1;
			if(this.expensesAmount <= 0)
				return 'Введите протраченное количество';
		},
		isTotal(){
			if ((this.material.total - this.expensesAmount) < 0)
				return 'Невозможно потратить больше ' + this.material.total;
		}
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
				let obj = { id_arrival: this.material.arrival_material_id, amount: this.expensesAmount, date: this.expensesDate, renewal: {status: this.renewalShelfLife, date: this.renewalDate}};
				this.loading = true;
				this.$http.post("/api/reagent/" + this.url, JSON.stringify(obj), {
					headers: {'Content-Type': 'application/json'}}).then(response => (
						this.$emit('success', this.expensesAmount, this.renewalDate), this.loading = false, this.expensesAmount = null)).catch(error => (
							alert(error.response.data.message), this.loading = false, this.expensesAmount = null));
			}
		},
		timeShelfLife(date){
			let today = new Date();
			let shelf_life = new Date(date.split(".").reverse().join("-"));
			return Math.ceil((shelf_life.getTime() - today.getTime()) / (1000 * 3600 * 24));
		}
	}
}
</script>