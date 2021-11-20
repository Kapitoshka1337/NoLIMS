<template>
    <NuxtChild />
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Base extends Vue  {}
</script>