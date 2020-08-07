<template>
  <v-container style="z-index: 3">
    <v-row justify="center">
      <v-col :cols="$device.isDesktop ? 3 : 12">
        <div class="text-h3 mt-12 mb-6">
          Welcome back.
        </div>
        <v-form @submit.prevent="login">
          <v-text-field v-model="username" solo flat dense label="Username" />
          <v-text-field
            v-model="password"
            solo
            flat
            dense
            :type="showPassword ? 'text' : 'password'"
            label="Password"
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
          <v-row no-gutters>
            <v-spacer />
            <v-btn
              depressed
              rounded
              text
              class="text--secondary mr-2"
              nuxt
              to="/signup"
              >Don't have an account?</v-btn
            >
            <v-btn
              depressed
              rounded
              color="primary"
              :disabled="!username || !password"
              :loading="loading"
              type="submit"
              >Log In</v-btn
            >
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import loginGql from '../../gql/login.graphql'

export default {
  data() {
    return {
      prevRoute: null,
      username: '',
      password: '',
      loading: false,
      showPassword: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  methods: {
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
        if (this.prevRoute && this.prevRoute.name === 'signup') {
          await this.$router.push('/')
        } else {
          this.$router.back()
        }
      } catch (e) {
        this.err = e.message
        this.$store.dispatch('displaySnackbar', {
          message: this.err.split('GraphQL error: ')[1]
        })
      }
      this.loading = false
    }
  },
  head: {
    title: 'Log In'
  }
}
</script>

<style scoped></style>
