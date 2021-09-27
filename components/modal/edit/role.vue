<template>
	<v-dialog dense v-model="getVisible" max-width="512px" @input="closeDialog()">
		<!--<v-form>-->
            <v-card>
                <v-card-title>Роль (редактирование)</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-tabs>
                    <v-tab>Роль</v-tab>
                    <v-tab>Права доступа</v-tab>
                    <v-tab-item>
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field clearable dense label="Имя" outlined v-model="editRole.name"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                    </v-tab-item>
                    <v-tab-item>
                      Права доступа
                    </v-tab-item>
                  </v-tabs>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="submit()" :loading="loading" :disabled="getValidation">ОК</v-btn>
                    <v-btn color="error" v-on:click="closeDialog()">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        <!--</v-form>-->
	</v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator"

@Component
export default class DialogEditRole extends Vue
{
    loading: boolean = false
    public editRole: IRole = { name: ""}

    @Prop({default: false}) visible!: boolean
    @Prop({ type: Object as () => IRole }) role!: IRole

    closeDialog(value: any){
        this.$emit('close', value);
        this.loading = false;
    };

    submit(){
        try
        {
            this.loading = true;
            this.$axios.post(`/api/v1/roles/update/${this.role.id}?request=${this.editRole.name}`)
            this.loading = false
            this.$toast.success("Роль успешно изменена.");
            this.closeDialog(true);
        }
        catch (e)
        {
            this.closeDialog(false);
            this.$toast.error("Ошибка во время изменения роли.");
            this.loading = false
        }
    };

    @Watch("role")
    getRole (newVal: IRole)
    {
        if (newVal)
        {
            this.editRole.name = this.role.name
            return this.editRole
        }
    }

    get getValidation () {
        return this.editRole.name == null || this.editRole.name === ""
    }

    get getVisible() {
        if (typeof(this.role) == 'undefined')
            return false;
        
        return this.visible;
    };

    set getVisible(value: any) {
        this.closeDialog(value);
    };
}
</script>
