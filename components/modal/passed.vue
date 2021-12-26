<template>
	<v-dialog dense persistent v-model="getVisible" max-width="512px">
		<v-form>
            <v-card>
                <v-card-title>Пройденная поверка</v-card-title>
                <v-divider></v-divider>
                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>{{ getEquipment.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ getEquipment.model }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-autocomplete :loading="loadSelect" :disabled="loadSelect" :items="dropdown" :clearable="true" outlined dense label="Вид документа" v-model="verification.documentKindId"></v-autocomplete>
                                <v-text-field :clearable="true" dense label="Регистрационный номер документа" outlined v-model="verification.numberDocument"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <input type="date" is="v-text-field" dense label="Пройденная поверка" outlined v-model="verification.currentCheck">
                            </v-col>
                            <v-col cols="12" md="6">
                                <input type="date" is="v-text-field" dense label="Предстоящая поверка" outlined v-model="verification.nextCheck">
                            </v-col>
                            <v-file-input :show-size="true" dense outlined label="Файл" placeholder="Выберите файл" v-model="file"></v-file-input>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-card-title>{{ getEquipment.number }}</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submit()" :loading="loadingBtn" v-bind:disabled="isTime">ОК</v-btn>
                    <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "nuxt-property-decorator"

@Component
export default class PassedDialog extends Vue
{
    @Prop({default: false}) visible!: boolean
    @Prop({default: false}) internalSubmit!: boolean
    @Prop({ type: Object as () => IEquipment }) equipment!: IEquipment
    
    public verification = {} as IVerification
    file: Array<File> = []

    docType: Array<object> = []
    loadingBtn: boolean = false
    loadSelect: boolean = false

    closeDialog(value: any){
        this.$emit('close', value);
        this.loadingBtn = false;
    };

    async submit(){
        if(this.getInternalSubmit)
        {
            this.$emit('submit', this.verification);
            this.loadingBtn = true;
            return true;
        }

        try
        {
            this.verification.equipmentId = this.getEquipment.id
            this.loadingBtn = true
            await this.$axios.post("api/v1/check", this.verification).then(response => {
              this.$toast.success("Пройденная поверка успешно добавлена.")
              this.loadingBtn = false
              this.$emit("save", true)
              this.closeDialog(false)
            }).catch(error => {
              this.$toast.error("Ошибка во время добавление пройденной поверки.");
              this.loadingBtn = false;
            })
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время добавление пройденной поверки.");
            this.loadingBtn = false
        }
    };

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        // this.closeDialog(value);
    };

    get getEquipment(){
        if (this.equipment != null)
            return this.equipment

        let eq: IEquipment = { name: "Name" }
        return eq
    };

    get getInternalSubmit(){
        return this.internalSubmit
    };

    get isTime(){
        let current = new Date(this.verification.currentCheck);
        let next = new Date(this.verification.nextCheck);
        return (current.getUTCFullYear() >= next.getUTCFullYear()) || current.getUTCFullYear() === null || next.getUTCFullYear() === null
    };

    get nextDate(){
        return this.verification.currentCheck;
    }

    get dropdown(){
        if(this.docType.length > 0)
        {
            let result = [];
            for (let str of this.docType)
                result.push({value: str['id'], text: str['name']});
            return result;
        }
    };

    @Watch("getVisible")
    watchVisible(newVal: any, oldVal: any){
        if(newVal && this.docType.length <= 0)
        {
            this.loadSelect = true;
            this.$axios.get('/api/v1/documentkind?pageSize=13').then(response => (this.docType = response.data['data'], this.loadSelect = false)).catch(error => (alert(error.response.data.message), this.loadSelect = false));
        }
        if(!newVal)
            this.closeDialog(true)
    };

    @Watch('file')
    async submitFile(newVal: any)
    {
        if (newVal != null)
        {
            try
            {
                let formData = new FormData();
                formData.append('file', this.file);
                this.loadingBtn = true;
                this.$toast.success("Загрузка файла...")
                await this.$axios.post('/api/file/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    this.verification.fileId = response.data['data'];
                });
                this.loadingBtn = false;
                this.$toast.success("Файл успешно загружен.")
            }
            catch (e)
            {
                this.loadingBtn = false;
                this.$toast.success("Ошибка во время загрузки файла.")
            }
        }
        else
        {
            this.verification.fileId = null
        }
    }
}
</script>
