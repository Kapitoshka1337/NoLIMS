<template>
	<v-card flat>
		<v-card-title>
			Передача
		</v-card-title>
		<v-card-text>
			Раздел меню <strong>Передача</strong> предназачен для формирования запросов на перевод поступивших материалов и просмотра истории переводов.
		</v-card-text>
		<v-card-text>
			<v-card-text>
				<v-expansion-panels accordion>
					<v-expansion-panel>
						<v-expansion-panel-header>Запрос</v-expansion-panel-header>
						<v-expansion-panel-content>
							<request></request>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>История</v-expansion-panel-header>
						<v-expansion-panel-content>
							<history></history>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-card-text>
		</v-card-text>
	</v-card>
</template>

<script>
import request from './moving/request.vue';
import history from './moving/history.vue';

export default {
	components: {
		request, history
	},
	data () {
		return { }
	}
}
</script>