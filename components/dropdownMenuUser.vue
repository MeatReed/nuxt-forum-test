<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" text v-on="on">
        {{ $store.state.user.username }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="logout">
        <v-list-item-title>Se déconnecter</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
  },
}
</script>
