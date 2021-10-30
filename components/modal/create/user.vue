<template>
	<v-dialog dense v-model="getVisible" max-width="564px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Сотрудник</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field dense label="Фамилия" outlined v-model="user.middleName"></v-text-field>
                          <v-text-field dense label="Имя" outlined v-model="user.firstName"></v-text-field>
                          <v-text-field dense label="Отчество" outlined v-model="user.lastName"></v-text-field>
                          <v-text-field dense label="Учетная запись" outlined v-model="user.userName"></v-text-field>
                          <v-text-field type="password" dense label="Пароль" outlined v-model="user.password"></v-text-field>
                          <v-text-field type="password" dense label="Подтверждение пароля" outlined v-model="user.confirmPassword"></v-text-field>
                          <department @select-id="getDepartmentId" :show-view="true"></department>
                        </v-col>
                      </v-row>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submit()" :loading="loading" :disabled="getValidation">ОК</v-btn>
                    <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"
import Department from '../../formui/department/view.vue';

@Component({ components: { Department } })
export default class DialogCreateUser extends Vue
{
    loading: boolean = false

    public user = {} as IUser

    @Prop({default: false}) visible!: boolean

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
      this.user = {} as IUser
    };

    getDepartmentId(value: number) {
      this.user.departmentId = value
    }

    submit(){
        try
        {
          this.loading = true;
          this.$axios.post('/api/v1/user', this.user).then(response => {
            this.loading = false
            this.$toast.success("Пользователь успешно создан.");
            this.closeDialog(true);
          }).catch(error => {
            this.closeDialog(false);
            this.$toast.error("Ошибка во время создания пользователя.");
            this.loading = false
          })
        }
        catch (e)
        {
            this.closeDialog(false);
            this.$toast.error("Ошибка во время создания пользователя.");
            this.loading = false
        }
    };

    get getValidation() {
      if (this.user.password != this.user.confirmPassword)
        return false;

      return this.user.userName == null || this.user.userName === ""
    }

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        this.closeDialog(value);
    };
}
</script>
