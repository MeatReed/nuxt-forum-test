<template>
  <div>
    <v-app-bar dense>
      <v-toolbar-title>Nuxt Forum Test</v-toolbar-title>

      <v-spacer></v-spacer>

      <dialog-login v-if="!$store.state.user" />
      <dialog-register v-if="!$store.state.user" />
      <dropdown-menu-user v-if="$store.state.user" />
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style></style>
