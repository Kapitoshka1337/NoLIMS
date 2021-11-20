<template>
  <FormuiLocationTableComp :singleSelect="false"></FormuiLocationTableComp>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';

@Component
export default class LocationTable extends Vue {}
</script>
