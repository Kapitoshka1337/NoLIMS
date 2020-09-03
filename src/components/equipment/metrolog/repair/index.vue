<template>
	<v-row>
		<v-col cols="12">
			<v-data-table dense :search="search" :headers="tableColumn" :items="gridData" :items-per-page="50" :loading="gridData.length <= 0" :footer-props="{showFirstLastPage: true, firstIcon: 'mdi-arrow-collapse-left', lastIcon: 'mdi-arrow-collapse-right', prevIcon: 'mdi-minus', nextIcon: 'mdi-plus'}">
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title>Оборудование в ремонте</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" label="Поиск" clearable single-line hide-details></v-text-field>
					</v-toolbar>
				</template>
				<template v-for="(col, i) in filters" v-slot:[`header.${i}`]="{ header }">
					<div style="display: inline-block; padding: 16px 0;">{{ header.text }}</div>
					<div style="float: right; margin-top: 8px">
						<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed style="position: absolute; right: 0">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="indigo" icon v-bind="attrs" v-on="on">
									<v-icon small 
										:color="activeFilters[header.value] && activeFilters[header.value].length < filters[header.value].length ? 'red' : 'default'">mdi-filter-variant
									</v-icon>
								</v-btn>
							</template>
								<v-list dense>
									<v-list-item-content>
										<v-select :items="filters[header.value]" v-model="activeFilters[header.value]" :clearable="true" multiple outlined dense>
											<template v-slot:selection="{ item, index }">
												<v-chip small v-if="index === 0"><span>{{ item }}</span></v-chip>
												<span v-if="index === 1" class="grey--text caption">(+{{ activeFilters[header.value].length - 1 }})</span>
											</template>
										</v-select>
									</v-list-item-content>
									<v-divider></v-divider>
									<v-row no-gutters>
										<v-col cols="6">
											<v-btn text block @click="toggleAll(header.value)" color="success">Выделить всё</v-btn>
										</v-col>
										<v-col cols="6">
											<v-btn text block @click="clearAll(header.value)" color="warning">Снять всё</v-btn>
										</v-col>
									</v-row>
								</v-list>
						</v-menu>
					</div>
				</template>
				<template v-slot:header.date_request="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.request_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.request_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.request_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.date_request="{ item }">
					{{ today(item.date_request) }}
				</template>
				<template v-slot:header.date_start="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.start_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.start_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.start_end_date" ></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.date_start="{ item }">
					{{ today(item.date_start) }}
				</template>
				<template v-slot:header.date_end="{header}">
					{{header.text}}
					<v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition" left fixed>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="indigo" icon v-bind="attrs" v-on="on">
								<v-icon small :color="DateFilters.end_start_date ? 'red' : 'blue'">mdi-filter-variant</v-icon>
							</v-btn>
						</template>
						<v-card>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field clearable type="date" dense outlined label="Дата1" v-model="DateFilters.end_start_date"></v-text-field>
										<v-text-field clearable type="date" dense outlined label="Дата2" v-model="DateFilters.end_end_date"></v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-card-text>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item.date_end="{ item }">
					{{ today(item.date_end) }}
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn small icon color="orange" @click="detail(item)"><v-icon>mdi-eye</v-icon></v-btn>
				</template>
			</v-data-table>
			<v-dialog dense v-model="dialog" max-width="512">
				<v-card>
					<v-card-title>Заявка на ремонт № {{ item.id }}</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
                        {{ item.problem }}
					</v-card-text>
                    <v-card-text v-if="item.request_report">
                        {{item.request_report}}
                    </v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" v-if="item.id_status === 1" @click="allow()" :loading="loadingAllow">Принять</v-btn>
						<v-btn color="success" v-if="item.id_status === 2" @click="confirmFinish()">Завершить</v-btn>
						<v-btn color="error" v-if="item.id_status === 1" @click="confirmDeny()">Отказать</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense v-model="dialogFinish" max-width="512">
				<v-card>
					<v-card-title>Заявка на ремонт № {{ item.id }}</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-textarea :rows="2" :height="60" dense label="Отчет о проделанной работе" v-model="report_finish" outlined></v-textarea>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="finish()" :loading="loading">Завершить</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog dense v-model="dialogDeny" max-width="512">
				<v-card>
					<v-card-title>Заявка на ремонт № {{ item.id }}</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-textarea :rows="2" :height="60" dense label="Причина отказа" v-model="report_finish" outlined></v-textarea>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="deny()" :loading="loading">Завершить</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
	</v-row>
</template>

<script>
import fs from 'file-saver';

export default {
	data () {
		return {
            tableColumn: [
                { text: '№', align: 'start', sortable: true, value: 'id'},
                { text: 'Статус', align: 'start', sortable: true, value: 'status', filter: value => {return this.activeFilters.status ? this.activeFilters.status.includes(value) : true}},
                { text: 'Запрос', align: 'start', sortable: true, value: 'date_request',
			filter: value => {return !this.DateFilters.request_start_date && !this.DateFilters.request_end_date ? true :
			value >= this.DateFilters.request_start_date && value <= this.DateFilters.request_end_date}},
                { text: 'Принято', align: 'start', sortable: true, value: 'date_start',
			filter: value => {return !this.DateFilters.start_start_date && !this.DateFilters.start_end_date ? true :
			value >= this.DateFilters.start_start_date && value <= this.DateFilters.start_end_date}},
                { text: 'Завершено', align: 'start', sortable: true, value: 'date_end',
			filter: value => {return !this.DateFilters.end_start_date && !this.DateFilters.end_end_date ? true :
			value >= this.DateFilters.end_start_date && value <= this.DateFilters.end_end_date}},
                { text: 'Оборудование', align: 'start', sortable: true, value: 'equipment'},
                { text: 'Кабинет', align: 'start', sortable: true, value: 'cabinet_number'},
                { text: 'Инициатор', align: 'start', sortable: true, value: 'user', filter: value => {return this.activeFilters.user ? this.activeFilters.user.includes(value) : true}},
                { text: 'Исполнитель', align: 'start', sortable: true, value: 'executor', filter: value => {return this.activeFilters.executor ? this.activeFilters.executor.includes(value) : true}},
                { text: '', align: 'start', sortable: false, value: 'actions', filterable: false }
            ],
            search: '',
            gridData: [],
			filters: { status: [], equipment: [], user: [], executor: []},
            activeFilters: {},
			DateFilters: {
				request_start_date: null,
				request_end_date: null,
				start_start_date: null,
                start_end_date: null,
				end_start_date: null,
				end_end_date: null
			},
            dialog: false,
            dialogFinish: false,
            loading: false,
			loadingAllow: false,
            item: {},
            report_finish: ''
		}
    },
	watch: {
		gridData(){
			this.initFilters();
		}
	},
	methods: {
		getRepairs(){
			this.$http.get('/api/equipment/repair').then(response => (this.gridData = response.data)).catch(error => (alert(error.response.data.message)));
		},
		today(date){
			if(date === null) return;
			return new Date(date).toLocaleString().split(',')[0];
        },
		initFilters() {
			for (let col in this.filters) {
				this.filters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })}
			this.activeFilters = Object.assign({}, this.filters)
		},
		toggleAll (col) {
			this.activeFilters[col] = this.gridData.map((d) => {return d[col] }).filter((value, index, self) => { return self.indexOf(value) === index })
		},
		clearAll (col) {
			this.activeFilters[col] = []
		},
        detail(item){
            this.item = item;
            this.dialog = true;
        },
        allow(){
            this.$http.put(`/api/equipment/repair/${this.item.id}/allow`, {headers: {'Content-Type': 'application/json'}})
            .then(response => {this.loadingAllow = false; this.dialog = false; this.getRepairs();})
            .catch(error => (this.loadingAllow = false, alert(error.response.data.message)));
        },
        confirmDeny(){
            this.dialog = false,
            this.dialogDeny = true;
        },
        deny(){
            this.loading = true;
            this.$http.put(`/api/equipment/repair/${this.item.id}/deny`, {report: this.report_finish} ,{headers: {'Content-Type': 'application/json'}})
            .then(response => {this.loading = false; this.dialogDeny = false; this.getRepairs();})
            .catch(error => (this.loading = false, alert(error.response.data.message)));
        },
        confirmFinish(){
            this.dialog = false,
            this.dialogFinish = true;
        },
        finish(){
            this.loading = true;
            this.$http.put(`/api/equipment/repair/${this.item.id}/finish`, {report: this.report_finish} ,{headers: {'Content-Type': 'application/json'}})
            .then(response => {this.loading = false; this.dialogFinish = false; this.getRepairs();})
            .catch(error => (this.loading = false, alert(error.response.data.message)));
        }
	},
	computed: {
		idDep(){
			return this.$store.getters.idDepartment;
		},
		header(){
			if(this.verificationInfo.id_status_check === 1) return `№ ${this.verificationInfo.id} - Отправляемое оборудование`;
			if(this.verificationInfo.id_status_check === 2) return `№ ${this.verificationInfo.id} - Отправленное оборудование`;
			if(this.verificationInfo.id_status_check === 3) return `№ ${this.verificationInfo.id} - Полученное(аемое) оборудование`;
			return 'Подготавливаемое оборудование';
		}
	},
	created(){
		this.getRepairs();
	}
  }
</script>