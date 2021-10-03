<template>
  <v-row align="center" justify="center">
    <v-col cols="6">
        <v-card>
          <v-card-title>
            БУ УР УВДЦ
          </v-card-title>
            <v-card-text>
              <p>123Pa$$word!</p>
                <v-form ref="form" @keyup.native.enter="onSubmit">
                    <v-text-field name="userNameOrEmail" type="text" v-model="login" label="Логин"></v-text-field>
                    <v-text-field name="password" type="password" v-model="password" label="Пароль"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-text v-if="error != ''">
              <v-alert type="error"></v-alert>
            </v-card-text>
            <v-card-actions class="pa-5">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="Login()" :loading="load">Вход</v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Auth extends Vue {
    login: string = ""
    password: string = ""
    gridData: Object = {}
    error: string = ""
    load: boolean = false

    Login() {
      try {
        this.load = true;
        let response = this.$auth.loginWith('local', { data: { userName: this.login, password: this.password } })
        this.$auth.setUser(response);

        this.load = false
      }
      catch (e) {
        this.load = false
        this.error = e.response ? e.response.data['Message'] : e
      }
    }
}
</script>
