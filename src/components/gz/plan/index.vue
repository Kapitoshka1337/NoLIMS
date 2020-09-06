<template>
	<v-tabs>
		<v-tab>Вет.станции</v-tab>
		<v-tab>План</v-tab>
	<v-tab-item>
		<vetstation @id='inputId'></vetstation>
	</v-tab-item>
	<v-tab-item>
		<detail :id="idVetstation"></detail>
	</v-tab-item>
	</v-tabs>
</template>

<script>
import vetstation from './vetstation.vue';
import detail from './detail.vue';

export default {
	components: {
		'vetstation': vetstation,
		'detail': detail
	},
	data () {
		return {
			idVetstation: 0
		}
	},
	methods: {
		inputId(data){
			this.idVetstation = data;
		}
	}
}
</script>