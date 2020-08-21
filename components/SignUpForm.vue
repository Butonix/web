<template>
  <v-form ref="form" v-model="valid" @submit.prevent="signUp">
    <v-text-field
      v-model="username"
      :rules="username.length > 0 ? rules.usernameRules : []"
      solo
      flat
      dense
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      class="darktextfield"
      label="Username"
    />

    <!--EMAIL - Disabled for now-->
    <!--<v-text-field
      v-model="email"
      :rules="email && email.length > 0 ? rules.emailRules : []"
      solo
      flat
      dense
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      class="darktextfield"
      label="Email (Optional)*"
    />-->

    <v-text-field
      v-model="password"
      :rules="password.length > 0 ? rules.passwordRules : []"
      solo
      flat
      dense
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      label="Password"
      class="darktextfield"
      :type="showPassword ? 'text' : 'password'"
    >
      <template v-slot:append>
        <div
          style="cursor: pointer;"
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
      :style="$device.isDesktop ? 'max-width: 35%' : ''"
      label="Confirm Password"
      class="darktextfield"
      :type="showPassword ? 'text' : 'password'"
    >
      <template v-slot:append>
        <div
          style="cursor: pointer;"
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

    <!--<div class="text&#45;&#45;secondary pb-1" style="font-size: 0.86rem">
      *Emails are only used for account recovery and are not shared with any
      third parties.
    </div>-->
    <div class="text--secondary pb-3" style="font-size: 0.86rem;">
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
      email: null,
      password: '',
      confirmPassword: '',
      showPassword: false,
      loading: false,
      rules: {
        usernameRules: [
          (v) => v.length >= 3 || 'Username must be at least 3 characters',
          (v) => v.length <= 15 || 'Maximum username length is 15 characters',
          (v) =>
            (v.match(/^[a-zA-Z0-9_]+$/) &&
              v.match(/^[a-zA-Z0-9_]+$/).length > 0) ||
            'Username can only have letters, numbers, and underscores.'
        ],
        emailRules: [
          (v) => (!!v && EmailValidator.validate(v)) || 'Invalid email'
        ],
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
