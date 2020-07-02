<template>
  <v-dialog v-model="dialogLogin" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        Se connecter
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Se connecter</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="errorLoginAlert" type="error">
            {{ errorLoginAlert }}
          </v-alert>
          <v-form ref="formLogin" v-model="validLogin">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="emailLogin"
                  :rules="emailRules"
                  label="Email*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="passwordLogin"
                  :rules="passwordRules"
                  label="Mot de passe*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>*champ obligatoire</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogLogin = false"
          >Fermer</v-btn
        >
        <v-btn color="blue darken-1" text @click="validateLogin"
          >Se connecter</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogLogin: false,
      errorLoginAlert: '',
      validLogin: true,
      emailLogin: '',
      passwordLogin: '',
      emailRules: [
        (v) => !!v || 'Email obliatoire !',
        (v) => /.+@.+\..+/.test(v) || "L'Email doit être valide !",
      ],
      passwordRules: [
        (v) => !!v || 'Mot de passe obliatoire !',
        (v) =>
          (v && v.length >= 3) ||
          "Le nom d'utilisateur doit comporter au moins de 3 caractères.",
      ],
    }
  },

  methods: {
    validateLogin() {
      if (this.$refs.formLogin.validate()) {
        this.$store
          .dispatch('login', {
            email: this.emailLogin,
            password: this.passwordLogin,
          })
          .then((response) => {
            this.dialogLogin = false
          })
          .catch((err) => {
            this.errorLoginAlert = err.response.data.error
          })
      }
    },
  },
}
</script>
