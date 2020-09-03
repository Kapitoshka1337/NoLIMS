<template>
	<v-tabs>
		<v-tab>Оборудование</v-tab>
		<v-tab>Подробности</v-tab>
	<v-tab-item>
		<equipment @id='inputId'></equipment>
	</v-tab-item>
	<v-tab-item>
		<detail :id="idEquipment"></detail>
	</v-tab-item>
	</v-tabs>
</template>

<script>
import equipment from './equipment/index.vue';
import detail from './detail/index.vue';

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
	}
}
</script>