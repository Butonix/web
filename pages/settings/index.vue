<template>
  <v-container fluid>
    <v-row v-if="currentUser">
      <v-col :cols="$device.isDesktop ? 6 : 12">
        <v-form ref="form" v-model="valid" @submit.prevent="changePassword">
          <div class="title mb-2">Change password</div>
          <v-text-field
            v-model="currentPassword"
            :rules="rules.oldPasswordRules"
            label="Current Password"
            filled
            :type="showPasswordOld ? 'text' : 'password'"
          >
            <template v-slot:append>
              <div
                style="cursor: pointer"
                tabindex="-1"
                @click="showPasswordOld = !showPasswordOld"
              >
                <v-icon>{{
                  showPasswordOld
                    ? $vuetify.icons.values.mdiEye
                    : $vuetify.icons.values.mdiEyeOff
                }}</v-icon>
              </div>
            </template>
          </v-text-field>
          <v-text-field
            v-model="newPassword"
            :rules="rules.newPasswordRules"
            label="New Password"
            filled
            :type="showPassword ? 'text' : 'password'"
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
            v-model="newPasswordConfirm"
            :rules="rules.newPasswordConfirmRules"
            label="Confirm New Password"
            filled
            :type="showPassword ? 'text' : 'password'"
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
          <v-row class="mx-0" align="center">
            <v-spacer />
            <div v-if="errMessage" class="mr-2 error--text">
              {{ errMessage }}
            </div>
            <div v-if="successMessage" class="mr-2 success--text">
              {{ successMessage }}
            </div>
            <v-btn
              aria-label="Change Password"
              :loading="loading"
              color="primary"
              :disabled="!valid"
              type="submit"
              >Change Password</v-btn
            >
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <div class="headline">Must be logged in to access this page</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import currentUserGql from '../../gql/currentUser.graphql'
import changePasswordGql from '../../gql/changePassword.graphql'

export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      errMessage: '',
      successMessage: '',
      currentUser: null,
      loading: false,
      valid: false,
      showPassword: false,
      showPasswordOld: false,
      rules: {
        oldPasswordRules: [(v) => !!v || 'Current password is required'],
        newPasswordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 6 || 'Password must be at least 6 characters'
        ],
        newPasswordConfirmRules: [
          (v) => !!v || 'Password confirmation is required',
          (v) => v === this.newPassword || 'Passwords do not match'
        ]
      }
    }
  },
  methods: {
    async changePassword() {
      this.loading = true
      try {
        const { data } = await this.$apollo.mutate({
          mutation: changePasswordGql,
          variables: {
            oldPassword: this.currentPassword,
            newPassword: this.newPassword
          }
        })
        this.successMessage = 'Password changed successfully!'
        this.errMessage = ''
        this.currentPassword = ''
        this.newPassword = ''
        this.newPasswordConfirm = ''
        await this.$apolloHelpers.onLogin(data.changePassword.accessToken)
      } catch (e) {
        this.errMessage = e.message.split('GraphQL error: ')[1]
        this.successMessage = ''
        this.currentPassword = ''
      }
      this.loading = false
      this.$refs.form.resetValidation()
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  }
}
</script>

<style scoped></style>
