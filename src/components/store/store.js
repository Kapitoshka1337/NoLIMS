import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		//status: '',
		token: localStorage.getItem('token') || '',
		id_department: localStorage.getItem('id_department') || '',
		name: localStorage.getItem('name') || '',
		roles: +localStorage.getItem('roles') || 0,
		user : null
	},
	mutations:{
		//auth_request(state){
		//	state.status = 'loading';
		//},
		auth_success(state, {tkn, usr, id_dep, nm, rls}){
			//state.status = 'success';
			state.token = tkn;
			state.id_department = id_dep;
			state.name = nm;
			state.roles = rls;
			state.user = usr;
		},
		//auth_error(state){
		//	state.status = 'error';
		//},
		logout(state){
			//state.status = '';
			state.token = '';
		},
	},
	actions:{
		login({commit}, user){
			return new Promise((resolve, reject) => {
			//  commit('auth_request');
			  axios({url: 'http://laravel/api/auth/login', data: user, method: 'POST' })
			  .then(response => {
				const tkn = response.data.token;
				const usr = response.data.user;
				const id_dep = response.data.user.id_department;
				const nm = response.data.user.name;
				const rls = response.data.user.roles[0];
				localStorage.setItem('token', tkn);
				localStorage.setItem('id_department', usr.id_department);
				localStorage.setItem('name', usr.name);
				localStorage.setItem('roles', usr.roles[0]);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + tkn;
				commit('auth_success', {tkn, usr, id_dep, nm, rls});
				resolve(response);
			  })
			  .catch(error => {
				commit('auth_error');
				localStorage.removeItem('token');
				reject(error);
			  })
			})
		},
		register({commit}, user){
			return new Promise((resolve, reject) => {
			//  commit('auth_request');
			  axios({url: 'http://laravel/api/auth/singup', data: user, method: 'POST' })
			  .then(response => {
				const tkn = response.data.token;
				const usr = response.data.user;
				const id_dep = response.data.user.id_department;
				const nm = response.data.user.name;
				const rls = response.data.user.roles[0];
				localStorage.setItem('token', tkn);
				localStorage.setItem('id_department', usr.id_department);
				localStorage.setItem('name', usr.name);
				localStorage.setItem('roles', usr.roles[0]);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + tkn;
				commit('auth_success', {tkn, usr, id_dep, nm, rls});
				resolve(response);
			  })
			  .catch(error => {
				//commit('auth_error', error);
				localStorage.removeItem('token');
				reject(error);
			  })
			})
		},
		logout({commit}){
			return new Promise((resolve, reject) => {
			  commit('logout');
			  localStorage.removeItem('token');
			  localStorage.removeItem('id_department');
			  localStorage.removeItem('name');
			  localStorage.removeItem('roles');
			  delete axios.defaults.headers.common['Authorization'];
			  resolve();
			})
		}
	},
	getters:{
		isLoggedIn(state){
			if(state.token)
			return true;
		},
		//authStatus(state){
		//	return state.status;
		//},
		user(state){
			return state.user;
		},
		idDepartment(state){
			return state.id_department;
		},
		name(state){
			return state.name;
		},
		isRoles(state){
			return state.roles;
		}
	}
})