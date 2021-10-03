<template>
	<v-dialog dense v-model="getVisible" max-width="512px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Инструкция</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-text-field dense label="Имя" outlined v-model="instruction.name"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field dense label="Номер" outlined v-model="instruction.number"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input :show-size="true" dense outlined label="Файл" placeholder="Выберите файл" v-model="file" :loading="loading"></v-file-input>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submit()" :loading="loadingBtn" :disabled="Validation">ОК</v-btn>
                    <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator"

@Component
export default class DialogCreateInstruction extends Vue
{
    loading: boolean = false
    loadingBtn: boolean = false
    loadSelect: boolean = false
    file: Array<File> = []

    public instruction = {} as IInstruction

    @Prop({default: false}) visible!: boolean

    @Watch('file')
    async submitFile(newVal: any)
    {
        if (newVal != null)
        {
            try
            {
                let formData = new FormData();
                formData.append('file', this.file);
                this.loading = true;
                this.$toast.success("Загрузка файла...")
                await this.$axios.post('/api/file/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(response => {
                    this.instruction.fileId = response.data['data'];
                });
                this.loading = false;
                this.$toast.success("Файл успешно загружен.")
            }
            catch (e)
            {
                this.loading = false;
                this.$toast.error("Ошибка во время загрузки файла.");
            }
        }
    }

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
        this.instruction = {} as IInstruction;
    };

    async submit(){
        try
        {
            this.loadingBtn = true
            await this.$axios.post("api/v1/instruction", this.instruction)
            this.$toast.success("Инструкция успешно добавлена.")
            this.loadingBtn = false
            this.$emit("save", true)
            this.closeDialog(false)
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время создания инструкции.");
            this.loadingBtn = false
        }
    };

    get Validation(): boolean
    {
        if (Object.keys(this.instruction).length <=0)
            return true

        if (this.instruction.name == "")
            return true;

        return false;
    }

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        this.closeDialog(value);
    };
}
</script>
