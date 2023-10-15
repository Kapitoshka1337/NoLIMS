<template>
	<v-col cols="12">
		<v-tabs vertical>
			<v-tab><v-icon left color="blue">mdi-view-dashboard</v-icon>Общие сведения</v-tab>
			<v-tab><v-icon left color="purple">mdi-view-dashboard</v-icon>Реактив</v-tab>
			<v-tab><v-icon left color="green">mdi-view-dashboard</v-icon>Оборудование</v-tab>
			<v-tab><v-icon left color="green">mdi-view-dashboard</v-icon>Направления</v-tab>
			<v-tab-item>
				<share></share>
			</v-tab-item>
			<v-tab-item>
				<reagent></reagent>
			</v-tab-item>
			<v-tab-item>
				<equipment></equipment>
			</v-tab-item>
		</v-tabs>
	</v-col>
</template>

<script>
import reagent from './reagent.vue';
import equipment from './equipment.vue';
import share from './share.vue';

export default {
	components: {
		share, reagent, equipment
	},
	data(){
		return {}
	}
}
</script>