<template>
	<v-card flat>
		<v-card-title>
			Поступления
		</v-card-title>
		<v-card-text>
			Раздел меню <strong>Поступления</strong> предназачен для отображения истории поступлений и добавления нового поступления. Далее описан раздел "Поступления" с разделением на соответствующие страницы.
		</v-card-text>
		<v-card-text>
			<v-card-text>
				<v-expansion-panels accordion>
					<v-expansion-panel>
						<v-expansion-panel-header>История поступлений</v-expansion-panel-header>
						<v-expansion-panel-content>
							<index></index>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>Добавление поступления</v-expansion-panel-header>
						<v-expansion-panel-content>
							<create></create>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script>
import index from './arrivals/index.vue';
import create from './arrivals/create.vue';

export default {
	components: {
		index, create
	},
	data () {
		return { }
	}
}
</script>