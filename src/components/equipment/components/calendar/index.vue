<template>
	<v-row class="fill-height">
		<v-col>
			<v-overlay :value="overlay">
				<v-progress-circular indeterminate size="64" color="yellow"></v-progress-circular>
			</v-overlay>
			<v-sheet height="64">
				<v-toolbar flat>
					<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Сегодня</v-btn>
					<v-btn fab text small color="grey darken-2" @click="prev">
						<v-icon small>
							mdi-chevron-left
						</v-icon>
					</v-btn>
					<v-btn fab text small color="grey darken-2" @click="next">
						<v-icon small>
							mdi-chevron-right
						</v-icon>
					</v-btn>
					<v-toolbar-title v-if="$refs.calendar">
						{{ $refs.calendar.title }}
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-menu bottom right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
								<span>{{ typeToLabel[type] }}</span>
								<v-icon right>
									mdi-menu-down
								</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item @click="type = 'day'">
								<v-list-item-title>День</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = 'week'">
								<v-list-item-title>Неделя</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = 'month'">
								<v-list-item-title>Месяц</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
			</v-sheet>
			<v-sheet height="512">
				<v-calendar
					ref="calendar"
					v-model="focus"
					color="primary"
					locale="ru"
					:weekdays="weekday"
					:events="events"
					:event-color="getEventColor"
					:type="type"
					interval-count="32"
					@click:event="showEvent"
					@click:more="viewDay"
					@click:date="viewDay"
				></v-calendar>
				<v-menu offset-overflow v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
					<v-card color="grey lighten-4" min-width="350px" max-width="512px">
						<v-toolbar :color="selectedEvent.color" dark dense>
							<v-toolbar-title v-html="selectedEvent.eq"></v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn icon>
								<v-icon>mdi-pencil</v-icon>
							</v-btn>
						</v-toolbar>
						<v-card-text>
							<span v-html="selectedEvent.details"></span>
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<!--<v-btn color="success" @click="selectedOpen = false">Выполнить</v-btn>-->
							<v-btn color="success">Выполнить</v-btn>
						</v-card-actions>
					</v-card>
				</v-menu>
				<v-dialog dense v-model="playDialog" max-width="512">
					<v-card>
						<v-card-title>Отправка оборудования</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-row>
								<v-container>
									<v-row align-content="center">
										<v-text-field label="Номер квитанции" outlined dense></v-text-field>
									</v-row>
								</v-container>
							</v-row>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="success">Отправить</v-btn>
							<v-btn color="error" @click="playDialog = false">Отмена</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-sheet>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data(){
		return {
			focus: '',
			type: 'month',
			typeToLabel: {
				month: 'Месяц',
				week: 'Неделя',
				day: 'День'
			},
			weekday: [1, 2, 3, 4, 5, 6, 0],
			selectedEvent: {},
			selectedElement: null,
			selectedOpen: false,
			events: [],
			preEvents: [],
			overlay: false,
			playDialog: false
		}
	},
	mounted(){
		this.$refs.calendar.checkChange();
	},
	created(){
		this.getService();
	},
	methods:{
		getService(){
			this.overlay = true;
			this.$http.get('/api/equipment/calendar').then(response => (this.preEvents = response.data, this.overlay = false)).catch(error => (alert(error.response.data.message), this.overlay = false));
		},
		viewDay({ date }){
			this.focus = date;
			//this.playDialog = true;
			this.type = 'day'
		},
		getEventColor(event){
			return event.color
		},
		setToday(){
			this.focus = ''
		},
		prev(){
			this.$refs.calendar.prev()
		},
		next(){
			this.$refs.calendar.next()
		},
		showEvent({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event
				this.selectedElement = nativeEvent.target
				setTimeout(() => {
					this.selectedOpen = true
				}, 10)
			}
			if (this.selectedOpen) {
				this.selectedOpen = false
				setTimeout(open, 10)
			} else {
				open()
			}
			nativeEvent.stopPropagation()
		}
	},
	watch:{
		preEvents(newVal){
			newVal.forEach(element => {
				this.events.push({
					name: element.service || '',
					start: element.start || '',
					end: element.start || '',
					color: 'orange' || '',
					eq: element.title || '',
					details: element.model || ''
				})
			});
		}
	}
}
</script>