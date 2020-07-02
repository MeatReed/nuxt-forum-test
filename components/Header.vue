<template>
  <div>
    <v-app-bar dense>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

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
  data() {},
}
</script>

<style></style>
