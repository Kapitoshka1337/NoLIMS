<template>
  <v-dialog dense v-model="getVisible" max-width="612px" @input="closeDialog()">
    <v-card>
      <v-card-title>Роль (редактирование)</v-card-title>
      <v-divider></v-divider>
      <v-tabs fixed-tabs>
        <v-tab>Роль</v-tab>
        <v-tab>Права доступа</v-tab>
        <v-tab-item>
          <v-container>
            <v-card flat>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field clearable dense label="Имя" outlined v-model="editRole.name"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submit()" :loading="loading" :disabled="getValidation">ОК</v-btn>
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
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "nuxt-property-decorator"

  @Component
  export default class DialogEditRole extends Vue {
    tableColumn: Array<object> = [
      { text: 'ИД', align: 'start', sortable: true, value: 'id' },
      { text: 'Ресурс', align: 'start', sortable: true, value: 'resources' },
      { text: 'Значение', align: 'start', sortable: true, value: 'value' }
    ]
    loading: boolean = false
    load: boolean = false
    gridData: Array<object> = []
    selected: Array<object> = []
    public editRole: IRole = { name: "" }

    @Prop({ default: false }) visible!: boolean
    @Prop({ type: Object as () => IRole }) role!: IRole

    closeDialog(value: any) {
      this.$emit('close', value);
      this.loading = false;
      this.selected = []
    };

    grantInvoke(item: any) {
      let obj = {}
      obj.roleId = this.editRole.id;
      obj.resource = item.item.resources;
      obj.claimType = item.item.type;
      obj.claimValue = item.item.value;

      if (item.value == true)
        this.submitGrant(obj);
      else {
        this.submitInvoke(obj);
      }
    }

    submitGrant(item: any) {
      try {
        this.loading = true;
        this.$axios.post('/api/v1/roles/grant', item).then(response => {
          this.loading = false;
          this.$toast.success("Права доступа назначены.");
        });
      }
      catch (e) {
        this.$toast.error("Ошибка во время назначения прав доступа.");
        this.loading = false
      }
    }

    submitInvoke(item: any) {
      try {
        this.loading = true;
        this.$axios.post('/api/v1/roles/invoke', item).then(response => {
          this.loading = false;
          this.$toast.success("Права доступа отняты.");
        });
      }
      catch (e) {
        this.$toast.error("Ошибка во время отнимания прав доступа.");
        this.loading = false
      }
    }

    submit() {
      try {
        this.loading = true;
        this.$axios.post('/api/v1/roles/update', { id: this.editRole.id, name: this.editRole.name }).then(response => {
          this.loading = false;
          this.$toast.success("Роль успешно обновлена.");
          this.closeDialog(true);
        }).cathc(error => {
          this.$toast.error("Ошибка во время обновления роли.");
          this.loading = false
        })
      }
      catch (e) {
        this.$toast.error("Ошибка во время обновления роли.");
        this.loading = false
      }
    }

    @Watch("role")
    getRole(newVal: IRole) {
      if (newVal) {
        this.editRole.name = this.role.name
        this.editRole.id = this.role.id
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
      if (typeof (this.role) == 'undefined')
        return false;

      return this.visible;
    };

    set getVisible(value: any) {
      this.closeDialog(value);
    };

    async getData() {
      this.load = true;
      await this.$axios.get(`api/permission/byrole?roleId=${this.editRole.id}`).then(response => {
        this.gridData = response.data["claims"];
        this.load = false;
      });
    }
  }
</script>
