<template>
	<div>
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
	</div>
</template>

<script>
import equipment from './eq.vue';
import detail from './detail.vue';

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