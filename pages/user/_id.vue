<template>
  <v-container>
    <v-row v-if="!$fetchState.pending">
      <v-col v-if="!$store.state.user">
        <h1>Mon compte</h1>
      </v-col>
      <v-col v-else-if="user.id === $store.state.user.id">
        <h1>Mon compte</h1>
      </v-col>
      <v-col v-else>
        <h1>Profile de {{ user.username }}</h1>
      </v-col>
    </v-row>
    <v-row v-if="$fetchState.pending">
      <v-col class="text-center">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>
    <v-row v-if="!$fetchState.pending">
      <v-col xl="3" lg="3" md="3" sm="12">
        <v-card class="mx-auto" max-width="300">
          <v-img
            class="white--text align-end"
            :src="'/api/getAvatarUser/' + user.id"
          >
          </v-img>
          <v-card-title>{{ user.username }}</v-card-title>
          <v-card-subtitle>{{
            user.gender === 'male' ? role.male : role.female
          }}</v-card-subtitle>
          <v-card-text>{{ user.description }}</v-card-text>
        </v-card>
      </v-col>
      <v-col xl="9" lg="9" md="9" sm="12">
        <v-card class="mx-auto">
          <v-tabs v-model="tab" background-color="primary" dark>
            <v-tab key="information">
              Information
            </v-tab>
            <v-tab
              v-if="$store.state.user && user.id === $store.state.user.id"
              key="edit"
            >
              Editer son profil
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item key="information">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col class="detailAccount" lg="3">
                      <p>PSEUDO</p>
                      <p>DESCRIPTION</p>
                      <p>EMAIL</p>
                      <p>SEXE</p>
                      <p>DATE DE CRÉATION</p>
                      <p>EDITÉ LE</p>
                    </v-col>
                    <v-col lg="9">
                      <p>{{ user.username }}</p>
                      <p>
                        {{
                          user.description
                            ? user.description
                            : 'Pas de description !'
                        }}
                      </p>
                      <p>{{ user.email ? user.email : 'Email caché !' }}</p>
                      <p>{{ user.gender === 'male' ? 'Homme' : 'Femme' }}</p>
                      <p>{{ user.created_at }}</p>
                      <p>{{ user.edited_at ? user.edited_at : 'Non édité' }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="edit">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-btn block @click="dialogAvatar = true"
                        >Changer d'avatar</v-btn
                      >
                      <v-form ref="formEdit" v-model="validEditUser">
                        <v-alert v-if="errorEditAlert" type="error">
                          {{ errorEditAlert }}
                        </v-alert>
                        <v-text-field
                          label="Pseudo"
                          disabled
                          v-text="user.username"
                        ></v-text-field>
                        <v-text-field
                          v-model="descriptionEdit"
                          :rules="descriptionRules"
                          label="Description"
                        ></v-text-field>
                        <v-switch
                          v-model="showEmailSwitch"
                          label="Afficher son email"
                        ></v-switch>
                        <v-select
                          v-model="gender"
                          :items="genderItems"
                          label="Sexe"
                          item-text="name"
                          item-value="type"
                        ></v-select>
                      </v-form>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="saveEdit">Sauvegarder</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogAvatar" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Changer d'avatar</span>
        </v-card-title>
        <v-card-text>
          <v-image-input
            v-model="avatarEditData"
            :image-height="300"
            :image-width="300"
            clearable
            image-format="png"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogAvatar = false"
            >Fermer</v-btn
          >
          <v-btn color="blue darken-1" text @click="validAvatar">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" right>
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  async fetch() {
    const userResponse = await this.$axios.$post(
      this.$axios.defaults.baseURL + `/api/user/`,
      {
        id: this.$route.params.id,
      }
    )
    this.user = userResponse
    this.gender = userResponse.gender
    this.showEmailSwitch = !!userResponse.email
    this.descriptionEdit = userResponse.description
    const roleResponse = await this.$axios.$post(
      this.$axios.defaults.baseURL + `/api/userRole/`,
      {
        id: this.$route.params.id,
        roleID: userResponse.role,
      }
    )
    this.role = roleResponse
  },
  fetchOnServer: false,
  data: () => ({
    validEditUser: true,
    dialogAvatar: false,
    showEmailSwitch: null,
    errorEditAlert: '',
    avatarEditData: null,
    user: null,
    role: null,
    avatar: null,
    tab: null,
    snackbar: false,
    snackbarText: null,
    snackbarColor: null,
    descriptionEdit: null,
    gender: null,
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
  }),
  computed: {
    descriptionRules() {
      const rules = []

      if (this.descriptionEdit === null) return

      const descriptionLength = (v) =>
        v.length <= 200 ||
        'Votre description de doit pas dépassé les 200 caractères !'

      rules.push(descriptionLength)

      return rules
    },
  },
  methods: {
    validAvatar() {
      this.dialogAvatar = false
    },
    saveEdit() {
      if (this.$refs.formEdit.validate()) {
        this.$store
          .dispatch('saveEdit', {
            description: this.descriptionEdit,
            avatar: this.avatarEditData,
            showEmail: this.showEmailSwitch,
            user: this.user,
            gender: this.gender,
          })
          .then((response) => {
            this.$fetch()
            this.snackbarColor = 'success'
            this.snackbarText = 'Profil modifié !'
            this.snackbar = true
          })
          .catch((err) => {
            this.errorEditAlert = err.response.data.error
            this.snackbarColor = 'error'
            this.snackbarText = err.response.data.error
            this.snackbar = true
          })
      }
    },
    bufferToBase64(buffer, type) {
      const base64 =
        'data:' +
        type +
        ';base64,' +
        btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
      return base64
    },
  },
}
</script>

<style>
.detailAccount.col-lg-3.col {
  text-align: end !important;
}
</style>
