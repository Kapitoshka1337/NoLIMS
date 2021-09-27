<template>
  <NuxtChild keep-alive exclude="EquipmentDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class EquipmentCover extends Vue {}
</script>