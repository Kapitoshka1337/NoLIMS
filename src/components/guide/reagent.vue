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
				<v-card flat>
					<v-card-text>
						<p>global</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>storage</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>archive</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>errors</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>arrivals</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>history expenses</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>locations</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-card flat>
					<v-card-text>
						<p>writeoff</p>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item>
				<v-tabs fixed-tabs>
					<v-tab>Запрос</v-tab>
					<v-tab>История</v-tab>
					<v-tab-item>
						<v-card>
							<v-card-text>
								Запрос
								<v-carousel>
									<v-carousel-item>
										<v-img :src="reagent" max-height="512" max-width="1024"></v-img>
									</v-carousel-item>
									<v-carousel-item>
										<v-img :src="request" max-height="512" max-width="1024"></v-img>
									</v-carousel-item>
								</v-carousel>
							</v-card-text>
						</v-card>
					</v-tab-item>
					<v-tab-item>
						<v-card>
							<v-card-text>
								История
							</v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs>
			</v-tab-item>
		</v-tabs>
	</v-col>
</template>

<script>
import request from './../../assets/request.png';
import reagent from './../../assets/reagent.gif';

export default {
	data(){
		return {
			request, reagent
		}
	}
}
</script>