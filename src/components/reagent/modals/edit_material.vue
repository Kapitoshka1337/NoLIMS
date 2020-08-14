<template>
	<sui-modal v-model="show" class="ui card">
		<div class="content header">
            {{ isMaterial.material }}
            <div class="meta">{{ isMaterial.location }}</div>
        </div>
		<sui-modal-content>
            <sui-form>
                <sui-form-field>
                    <label>Кабинет</label>
                    <sui-input type="text" v-model="isMaterial.cabinet_number"></sui-input>
                    <!-- <sui-dropdown placeholder="Местоположение" search selection :options="dropdownLocations" v-model="selectedIdLocation"></sui-dropdown> -->
                </sui-form-field>
            </sui-form>
		</sui-modal-content>
		<sui-modal-actions>
			<sui-button color="green" v-on:click="saveExpenses" v-bind:loading="loading">Сохранить</sui-button>
			<button class="ui deny orange button" v-on:click="hide">Отмена</button>
		</sui-modal-actions>
	</sui-modal>
</template>

<script>
export default {
	props: {
		open: Boolean,
        material: Object,
		locations: Array,
		loading: false
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
			this.loading = !this.loading;
            this.$http.put("/api/reagent/locations/" + this.isMaterial.id, JSON.stringify(this.isMaterial), {
					headers: {'Content-Type': 'application/json'}}).then(response => (this.$emit('success'), this.loading = !this.loading)).catch(error => (alert(error.response.data.message), this.loading = !this.loading));
		},
	}
}
</script>