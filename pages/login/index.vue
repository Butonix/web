<template>
  <v-container v-if="!$store.state.currentUser" fluid>
    <v-row justify="center">
      <v-col :cols="$device.isDesktop ? 6 : 12">
        <v-tabs v-model="tab" grow>
          <v-tab>Log In</v-tab>
          <v-tab>Sign Up</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form
              ref="loginForm"
              v-model="loginValid"
              @submit.prevent="login"
            >
              <v-card-text>
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
                  :type="showPassword ? 'text' : 'password'"
                  :rules="rules.loginPasswordRules"
                >
                  <template v-slot:append>
                    <div
                      style="cursor: pointer"
                      tabindex="-1"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon>{{
                        showPassword
                          ? $vuetify.icons.values.mdiEye
                          : $vuetify.icons.values.mdiEyeOff
                      }}</v-icon>
                    </div>
                  </template>
                </v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  aria-label="Log In"
                  color="primary"
                  depressed
                  block
                  :loading="loading"
                  :disabled="!loginValid"
                  type="submit"
                  >Log In</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-tab-item>

          <v-tab-item>
            <v-form
              ref="signUpForm"
              v-model="signupValid"
              @submit.prevent="signUp"
            >
              <v-card-text>
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
                  :type="showPassword ? 'text' : 'password'"
                  filled
                  dense
                  counter
                  :rules="rules.signUpPasswordRules"
                >
                  <template v-slot:append>
                    <div
                      style="cursor: pointer"
                      tabindex="-1"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon>{{
                        showPassword
                          ? $vuetify.icons.values.mdiEye
                          : $vuetify.icons.values.mdiEyeOff
                      }}</v-icon>
                    </div>
                  </template>
                </v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  :type="showPassword ? 'text' : 'password'"
                  filled
                  dense
                  counter
                  :rules="rules.signUpConfirmPasswordRules"
                >
                  <template v-slot:append>
                    <div
                      style="cursor: pointer"
                      tabindex="-1"
                      @click="showPassword = !showPassword"
                    >
                      <v-icon>{{
                        showPassword
                          ? $vuetify.icons.values.mdiEye
                          : $vuetify.icons.values.mdiEyeOff
                      }}</v-icon>
                    </div>
                  </template>
                </v-text-field>
                <v-row class="mx-0">
                  <v-spacer />
                  <div class="body-2">
                    Note: Password reset is not yet available, so please use a
                    memorable password.
                  </div>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  aria-label="Sign Up"
                  color="primary"
                  depressed
                  block
                  :loading="loading"
                  :disabled="!signupValid"
                  type="submit"
                  >Sign Up</v-btn
                >
              </v-card-actions>
              <div class="caption text-center pb-1">
                By clicking Sign Up, you agree to our
                <nuxt-link to="/terms" target="_blank"
                  >Terms of Service</nuxt-link
                >
                and
                <nuxt-link to="/privacy" target="_blank"
                  >Privacy Policy</nuxt-link
                >.
              </div>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row>
      <v-col>
        <div class="headline">Already logged in</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import signUpGql from '../../gql/signUp.graphql'
import loginGql from '../../gql/login.graphql'

export default {
  data() {
    return {
      tab: 0,
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
          (v) =>
            (v.match(/^[a-z0-9]+$/i) && v.match(/^[a-z0-9]+$/i).length > 0) ||
            'Username must be alphanumeric'
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
  deactivated() {
    this.reset()
  },
  activated() {
    this.reset()
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
        await this.$store.dispatch('fetchCurrentUser')
        this.$router.back()
        this.reset()
      } catch (e) {
        this.err = e.message
        this.$store.dispatch('displaySnackbar', {
          message: this.err.split('GraphQL error: ')[1]
        })
      }
      this.loading = false
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
        await this.$store.dispatch('fetchCurrentUser')
        this.$router.back()
        this.reset()
      } catch (e) {
        this.err = e.message
        this.$store.dispatch('displaySnackbar', {
          message: this.err.split('GraphQL error: ')[1]
        })
      }
      this.loading = false
    },
    reset() {
      this.username = ''
      this.password = ''
      this.confirmPassword = ''
    }
  }
}
</script>

<style scoped></style>
