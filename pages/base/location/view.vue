<template>
  <NuxtChild keep-alive exclude="LocationDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class LocationtView extends Vue {}
</script>