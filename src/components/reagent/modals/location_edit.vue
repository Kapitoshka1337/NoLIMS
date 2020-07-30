<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">Изменение местоположения
		</div>
		<sui-modal-content>
            <sui-form>
                <sui-form-field>
                    <label>Кабинет</label>
                    <sui-input type="text" v-model="isMaterial.cabinet_number"></sui-input>
                </sui-form-field>
                <sui-form-field>
                    <label>Место (мебель)</label>
                    <sui-input type="text" v-model="isMaterial.place"></sui-input>
                </sui-form-field>
                <sui-form-field>
                    <label>Полка (номер)</label>
                    <sui-input type="text" v-model="isMaterial.notation"></sui-input>
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
		},
		isMaterial(){
			return this.material;
		}
	},
	methods: {
		hide(){
			this.$emit('close');
		},
		saveExpenses(){
            this.$http.put("/api/reagent/locations/" + this.isMaterial.id, JSON.stringify(this.isMaterial), {
					headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success'))).catch(error => (alert(error.response.data.message)));
		},
	}
}
</script>