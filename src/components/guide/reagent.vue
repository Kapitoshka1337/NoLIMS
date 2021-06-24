<template>
	<v-col cols="12">
		<v-tabs vertical>
			<v-tab><v-icon left color="purple">mdi-view-dashboard</v-icon>Главная</v-tab>
			<v-tab><v-icon left color="green">mdi-package-variant</v-icon>Склад</v-tab>
			<v-tab><v-icon left color="blue">mdi-package-variant-closed</v-icon>Архив</v-tab>
			<v-tab><v-icon left color="orange">mdi-alert</v-icon>Ошибки</v-tab>
			<v-tab><v-icon left color="teal">mdi-package-up</v-icon>Поступления</v-tab>
			<v-tab><v-icon left color="red">mdi-history</v-icon>История расхода</v-tab>
			<v-tab><v-icon left color="yellow">mdi-map-marker</v-icon>Места хранения</v-tab>
			<v-tab><v-icon left color="orange">mdi-content-copy</v-icon>Списание</v-tab>
			<v-tab><v-icon left color="blue">mdi-folder-swap</v-icon>Передача</v-tab>
			<v-tab-item>
				<main-page></main-page>
			</v-tab-item>
			<v-tab-item>
				<storage></storage>
			</v-tab-item>
			<v-tab-item>
				<archive></archive>
			</v-tab-item>
			<v-tab-item>
				<errors></errors>
			</v-tab-item>
			<v-tab-item>
				<arrivals></arrivals>
			</v-tab-item>
			<v-tab-item>
				<expenses></expenses>
			</v-tab-item>
			<v-tab-item>
				<locations></locations>
			</v-tab-item>
			<v-tab-item>
				<writeoff></writeoff>
			</v-tab-item>
			<v-tab-item>
				<moving></moving>
			</v-tab-item>
		</v-tabs>
	</v-col>
</template>

<script>
import mainPage from './components/reagent/main.vue';
import storage from './components/reagent/storage.vue';
import archive from './components/reagent/archive.vue';
import errors from './components/reagent/errors.vue';
import arrivals from './components/reagent/arrivals.vue';
import expenses from './components/reagent/expenses.vue';
import locations from './components/reagent/locations.vue';
import writeoff from './components/reagent/writeoff.vue';
import moving from './components/reagent/moving.vue';

export default {
	components: {
		mainPage, storage, archive, errors, arrivals, expenses, locations, writeoff, moving
	},
	data(){
		return {}
	}
}
</script>