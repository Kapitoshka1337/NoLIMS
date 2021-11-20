<template>
  <NuxtChild keep-alive exclude="DepartmentDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class DeparmtnetView extends Vue {}
</script>