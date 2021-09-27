<template>
	<v-dialog dense v-model="getVisible" max-width="512px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Производитель</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-text-field dense label="Имя" outlined v-model="manufacturer.name"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field dense label="Страна" outlined v-model="manufacturer.country"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field dense label="Город" outlined v-model="manufacturer.city"></v-text-field>
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
import { Component, Prop, Watch, Emit, Vue } from "nuxt-property-decorator"

@Component
export default class DialogCreateManufacturer extends Vue
{
    loading: boolean = false
    loadingBtn: boolean = false
    loadSelect: boolean = false

    public manufacturer = {} as IManufacturer

    @Prop({default: false}) visible!: boolean

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
        this.manufacturer = {} as IManufacturer;
    };

    async submit(){
        try
        {
            this.loadingBtn = true
            await this.$axios.post("api/v1/manufacturer", this.manufacturer)
            this.$toast.success("Прозводитель успешно добавлен.")
            this.loadingBtn = false
            this.$emit("save", true)
            this.closeDialog(false)
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время выполнения.");
            this.loadingBtn = false
        }
    };

    get Validation(): boolean
    {
        if (Object.keys(this.manufacturer).length <=0)
            return true

        if (this.manufacturer.name == "" || this.manufacturer.country == "" || this.manufacturer.city == "")
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