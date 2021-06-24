<template>
	<v-col cols="12">
		<v-tabs vertical>
			<v-tab><v-icon left color="purple">mdi-view-dashboard</v-icon>Главная</v-tab>
			<v-tab><v-icon left color="green">mdi-pencil-ruler</v-icon>Метролог</v-tab>
			<v-tab><v-icon left color="blue">mdi-factory</v-icon>Подразделения</v-tab>
			<v-tab><v-icon left color="orange">mdi-calendar-month-outline</v-icon>Календарь работ</v-tab>
			<v-tab><v-icon left color="teal">mdi-bug</v-icon>Ремонт</v-tab>
			<v-tab-item>
				<main-page></main-page>
			</v-tab-item>
			<v-tab-item>
				<eq></eq>
			</v-tab-item>
			<v-tab-item>
				<eqdep></eqdep>
			</v-tab-item>
			<v-tab-item>
				<p>
					<h5>В разработке</h5>
				</p>
			</v-tab-item>
			<v-tab-item>
				<p>
					<h5>В разработке</h5>
				</p>
			</v-tab-item>
		</v-tabs>
	</v-col>
</template>

<script>
import mainPage from './components/equipment/main.vue';
import eq from './components/equipment/equipment.vue';
import eqdep from './components/equipment/eqdep.vue';
export default {
	components: {
		mainPage, eq, eqdep
	},
	data(){
		return {}
	}
}
</script>