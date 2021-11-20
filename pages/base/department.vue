<template>
    <NuxtChild keep-alive exclude="DepartmentDetails"/>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class DepartmentView extends Vue  {}
</script>