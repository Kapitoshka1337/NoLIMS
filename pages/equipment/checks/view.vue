<template>
  <FormuiCheckTableComp :tableColumn="headers" :singleSelect="false" :showSelect="true"></FormuiCheckTableComp>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

@Component
export default class ChecksView extends Vue {
    headers: Array<object> = [
        { text: 'Пройденная', align: 'start', sortable: true, value: 'currentCheck', visible: true, width: 128},
        { text: 'Предстоящая', align: 'start', sortable: true, value: 'nextCheck', visible: true, width: 128},
        { text: 'Подразделение', align: 'start', sortable: true, value: 'equipment.department' , visible: true, width: 128},
        { text: 'Номер', align: 'start', sortable: true, value: 'equipment.number' , visible: true, width: 128},
        { text: 'Наименование оборудования', align: 'start', sortable: true, value: 'equipment.name', visible: true, width: 128},
        { text: 'Вид', align: 'start', sortable: true, value: 'equipment.type', visible: true, width: 128},
        { text: 'Модель', align: 'start', sortable: true, value: 'equipment.model', visible: true, width: 128},
        { text: 'С/Н', align: 'end', sortable: true, value: 'equipment.serialNumber', visible: true, width: 128},
    ]
}
</script>
