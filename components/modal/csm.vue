<template>
  <v-dialog dense persistent v-model="getVisible" max-width="512px">
    <v-form>
      <v-card>
        <v-card-title>Заявка в Удмуртский ЦСМ</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field :clearable="true" dense label="Номер договора" outlined v-model="orderCsm.numberOrder"></v-text-field>
                <v-text-field :clearable="true" dense label="Исполнитель" outlined v-model="orderCsm.client"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="submit()" :loading="loadingBtn">ОК</v-btn>
          <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Emit, Vue } from "nuxt-property-decorator"
  import FileSaver from 'file-saver'

  @Component
  export default class OrderCsmDialog extends Vue {
    @Prop({ default: false }) visible!: boolean
    @Prop({ type: Array }) equipments!: Array

    public orderCsm = { equipmentId: [], client: '', numberOrder: ''}

    loadingBtn: boolean = false
    loadSelect: boolean = false

    closeDialog(value: any) {
      this.$emit('close', value);
      this.loadingBtn = false;
    };

    async submit() {

      this.orderCsm.equipmentId = this.equipments;

      try {
        this.$toast.success("Формирование заявки в Удмуртский ЦСМ запущено.");
        this.loadingBtn = true;
        this.$axios.post("api/v1/report/csm", this.orderCsm, { responseType: 'blob' })
          .then(response => {
            const fl = new Blob([response.data], { type: response.data['type'] });
            FileSaver.saveAs(fl, "Заявка в Удмуртский ЦСМ.pdf");
            this.selected = [];
            this.$toast.success("Заявка в Удмуртский ЦСМ успешно сформирована.");
          });
          this.loadingBtn = false;
          this.closeDialog(false);
      }
      catch (e) {
        this.$toast.error("Ошибка во время формирования заявки в Удмуртский ЦСМ.");
        this.loadingBtn = false
      }
    };

    get getVisible() {
      return this.visible;
    };

    set getVisible(value: any) {
      // this.closeDialog(value);
    }
  }
</script>
