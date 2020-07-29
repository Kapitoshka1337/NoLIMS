import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		status: '',
		token: localStorage.getItem('token') || '',
		user : null
	},
	mutations:{
		auth_request(state){
			state.status = 'loading';
		},
		auth_success(state, {tkn, usr}){
			state.status = 'success';
			state.token = tkn;
			state.user = usr;
		},
		auth_error(state){
			state.status = 'error';
		},
		logout(state){
			state.status = '';
			state.token = '';
		},
	},
	actions:{
		login({commit}, user){
			return new Promise((resolve, reject) => {
			  commit('auth_request');
			  axios({url: '/api/auth/login', data: user, method: 'POST' })
			  .then(response => {
				const tkn = response.data.token;
				const usr = response.data.user;
				localStorage.setItem('token', tkn);
				// localStorage.setItem('id_department', usr.);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + tkn;
				commit('auth_success', {tkn, usr});
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
			  commit('auth_request');
			  axios({url: '/api/auth/singup', data: user, method: 'POST' })
			  .then(response => {
				const tkn = response.data.token;
				const usr = response.data.user;
				localStorage.setItem('token', tkn);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + tkn;
				commit('auth_success', {tkn, usr});
				resolve(response);
			  })
			  .catch(error => {
				commit('auth_error', error);
				localStorage.removeItem('token');
				reject(error);
			  })
			})
		},
		logout({commit}){
			return new Promise((resolve, reject) => {
			  commit('logout');
			  localStorage.removeItem('token');
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
		authStatus(state){
			return state.status;
		},
		user(state){
			return state.user;
		}
	}
})