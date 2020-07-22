<template>
  <v-form ref="form" v-model="valid" @submit.prevent="signUp">
    <v-text-field
      v-model="username"
      :rules="username.length > 0 ? rules.usernameRules : []"
      solo
      flat
      dense
      :background-color="$vuetify.theme.dark ? '#202124' : '#DEE1E6'"
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      label="Username"
    />

    <v-text-field
      v-model="email"
      :rules="email.length > 0 ? rules.emailRules : []"
      solo
      flat
      dense
      :background-color="$vuetify.theme.dark ? '#202124' : '#DEE1E6'"
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      label="Email (Optional)*"
    />

    <v-text-field
      v-model="password"
      :rules="password.length > 0 ? rules.passwordRules : []"
      solo
      flat
      dense
      :background-color="$vuetify.theme.dark ? '#202124' : '#DEE1E6'"
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
    >
      <template v-slot:append>
        <div
          style="cursor: pointer"
          tabindex="-1"
          @click="showPassword = !showPassword"
        >
          <v-icon class="text--secondary">{{
            showPassword
              ? $vuetify.icons.values.mdiEye
              : $vuetify.icons.values.mdiEyeOff
          }}</v-icon>
        </div>
      </template>
    </v-text-field>
    <v-text-field
      v-model="confirmPassword"
      :rules="confirmPassword.length > 0 ? rules.confirmPasswordRules : []"
      solo
      flat
      dense
      :background-color="$vuetify.theme.dark ? '#202124' : '#DEE1E6'"
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      label="Confirm Password"
      :type="showPassword ? 'text' : 'password'"
    >
      <template v-slot:append>
        <div
          style="cursor: pointer"
          tabindex="-1"
          @click="showPassword = !showPassword"
        >
          <v-icon class="text--secondary">{{
            showPassword
              ? $vuetify.icons.values.mdiEye
              : $vuetify.icons.values.mdiEyeOff
          }}</v-icon>
        </div>
      </template>
    </v-text-field>

    <div class="caption text--secondary pb-1">
      *Emails are only used for account recovery and are not shared with any
      third parties.
    </div>
    <div class="caption text--secondary pb-3">
      By clicking Continue, you agree to our
      <nuxt-link to="/terms" target="_blank" class="primary--text"
        >Terms of Service</nuxt-link
      >
      and
      <nuxt-link to="/privacy" target="_blank" class="primary--text"
        >Privacy Policy</nuxt-link
      >.
    </div>

    <v-btn
      class="mr-1"
      rounded
      depressed
      color="primary"
      type="submit"
      :disabled="!formValid"
      :loading="loading"
      >Continue</v-btn
    >

    <v-btn rounded text class="text--secondary" nuxt to="/login"
      >Already have an account?</v-btn
    >
  </v-form>
</template>

<script>
import * as EmailValidator from 'email-validator'
import signUpGql from '../gql/signUp.graphql'

export default {
  name: 'SignUpForm',
  data() {
    return {
      valid: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      loading: false,
      rules: {
        usernameRules: [
          (v) => v.length >= 3 || 'Username must be at least 3 characters',
          (v) => v.length <= 20 || 'Maximum username length is 20 characters',
          (v) =>
            (v.match(/^[a-z0-9]+$/i) && v.match(/^[a-z0-9]+$/i).length > 0) ||
            'Username must be alphanumeric'
        ],
        emailRules: [(v) => EmailValidator.validate(v) || 'Invalid email'],
        passwordRules: [
          (v) => v.length >= 6 || 'Password must be at least 6 characters'
        ],
        confirmPasswordRules: [
          (v) => v === this.password || 'Passwords do not match'
        ]
      }
    }
  },
  computed: {
    formValid() {
      return (
        this.valid && this.username && this.password && this.confirmPassword
      )
    }
  },
  methods: {
    async signUp() {
      if (!this.formValid) return
      this.loading = true
      try {
        const res = await this.$apollo
          .mutate({
            mutation: signUpGql,
            variables: {
              username: this.username,
              password: this.password,
              email: this.email
            }
          })
          .then(({ data }) => data && data.signUp)
        await this.$apolloHelpers.onLogin(res.accessToken)
        await this.$store.dispatch('fetchCurrentUser')
        this.$emit('submitted')
      } catch (e) {
        this.err = e.message
        this.$store.dispatch('displaySnackbar', {
          message: this.err.split('GraphQL error: ')[1]
        })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped></style>
