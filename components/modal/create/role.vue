<template>
	<v-dialog dense v-model="getVisible" max-width="512px" @input="closeDialog()">
		<v-form>
            <v-card>
                <v-card-title>Роль</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field clearable dense label="Имя" outlined v-model="role.name"></v-text-field>
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

@Component
export default class DialogCreateRole extends Vue
{
    loading: boolean = false

    public role = {} as IRole

    @Prop({default: false}) visible!: boolean

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
        this.role = {} as IRole
    };

    submit(){
        try
        {
            this.loading = true;
            this.$axios.post('/api/v1/roles', this.role).then(reponse => {
              this.loading = false;
              this.$toast.success("Роль успешно создана.");
              this.closeDialog(true);
            }).catch(error => {
              this.closeDialog(false);
              this.$toast.error("Ошибка во время создания роли.");
              this.loading = false;
            })
        }
        catch (e)
        {
            this.closeDialog(false);
            this.$toast.error("Ошибка во время создания роли.");
            this.loading = false
        }
    };

    get getValidation () {
        return this.role.name == null || this.role.name === ""
    }

    get getVisible() {
        return this.visible;
    };

    set getVisible(value: any) {
        this.closeDialog(value);
    };
}
</script>
