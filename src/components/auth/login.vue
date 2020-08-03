<template>
	<sui-container>
		<sui-grid class="centered padded">
			<sui-grid-column :width="8">
				<sui-card class="fluid">
					<sui-card-content>
						<sui-card-header class="center aligned"><h2>БУ УР <q>УВДЦ</q></h2></sui-card-header>
					</sui-card-content>
					<sui-card-content>
						<sui-form @submit.prevent="login">
							<sui-form-field>
								<label>Пользователь</label>
								<sui-dropdown :options="isUsers" search selection v-model="user.name"></sui-dropdown>
							</sui-form-field>
							<sui-form-field>
								<label>Пароль</label>
								<input type="password" v-model="user.password">
							</sui-form-field>
							<sui-button v-bind:loading="loading" v-bind:disabled="!users.length" fluid color="green" content="Войти"></sui-button>
						</sui-form>
					</sui-card-content>
					<sui-card-content>
						<sui-message>
							<router-link to="/singup" is="sui-menu-item">Регистрация</router-link>
						</sui-message>
					</sui-card-content>
				</sui-card>
			</sui-grid-column>
		</sui-grid>
	</sui-container>
</template>

<script>
export default {
	data(){
		return {
			users: [],
			user: {
				name: null,
				password: null
			},
			loading: false
		}
	},
	methods: {
		getUsers(){
			this.loading = !this.loading;
			this.$http.get('http://laravel/api/structure/users').then(response => (this.users = response.data, this.loading = !this.loading)).catch(error => (alert(error.response.data.message), this.loading = !this.loading));
		},
		login(){
			this.loading = !this.loading;
			this.$store.dispatch('login', this.user).then(() => this.$router.push('/'), this.loading = !this.loading).catch(error => alert(error.response.data.message), this.loading = !this.loading);
		}
	},
	computed: {
		isUsers(){
			if(this.users.length)
			{
				let obj = [];
				for(let i in this.users)
					obj.push({key: this.users[i].name, value: this.users[i].name, text: this.users[i].name});
				return obj;
			}
		}
	},
	created(){
		this.getUsers();
	}
}
</script>