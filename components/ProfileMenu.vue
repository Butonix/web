<template>
  <v-bottom-sheet v-model="menu" inset :width="$device.isDesktop ? '20%' : ''">
    <template v-slot:activator="{ on }">
      <v-btn v-if="!$device.isDesktop" icon v-on="on">
        <v-icon>{{ icons.profile }}</v-icon>
      </v-btn>

      <v-btn v-else text rounded class="betterbutton" v-on="on">
        <v-icon class="mr-2">{{ icons.profile }}</v-icon>
        {{ currentUser ? currentUser.username : 'Not logged in' }}
      </v-btn>
    </template>

    <v-list class="py-0">
      <v-list-item
        v-if="currentUser"
        :to="`/user/@${currentUser.username}`"
        @click="menu = false"
      >
        <v-list-item-avatar
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-2'"
        >
          <v-icon small>{{ icons.profile }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ currentUser.username }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!currentUser" to="/login" @click="menu = false">
        <v-list-item-icon>
          <v-icon>{{ icons.login }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Log in</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="currentUser" to="/settings" @click="menu = false">
        <v-list-item-icon>
          <v-icon>{{ icons.settings }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="toggleDark">
        <v-list-item-icon>
          <v-icon>{{ icons.dark }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dark mode</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch v-model="$vuetify.theme.dark" readonly />
        </v-list-item-action>
      </v-list-item>

      <v-list-item v-if="currentUser" @click="logout">
        <v-list-item-icon>
          <v-icon>{{ icons.logout }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
import {
  mdiAccountOutline,
  mdiCogOutline,
  mdiLogin,
  mdiLogout,
  mdiWeatherNight
} from '@mdi/js'
import currentUserGql from '../gql/currentUser.graphql'

export default {
  name: 'ProfileMenu',
  data() {
    return {
      menu: false,
      currentUser: null,
      icons: {
        profile: mdiAccountOutline,
        settings: mdiCogOutline,
        dark: mdiWeatherNight,
        logout: mdiLogout,
        login: mdiLogin
      }
    }
  },
  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (process.client) {
        localStorage.setItem('dark', this.$vuetify.theme.dark.toString())
      }
    },
    async logout() {
      this.$store.dispatch('displaySnackbar', 'Logged out')
      this.menu = false
      await this.$apollo.provider.defaultClient.cache.writeQuery({
        query: currentUserGql,
        data: { currentUser: null }
      })
      await this.$apolloHelpers.onLogout()
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
