<template>
  <v-container>
    <v-alert v-if="showAlert" text color="info">
      <h3 class="headline">Bienvenue sur Nuxt Forum Test</h3>
      <div>
        Ceci est un forum test.
      </div>

      <v-divider class="my-4 info" style="opacity: 0.22;"></v-divider>

      <v-row align="center" no-gutters>
        <v-col class="grow"
          >Cliquez ici pour supprimer ce message(inutile)</v-col
        >
        <v-spacer></v-spacer>
        <v-col class="shrink">
          <v-btn outlined @click="showAlert = false">
            Ok!
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showAlert: true,
    }
  },
}
</script>
