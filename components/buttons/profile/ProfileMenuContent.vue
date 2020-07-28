<template>
  <v-list class="py-0">
    <v-list-item
      v-if="$store.state.currentUser"
      :to="`/u/${$store.state.currentUser.username}`"
      nuxt
      @click="$emit('selected')"
    >
      <v-list-item-avatar>
        <v-icon v-if="!$store.state.currentUser.profilePicUrl">{{
          $vuetify.icons.values.mdiAccountOutline
        }}</v-icon>
        <v-img
          v-else
          alt="Profile picture"
          :src="$store.state.currentUser.profilePicUrl"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{
          $store.state.currentUser.username
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-if="!$store.state.currentUser"
      nuxt
      to="/signup"
      @click="$emit('selected')"
    >
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiClipboardAccount }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Sign Up</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-if="!$store.state.currentUser"
      nuxt
      to="/login"
      @click="$emit('selected')"
    >
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiLogin }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Log in</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-if="$store.state.currentUser"
      nuxt
      to="/settings"
      @click="$emit('selected')"
    >
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiCogOutline }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item @click="toggleDark">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiWeatherNight }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Dark mode</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-switch v-model="$vuetify.theme.dark" readonly />
      </v-list-item-action>
    </v-list-item>

    <v-list-item v-if="$store.state.currentUser" @click="logout">
      <v-list-item-icon>
        <v-icon>{{ $vuetify.icons.values.mdiLogout }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Log out</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import currentUserGql from '../../../gql/currentUser.graphql'

export default {
  name: 'ProfileMenuContent',
  methods: {
    toggleDark() {
      this.$emit('selected')
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (process.client) {
        localStorage.setItem('dark', this.$vuetify.theme.dark.toString())
      }
    },
    async logout() {
      this.$emit('selected')
      this.$store.dispatch('displaySnackbar', { message: 'Logged out' })
      await this.$apollo.provider.defaultClient.cache.writeQuery({
        query: currentUserGql,
        data: { currentUser: null }
      })
      await this.$apolloHelpers.onLogout()
      this.$store.commit('setCurrentUser', null)
    }
  }
}
</script>

<style scoped></style>
