<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title>{{ name }}</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form v-if="Object.keys(gridData).length > 0">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field dense label="Наименование" v-model="gridData.name"></v-text-field>
                            </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field dense label="Номер" v-model="gridData.number"></v-text-field>
                                </v-col>
                        </v-row>                        
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" :disabled="!changed" @click="update()" v-can:edit="department" :loading="updateLoad">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "nuxt-property-decorator"

@Component
export default class DepartmentDetails extends Vue
{
    gridData: Object = {}
    changed: boolean = false
    updateLoad: boolean = false
    const name: string = "";

    async getData (){
        try
        {
            await this.$axios.get(`api/v1/department/${this.$route.params.id}`).then(response => {
                    this.gridData = response.data["data"]
                    this.name = this.gridData.name
                }
            );
            this.changed = false
            this.$toast.success("Подразделение успешно загружено.");
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки подразделения.");
        }
    }

    @Watch("gridData", { deep: true })
    equipment(newVal: object, oldVal: object) {
        this.changed = true
    }

    created (){
        this.getData()
    }

    activated () {
        this.getData()
    }

    async update(){
        if (!this.changed)
            return

        this.updateLoad = true
        let data = await this.$department.update(this.gridData);

        if (data['data'] == true)
        {
            this.changed = false
            this.updateLoad = false
        }
    }
}
</script>
