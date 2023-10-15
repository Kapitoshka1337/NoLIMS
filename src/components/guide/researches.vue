<template>
	<v-col cols="12">
		<v-tabs vertical>
			<v-tab><v-icon left color="purple">mdi-view-dashboard</v-icon>Главная</v-tab>
			<v-tab><v-icon left color="green">mdi-pencil-ruler</v-icon>Метролог</v-tab>
			<v-tab><v-icon left color="blue">mdi-factory</v-icon>Подразделения</v-tab>
			<v-tab><v-icon left color="blue">mdi-factory</v-icon>Направления</v-tab>
			<v-tab-item>
				<main-page></main-page>
			</v-tab-item>
			<v-tab-item>
				<eq></eq>
			</v-tab-item>
			<v-tab-item>
				<eqdep></eqdep>
			</v-tab-item>
		</v-tabs>
	</v-col>
</template>

<script>

</script>