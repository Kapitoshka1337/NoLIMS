<template>
	<v-row>
		<v-col cols="6" v-for="card in cards" :key="card.id">
			<v-data-table
				dense
				:headers="card.tableColumn"
				:items="card.content"
				:items-per-page="10"
				:loading="load"
				item-key="id"
				:footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus', itemsPerPageOptions: [10, 20], itemsPerPageText: 'Отобразить на странице'}">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>{{card.title}}</v-toolbar-title>
					</v-toolbar>
				</template>
				<template v-slot:item.date_next_check="{ item }">
					{{ today(item.date_next_check) }}
				</template>
				<template v-slot:item.tag="{ item }">
					<v-chip-group>
						<v-chip color="teal" small text-color="white" v-if="item.is_archive">А</v-chip>
						<v-chip color="green" small text-color="white" v-if="item.is_working">И</v-chip>
						<v-chip color="orange" small text-color="white" v-if="item.is_conservation">К</v-chip>
						<v-chip color="red" small text-color="white" v-if="item.is_repair">Р</v-chip>
						<v-chip color="purple" small text-color="white" v-if="item.is_check">Ц</v-chip>
					</v-chip-group>
				</template>
				<template v-slot:no-data>
					Пока ничего нет :(
				</template>
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data(){
		return {
			cards: [
			{
				id: 1,
				title: 'Вспомогательное оборудование',
				tableColumn: [
					{ text: 'Номер', align: 'start', sortable: true, value: 'card_number', width: 120},
					{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
					{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
					{ text: 'Тэг', align: 'start', sortable: false, value: 'tag'}
				],
				content: []
			},
			{
				id: 2,
				title: 'Испытательное оборудование',
				tableColumn: [
					{ text: 'Номер', align: 'start', sortable: true, value: 'card_number', width: 120},
					{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
					{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
					{ text: 'Тэг', align: 'start', sortable: false, value: 'tag'}
				],
				content: []
			},
			{
				id: 3,
				title: 'Средство измерений',
				tableColumn: [
					{ text: 'Номер', align: 'start', sortable: true, value: 'card_number', width: 120},
					{ text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
					{ text: 'Предстоящая', align: 'start', sortable: true, value: 'date_next_check'},
					{ text: 'Тэг', align: 'start', sortable: false, value: 'tag'}
				],
				content: []
			},
		],
			gridData: [],
			load: false,
		}
	},
	watch: {
		gridData(){
			this.gridData.filter(f => {this.cards[f.id_type - 1].content.push(f);})
		}
	},
	methods: {
		getToday(){
			this.load = true;
			this.$http.get('/api/equipment/support/today').then(response => (this.load = false, this.gridData = response.data)).catch(error => (this.load = false, alert(error.response.data.message)));
		},
		today(date){
			return date === null || new Date(date).toLocaleString().split(',')[0];
		},
	},
	created(){
		this.getToday();
	}
}
</script>