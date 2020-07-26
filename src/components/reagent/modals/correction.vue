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
					<sui-input type="number" v-model="correctAmount"></sui-input>
				</sui-form-field>
				<sui-form-field>
					<label>Причина исправления</label>
                    <textarea cols="30" rows="10" v-model="correctReason"></textarea>
				</sui-form-field>
			</sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<button class="ui approve green button" v-on:click="saveCorrect" v-bind:disabled="correctReason === ''">Отравить</button>
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
			correctAmount: null,
			correctReason: ''
		}
	},
	computed:{
		show(){
			return this.open;
		},
		isNull(){
			if(this.correctAmount < 0) this.correctAmount = this.correctAmount * -1;
		}
	},
	methods: {
		hide(){
			this.correctAmount = null;
			this.correctReason = '';
			this.$emit('close');
		},
		saveCorrect(){
			if (this.correctReason != '')
			{
				let	correct = {
					id_outgo: this.material.id,
					corrected_amount: this.correctAmount,
					spent_amount: this.material.amount_outgo,
					reason_correct: this.correctReason
				};
				this.$http.post("/api/reagent/expenses/correct", JSON.stringify(correct), {
					headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success'))).catch(error => (alert(error)));
			}
		}
	}
}
</script>