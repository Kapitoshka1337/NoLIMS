<template>
  <FormuiDepartmentTableComp :singleSelect="false"></FormuiDepartmentTableComp>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

@Component
export default class DepartmentTable extends Vue {}
</script>
