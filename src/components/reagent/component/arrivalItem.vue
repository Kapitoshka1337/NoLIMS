<template>
	<v-card class="mx-auto" max-width="400px" outlined>
		<v-list-item two-line>
			<v-list-item-content>
				<v-list-item-title class="text-md-body-1">{{ Item.material }}</v-list-item-title>
				<v-list-item-subtitle>({{ Item.id }}) {{ Item.type }} ({{ Item.measure }})</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item>
		<v-divider></v-divider>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<v-text-field v-model="Item.amount" type="number" min="0" outlined dense label="Количество"></v-text-field>
					<v-text-field v-model="Item.density" type="number" min="0" outlined dense label="Плотность"></v-text-field>
					<v-autocomplete v-model="Item.id_location" :items="Location" outlined dense label="Местоположение"></v-autocomplete>
					<v-textarea v-model="Item.post_name" :rows="2" :height="100" outlined dense label="Наименование в накладной"></v-textarea>
					<v-text-field v-model="Item.date_create" type="date" outlined dense label="Дата изготовления"></v-text-field>
					<v-text-field v-model="Item.shelf_life" type="date" outlined dense label="Срок хранения"></v-text-field>
					<v-text-field v-model="Item.storage_conditions" type="text" outlined dense label="Условия хранения"></v-text-field>
					<v-textarea v-model="Item.description" :rows="2" :height="100" outlined dense label="Дополнительная информация"></v-textarea>
				</v-col>
			</v-row>
		</v-card-text>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn block color="error" :ripple="false" @click="deleteItem(Item)">Удалить</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
	props: {
		item: Object,
		locations: Array
	},
	data(){
		return {}
	},
	watch: {
		'item.amount': function(newVal){
			if(newVal === '' || newVal === null) this.Item.amount = "0";
		},
		'item.density': function(newVal){
			if(newVal === '' || newVal === null) this.Item.density = "1";
		}
	},
	computed: {
		Item(){
			if(this.item)
				return this.item;
		},
		Location(){
			if(this.locations)
				return this.locations;
		}
	},
	methods: {
		deleteItem(item){
			this.$emit('delete', item);
		}
	}
}
</script>