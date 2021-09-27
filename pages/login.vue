<template>
    <NuxtChild />
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"

@Component
export default class Login extends Vue
{
    layout () {
      return 'auth'
    }
}
</script>