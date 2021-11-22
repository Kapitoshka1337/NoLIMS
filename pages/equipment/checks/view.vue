<template>
  <FormuiCheckTableComp :tableColumn="headers" :singleSelect="false"></FormuiCheckTableComp>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

@Component
export default class ChecksView extends Vue {
    headers: Array<object> = [
        { text: 'Пройденная', align: 'start', sortable: true, value: 'currentCheck', visible: true},
        { text: 'Предстоящая', align: 'start', sortable: true, value: 'nextCheck', visible: true},
        { text: 'Подразделение', align: 'start', sortable: true, value: 'equipment.department' , visible: true},
        { text: 'Номер', align: 'start', sortable: true, value: 'equipment.number' , visible: true},
        { text: 'Наименование оборудования', align: 'start', sortable: true, value: 'equipment.name', visible: true},
        { text: 'Вид', align: 'start', sortable: true, value: 'equipment.type', visible: true},
        { text: 'Модель', align: 'start', sortable: true, value: 'equipment.model', visible: true},
        { text: 'С/Н', align: 'end', sortable: true, value: 'equipment.serialNumber', visible: true},
    ]
}
</script>
