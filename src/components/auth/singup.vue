<template>
<!--<div class="ui centered grid container padded">
	<sui-card>
asdad
			</sui-card>
</div>-->
<sui-container>
	<sui-grid class="centered padded">
		<sui-grid-column :width="8">
			<sui-card class="fluid">
				<sui-card-content>
					<sui-card-header class="center aligned"><h2>БУ УР <q>УВДЦ</q></h2></sui-card-header>
				</sui-card-content>
				<sui-card-content v-if="warning.length">
					<sui-message class="warning">
						<i class="icon warning"></i>
						{{ warning[0] }}
					</sui-message>
				</sui-card-content>
				<sui-card-content>
					<sui-form @submit.prevent="singup">
						<sui-form-field>
							<label>Пользователь</label>
							<input type="text" placeholder="Фамилия И.О." v-model="user.name">
						</sui-form-field>
						<sui-form-field>
							<label>Отдел</label>
							<sui-dropdown :options="isDepartment" search selection v-model="user.id_department"></sui-dropdown>
						</sui-form-field>
						<sui-form-field>
							<label>Должность</label>
							<sui-dropdown :options="isRank" search selection v-model="user.id_rank"></sui-dropdown>
						</sui-form-field>
						<sui-form-field>
							<label>Пароль</label>
							<input type="password" v-model="user.password">
						</sui-form-field>
						<sui-button fluid color="green" v-bind:loading="loading" v-bind:disabled="!Object.keys(data).length" content="Зарегистрироваться"></sui-button>
					</sui-form>
				</sui-card-content>
			</sui-card>
		</sui-grid-column>
	</sui-grid>
</sui-container>
</template>

<script>
import axios from 'axios';

export default {
	data(){
		return {
			user: {
				name: null,
				id_department: null,
				id_rank: null,
				password: null
			},
			data: Object,
			warning: [],
			loading: false
		}
	},
	methods: {
		getInfo(){
			this.loading = !this.loading;
			axios.get('/api/structure').then(response => (this.data = response.data, this.loading = !this.loading)).catch(error => (alert(error), this.loading = !this.loading));
		},
		singup(){
			Object.keys(this.user).some(us => {
				if(this.user[us] === null || this.user[us] === '')
				{
					this.warning = [];
					this.warning.push('Заполните пропущенные поля');
				}
				return;
			})
			this.$store.dispatch('register', this.user).then(() => this.$router.push('/')).catch(error => alert(error.response.data.message));
			//axios.post('/api/auth/singup', this.user).then(response => (alert(response.data))).catch(error => (alert(error)));
			//e.preventDefault();
		}
	},
	computed: {
		isDepartment(){
			if(this.data)
			{
				let obj = [];
				for(let i in this.data.departments)
					obj.push({key: this.data.departments[i].id, value: this.data.departments[i].id, text: this.data.departments[i].title})
				return obj;
			}
		},
		isRank(){
			if(this.data)
			{
				let obj = [];
				for(let i in this.data.ranks)
					obj.push({key: this.data.ranks[i].id, value: this.data.ranks[i].id, text: this.data.ranks[i].title})
				return obj;
			}
		}
	},
	created(){
		this.getInfo();
	}
}
</script>