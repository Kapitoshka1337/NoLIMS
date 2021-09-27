<template>
	<v-dialog dense v-model="getVisible" max-width="512px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Тип оборудования</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-text-field dense label="Имя" outlined v-model="type.name"></v-text-field>
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
import { Component, Prop, Vue } from "nuxt-property-decorator"

@Component
export default class DialogCreateDepartment extends Vue
{
    loading: boolean = false
    loadingBtn: boolean = false
    loadSelect: boolean = false

    public type = {} as IType

    @Prop({default: false}) visible!: boolean

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
        this.type = {} as IType;
    };

    async submit(){
        try
        {
            this.loadingBtn = true
            await this.$axios.post("api/v1/type", this.type)
            this.$toast.success("Тип оборудования успешно добавлен.")
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
        if (Object.keys(this.type).length <=0)
            return true

        if (this.type.name == "")
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