<template>
  <v-dialog
    v-model="dialog"
    width="35%"
    :fullscreen="!$device.isDesktop"
    :hide-overlay="!$device.isDesktop"
    :transition="
      $device.isDesktop ? 'dialog-transition' : 'dialog-bottom-transition'
    "
  >
    <template v-slot:activator="{ on }">
      <v-list-item
        link
        v-on="on"
        @click="$store.commit('setRedirectLoginDialogToCompose', false)"
      >
        <v-list-item-icon>
          <v-icon>{{ icons.accountCircle }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Login/Sign Up</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-card :tile="!$device.isDesktop">
      <v-toolbar v-if="!$device.isDesktop" dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>{{ icons.close }}</v-icon>
        </v-btn>
        <v-toolbar-title>
          <span v-if="!err">{{
            tab === 0 ? 'Login to Comet' : 'Sign Up'
          }}</span>
          <span v-else class="black--text">{{
            err.split('GraphQL error: ')[1]
          }}</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-tabs v-model="tab" grow>
        <v-tab>Login</v-tab>
        <v-tab>Sign Up</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card-title v-if="$device.isDesktop"
            ><span v-if="!err">Login</span>
            <span v-else class="error--text">{{
              err.split('GraphQL error: ')[1]
            }}</span></v-card-title
          >
          <v-card-text>
            <v-form ref="loginForm" v-model="loginValid">
              <v-text-field
                v-model="username"
                label="Username"
                filled
                dense
                :rules="rules.loginUsernameRules"
              />
              <v-text-field
                v-model="password"
                label="Password"
                filled
                dense
                :append-icon="showPassword ? icons.eye : icons.eyeOff"
                :type="showPassword ? 'text' : 'password'"
                :rules="rules.loginPasswordRules"
                @click:append="showPassword = !showPassword"
                @keydown.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              depressed
              block
              :loading="loading"
              :disabled="!loginValid"
              @click="login"
              >Login</v-btn
            >
          </v-card-actions>
        </v-tab-item>

        <v-tab-item>
          <v-card-title v-if="$device.isDesktop"
            ><span v-if="!err">Sign Up</span>
            <span v-else class="error--text">{{
              err.split('GraphQL error: ')[1]
            }}</span></v-card-title
          >
          <v-card-text>
            <v-form ref="signUpForm" v-model="signupValid">
              <v-text-field
                v-model="username"
                label="Username"
                filled
                dense
                :rules="rules.signUpUsernameRules"
              />
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="showPassword ? icons.eye : icons.eyeOff"
                :type="showPassword ? 'text' : 'password'"
                filled
                dense
                counter
                :rules="rules.signUpPasswordRules"
                @click:append="showPassword = !showPassword"
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                :append-icon="showPassword ? icons.eye : icons.eyeOff"
                :type="showPassword ? 'text' : 'password'"
                filled
                dense
                counter
                :rules="rules.signUpConfirmPasswordRules"
                @click:append="showPassword = !showPassword"
                @keydown.enter="signUp"
              />
              <v-row class="mx-0">
                <v-spacer />
                <div class="body-2">
                  Note: Password reset is not yet available, so please use a
                  memorable password.
                </div>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              depressed
              block
              :loading="loading"
              :disabled="!signupValid"
              @click="signUp"
              >Sign Up</v-btn
            >
          </v-card-actions>
          <div class="caption text-center pb-1">
            By clicking Sign Up, you agree to our
            <nuxt-link to="/terms-of-service" target="_blank"
              >Terms of Service</nuxt-link
            >
            and
            <nuxt-link to="/privacy-policy" target="_blank"
              >Privacy Policy</nuxt-link
            >.
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiAccountCircle, mdiClose, mdiEye, mdiEyeOff } from '@mdi/js'
import signUpGql from '../gql/signUp.graphql'
import loginGql from '../gql/login.graphql'

export default {
  name: 'LoginDialog',
  data() {
    return {
      icons: {
        accountCircle: mdiAccountCircle,
        close: mdiClose,
        eye: mdiEye,
        eyeOff: mdiEyeOff
      },
      tab: null,
      username: '',
      password: '',
      confirmPassword: '',
      loading: false,
      showPassword: false,
      signupValid: false,
      loginValid: false,
      err: '',
      rules: {
        signUpUsernameRules: [
          (v) => !!v || 'Username is required',
          (v) => v.length >= 3 || 'Username must be at least 3 characters',
          (v) => v.length <= 20 || 'Maximum username length is 20 characters',
          (v) => v.match(/^[a-z0-9]+$/i) || 'Username must be alphanumeric'
        ],
        loginUsernameRules: [(v) => !!v || 'Username is required'],
        signUpPasswordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 6 || 'Password must be at least 6 characters'
        ],
        loginPasswordRules: [(v) => !!v || 'Password is required'],
        signUpConfirmPasswordRules: [
          (v) => !!v || 'Password confirmation is required',
          (v) => v === this.password || 'Passwords do not match'
        ]
      }
    }
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.loginDialog
      },
      set(val) {
        this.$store.commit('setLoginDialog', val)
      }
    }
  },
  watch: {
    dialog() {
      this.$nextTick(() => {
        if (!this.dialog) {
          this.username = ''
          this.password = ''
          this.confirmPassword = ''
          this.err = ''
          this.tab = 0
          if (this.$refs.loginForm) {
            this.$refs.loginForm.resetValidation()
          }
          if (this.$refs.signUpForm) {
            this.$refs.signUpForm.resetValidation()
          }
        }
      })
    }
  },
  methods: {
    async signUp() {
      this.loading = true
      try {
        const res = await this.$apollo
          .mutate({
            mutation: signUpGql,
            variables: {
              username: this.username,
              password: this.password
            }
          })
          .then(({ data }) => data && data.signUp)
        await this.$apolloHelpers.onLogin(res.accessToken)
        this.dialog = false
      } catch (e) {
        this.err = e.message
      }
      this.loading = false
      if (this.$store.state.redirectLoginDialogToCompose) {
        this.$router.push('/new')
        this.$store.commit('setRedirectLoginDialogToCompose', false)
      }
    },
    async login() {
      this.loading = true
      try {
        const res = await this.$apollo
          .mutate({
            mutation: loginGql,
            variables: {
              username: this.username,
              password: this.password
            }
          })
          .then(({ data }) => data && data.login)
        await this.$apolloHelpers.onLogin(res.accessToken)
        this.dialog = false
      } catch (e) {
        this.err = e.message
      }
      this.loading = false
      if (this.$store.state.redirectLoginDialogToCompose) {
        this.$router.push('/new')
        this.$store.commit('setRedirectLoginDialogToCompose', false)
      }
    }
  }
}
</script>

<style scoped></style>
