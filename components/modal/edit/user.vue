<template>
  <v-dialog dense v-model="getVisible" max-width="612px" @input="closeDialog()">
    <v-card>
      <v-card-title>Сотрудник (редактирование)</v-card-title>
      <v-divider></v-divider>
      <v-tabs fixed-tabs>
        <v-tab>Сотрудник</v-tab>
        <v-tab>Роли</v-tab>
        <v-tab-item>
          <v-container>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field clearable dense label="Имя" outlined v-model="editRole.firstName"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
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
      </v-tabs>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="submit()" :loading="loading" :disabled="getValidation">ОК</v-btn>
        <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "nuxt-property-decorator"

  @Component
  export default class DialogEditUer extends Vue {
    tableColumn: Array<object> = [
      { text: 'ИД', align: 'start', sortable: true, value: 'id' },
      { text: 'Роль', align: 'start', sortable: true, value: 'name' }
    ]
    loading: boolean = false
    load: boolean = false
    gridData: Array<object> = []
    selected: Array<object> = []
    public editRole: IUser = { firstName: "" }

    @Prop({ default: false }) visible!: boolean
    @Prop({ type: Object as () => IUser }) user!: IUser

    closeDialog(value: any) {
      this.$emit('close', value);
      this.loading = false;
      this.selected = []
    };

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

    //submit() {
    //  try {
    //    this.loading = true;
    //    this.$axios.post('/api/v1/userrole/grant', {}).then(response => {
    //      this.loading = false;
    //      this.$toast.success("Права доступа назначены.");
    //    });
    //  }
    //  catch (e) {
    //    this.$toast.error("Ошибка во время назначения прав доступа.");
    //    this.loading = false
    //  }
    //}

    @Watch("user")
    getUser(newVal: IUser) {
      if (newVal) {
        this.editRole.firstName = this.user.firstName
        this.editRole.id = this.user.id
        return this.editRole
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
      return this.editRole.name == null || this.editRole.name === ""
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
