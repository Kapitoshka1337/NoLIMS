<template>
  <v-dialog dense v-model="getVisible" max-width="612px" @input="closeDialog()">
    <v-card>
      <v-card-title>Сотрудник (редактирование)</v-card-title>
      <v-divider></v-divider>
      <v-tabs fixed-tabs>
        <v-tab>Сотрудник</v-tab>
        <v-tab>Роли</v-tab>
        <v-tab>Учетная запись</v-tab>
        <v-tab-item>
          <v-container>
            <v-card flat>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field dense label="Фамилия" outlined v-model="editUser.middleName"></v-text-field>
                      <v-text-field dense label="Имя" outlined v-model="editUser.firstName"></v-text-field>
                      <v-text-field dense label="Отчество" outlined v-model="editUser.lastName"></v-text-field>
                      <department @select-id="getDepartmentId" :show-view="true" :existed-id="editUser.departmentId"></department>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submitUpdate()" :loading="loading">ОК</v-btn>
                <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-data-table :items="gridData"
                          v-model="selected"
                          :show-select="true"
                          :headers="tableColumn"
                          :items-per-page="30"
                          :loading="load"
                          @item-selected="grantInvoke"
                          :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus',
                    itemsPerPageOptions: [30, 50, 100],
                    itemsPerPageText: 'Количество записей',
                  }">
            </v-data-table>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-card flat>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field dense label="Учетная запись" outlined v-model="editUser.userName" :disabled="true"></v-text-field>
                      <v-text-field type="password" dense label="Пароль" outlined v-model="editUser.password"></v-text-field>
                      <v-text-field type="password" dense label="Подтверждение пароля" outlined v-model="editUser.confirmPassword"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submitReset()" :loading="loading">ОК</v-btn>
                <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "nuxt-property-decorator"
  import Department from '../../formui/department/view.vue';

  @Component({ components: { Department } })
  export default class DialogEditUer extends Vue {
    tableColumn: Array<object> = [
      { text: 'ИД', align: 'start', sortable: true, value: 'id' },
      { text: 'Роль', align: 'start', sortable: true, value: 'name' }
    ]
    loading: boolean = false
    load: boolean = false
    gridData: Array<object> = []
    selected: Array<object> = []
    public editUser: IUser = { firstName: "" }

    @Prop({ default: false }) visible!: boolean
    @Prop({ type: Object as () => IUser }) user!: IUser

    closeDialog(value: any) {
      this.$emit('close', value);
      this.loading = false;
      this.selected = []
      this.user = {}
      this.editUser = {}
    };

    getDepartmentId(value: number) {
      this.editUser.departmentId = value
    }

    grantInvoke(item: any) {
      let obj = {}
      obj.roleId = item.item.id;
      obj.userId = this.user.id;

      if (item.value == true)
        this.submitGrant(obj);
      else {
        this.submitInvoke(obj);
      }
    }

    submitGrant(item: any) {
      try {
        this.loading = true;
        this.$axios.post('/api/v1/userrole/grant', item).then(response => {
          this.loading = false;
          this.$toast.success("Роль назначена.");
        }).catch(error => {
          this.$toast.error("Ошибка во время назначения роли.");
          this.loading = false
        })
      }
      catch (e) {
        this.$toast.error("Ошибка во время назначения роли.");
        this.loading = false
      }
    }

    submitInvoke(item: any) {
      try {
        this.loading = true;
        this.$axios.post('/api/v1/userrole/invoke', item).then(response => {
          this.loading = false;
          this.$toast.success("Роль убрана.");
        })
          .catch(error => {
            this.$toast.error("Ошибка во время снятия роли.");
            this.loading = false
          });
      }
      catch (e) {
        this.$toast.error("Ошибка во время снятия роли.");
        this.loading = false
      }
    }

    submitUpdate() {
      try {
        let obj = {};
        obj.id = this.editUser.id;
        obj.middleName = this.editUser.middleName;
        obj.firstName = this.editUser.firstName;
        obj.lastName = this.editUser.lastName;
        obj.departmentId = this.editUser.departmentId;

        this.loading = true;
        this.$axios.post('/api/v1/user/update', obj).then(response => {
          this.loading = false;
          this.$toast.success("Пользователь успешно изменен.");
          this.closeDialog(true);
        }).catch(error => {
          this.$toast.error("Ошибка во время изменения пользователя.");
          this.loading = false
        });
      }
      catch (e) {
        this.$toast.error("Ошибка во время изменения пользователя.");
        this.loading = false
      }
    }

    submitReset() {
      try {
        this.loading = true;
        this.$axios.post('/api/account/reset-password', { userId: this.editUser.id.toString(), password: this.editUser.password, confirmPassword: this.editUser.confirmPassword }).then(response => {
          this.loading = false;
          this.$toast.success("Пароль успешно изменен.");
          this.closeDialog(true);
        }).catch(error => {
          this.$toast.error("Ошибка во время изменения пароля.");
          this.loading = false
        });
      }
      catch (e) {
        this.$toast.error("Ошибка во время изменения пароля.");
        this.loading = false
      }
    }

    @Watch("user")
    getUser(newVal: IUser) {
      if (newVal) {
        this.editUser.id = this.user.id;
        this.editUser.middleName = this.user.middleName;
        this.editUser.firstName = this.user.firstName;
        this.editUser.lastName = this.user.lastName;
        this.editUser.departmentId = this.user.departmentId;
      }
    }

    @Watch("visible")
    getDataVisible(newVal: boolean) {
      if (newVal) {
        this.getData();
      }
    }

    @Watch("gridData")
    watchToGridData(newVal: Array<object>) {
      if (newVal.length > 0) {
        this.gridData.forEach(el => {
          if (el.isGranted == true)
            this.selected.push(el)
        })
      }
    }

    get getValidation() {
      return this.editUser.name == null || this.editUser.name === ""
    }

    get getVisible() {
      if (typeof (this.user) == 'undefined')
        return false;

      return this.visible;
    };

    set getVisible(value: any) {
      this.closeDialog(value);
    };

    async getData() {
      this.load = true;
      await this.$axios.get(`api/v1/userrole?userId=${this.user.id}`).then(response => {
        this.gridData = response.data["data"];
        this.load = false;
      });
    }
  }
</script>
