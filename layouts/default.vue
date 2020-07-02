<template>
  <v-app>
    <Header id="navigation-desktop" />
    <header-mobile id="navigation-mobile" />
    <v-main>
      <nuxt />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
    }
  },
}
</script>

<style>
#navigation-desktop {
  display: block;
}
#navigation-mobile {
  display: none;
}
@media (max-width: 800px) {
  #navigation-desktop {
    display: none;
  }
  #navigation-mobile {
    display: block;
  }
}
</style>
