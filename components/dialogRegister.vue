<template>
  <v-dialog v-model="dialogRegister" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        S'inscrire
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">S'inscrire</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="errorRegisterAlert" type="error">
            {{ errorRegisterAlert }}
          </v-alert>
          <v-form ref="formRegister" v-model="validRegister">
            <v-text-field
              v-model="emailRegister"
              :rules="emailRules"
              label="Email*"
              required
            ></v-text-field>
            <v-text-field
              v-model="usernameRegister"
              :rules="usernameRules"
              label="Nom d'utilisateur*"
              required
            ></v-text-field>
            <v-text-field
              v-model="passwordRegister"
              :rules="passwordRules"
              label="Mot de passe*"
              required
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="passwordConfirmRegister"
              :rules="passwordConfirmRules"
              label="Confirmation du mot de passe*"
              required
              type="password"
            ></v-text-field>
            <v-select
              v-model="genderRegister"
              :rules="[(v) => !!v || 'Sexe obligatoire']"
              :items="genderItems"
              label="Sexe*"
              item-text="name"
              item-value="type"
            ></v-select>
          </v-form>
        </v-container>
        <small>*champ obligatoire</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogRegister = false"
          >Fermer</v-btn
        >
        <v-btn color="blue darken-1" text @click="validateRegister"
          >S'inscrire</v-btn
        >
      </v-card-actions>
    </v-card>
    <snackbar-success
      :show-snackbar="snackbarShow"
      :show-text="'Votre inscription a bien été prise en compte.'"
    />
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogRegister: false,
      errorCodeAlert: null,
      errorRegisterAlert: '',
      validRegister: true,
      emailRegister: '',
      usernameRegister: '',
      passwordRegister: '',
      passwordConfirmRegister: '',
      genderRegister: null,
      genderItems: [
        {
          name: 'Homme',
          type: 'male',
        },
        {
          name: 'Femme',
          type: 'female',
        },
      ],
      snackbarShow: false,
    }
  },
  computed: {
    passwordRules() {
      const rules = []
      const passwordLength = (v) =>
        (v && v.length >= 3) ||
        "Le nom d'utilisateur doit comporter au moins de 3 caractères."
      const requiert = (v) => !!v || 'Mot de passe obligatoire !'
      rules.push(passwordLength)
      rules.push(requiert)
      return rules
    },
    usernameRules() {
      const rules = []
      const usernameLength = (v) =>
        (v && v.length <= 15) ||
        "Le nom d'utilisateur doit comporter moins de 15 caractères."
      const requiert = (v) => !!v || "Nom d'utilisateur obligatoire !"
      rules.push(usernameLength)
      rules.push(requiert)
      return rules
    },
    emailRules() {
      const rules = []
      const emailValid = (v) =>
        /.+@.+\..+/.test(v) || "L'Email doit être valide !"
      const requiert = (v) => !!v || 'Email obligatoire !'
      rules.push(emailValid)
      rules.push(requiert)
      return rules
    },
    passwordConfirmRules() {
      const rules = []
      const passwordConfirm = (v) =>
        (!!v && v) === this.passwordRegister ||
        'Le mot de passe de confirmation ne correspond pas !'
      const requiert = (v) => !!v || 'Confirmation du mot de passe obliatoire !'
      rules.push(passwordConfirm)
      rules.push(requiert)
      return rules
    },
  },
  methods: {
    validateRegister() {
      if (this.$refs.formRegister.validate()) {
        this.$store
          .dispatch('register', {
            username: this.usernameRegister,
            email: this.emailRegister,
            password: this.passwordRegister,
            gender: this.genderRegister,
          })
          .then((response) => {
            this.dialogRegister = false
            this.snackbarShow = true
          })
          .catch((err) => {
            this.errorRegisterAlert = err.response.data.error
          })
      }
    },
  },
}
</script>
