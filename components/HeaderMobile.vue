<template>
  <div>
    <v-app-bar dense>
      <v-app-bar-nav-icon @click.stop="drawerMobile = !drawerMobile" />

      <v-toolbar-title>Nuxt Forum Test</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawerMobile" fixed bottom temporary>
      <v-list-item
        v-if="$store.state.user"
        nuxt
        :to="'/user/' + $store.state.user.id"
      >
        <v-list-item-avatar>
          <img :src="'/api/getAvatarUser/' + $store.state.user.id" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ $store.state.user.username }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <template v-slot:append>
        <div class="pa-2">
          <dialog-login v-if="!$store.state.user" />
          <dialog-register v-if="!$store.state.user" />
          <dropdown-menu-user v-if="$store.state.user" />
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawerMobile: false,
    }
  },
}
</script>

<style></style>
