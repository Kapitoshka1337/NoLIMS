<template>
	<v-tabs>
		<v-tab>Оборудование</v-tab>
		<v-tab>Подробности</v-tab>
	<v-tab-item>
		<equipment @id='inputId'></equipment>
	</v-tab-item>
	<v-tab-item>
		<detail :id="idEquipment" :allow-save="idRole"></detail>
	</v-tab-item>
	</v-tabs>
</template>

<script>
import equipment from './equipment/index.vue';
import detail from '../components/detail/index.vue';

export default {
	components: {
		'equipment': equipment,
		'detail': detail
	},
	data () {
		return {
			idEquipment: 0
		}
	},
	methods: {
		inputId(data){
			this.idEquipment = data;
		}
	},
	computed: {
		idRole(){
			return this.$store.getters.isRoles === 4;
		}
	}
}
</script>