<template>
  <NuxtChild keep-alive exclude="InstructiosDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class InstructionView extends Vue {}
</script>