<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    width="220"
    :color="$vuetify.theme.dark ? '#1e1e1e' : 'white'"
    :mini-variant="collapsed"
    :value="value"
    @input="$emit('input', drawer)"
  >
    <v-list nav dense>
      <v-list-item link nuxt :to="{ path: '/', query: $store.state.homeQuery }">
        <v-list-item-icon>
          <v-icon>{{ icons.home }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Home</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        v-if="!currentUser"
        link
        @click="$store.dispatch('showLoginDialog')"
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

      <v-list-item v-else link nuxt :to="`/user/@${currentUser.username}`">
        <v-list-item-icon>
          <v-icon>{{ icons.account }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >My Profile (@{{ currentUser.username }})
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="currentUser" link nuxt to="/interactions">
        <v-list-item-icon>
          <v-badge
            v-if="notifications.length > 0"
            overlap
            :content="notifications.length"
          >
            <v-icon>{{ icons.bell }}</v-icon>
          </v-badge>
          <v-icon v-else>{{ icons.bell }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Interactions</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-else link @click="$store.dispatch('showLoginDialog')">
        <v-list-item-icon>
          <v-icon>{{ icons.bell }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Interactions</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="currentUser" link nuxt to="/filters">
        <v-list-item-icon>
          <v-icon>{{ icons.filter }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Filters</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-else link @click="$store.dispatch('showLoginDialog')">
        <v-list-item-icon>
          <v-icon>{{ icons.filter }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Filters</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!$device.isDesktop" link nuxt to="/topics">
        <v-list-item-icon>
          <v-icon>{{ icons.topics }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Topics</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider />
      <v-list nav dense>
        <v-list-item link @click="toggleDark">
          <v-list-item-icon>
            <v-icon>{{ icons.brightness }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular"
              >Dark Mode</v-list-item-title
            >
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-switch v-model="$vuetify.theme.dark" dense readonly />
          </v-list-item-action>
        </v-list-item>

        <v-list-item link @click="collapsed = !collapsed">
          <v-list-item-icon>
            <v-icon>{{ collapsed ? icons.right : icons.left }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular"
              >Collapse</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="currentUser" link nuxt to="/settings">
          <v-list-item-icon>
            <v-icon>{{ icons.settings }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular"
              >Account Settings</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="currentUser" link @click="logout">
          <v-list-item-icon>
            <v-icon>{{ icons.logout }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-regular"
              >Logout</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiAccount,
  mdiBrightness6,
  mdiBell,
  mdiBookmarkMultiple,
  mdiFilter,
  mdiLogout,
  mdiHome,
  mdiAccountCircle,
  mdiCog,
  mdiNewspaperVariant
} from '@mdi/js'
import currentUserGql from '../gql/currentUser.graphql'
import notificationsGql from '../gql/notifications.graphql'

export default {
  name: 'NavDrawer',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: this.value,
      currentUser: null,
      notifications: [],
      collapsed: process.client
        ? localStorage.getItem('collapsed') === 'true'
        : false,
      icons: {
        left: mdiChevronLeft,
        right: mdiChevronRight,
        account: mdiAccount,
        brightness: mdiBrightness6,
        bell: mdiBell,
        bookmarkMultiple: mdiBookmarkMultiple,
        filter: mdiFilter,
        logout: mdiLogout,
        home: mdiHome,
        accountCircle: mdiAccountCircle,
        settings: mdiCog,
        topics: mdiNewspaperVariant
      }
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    },
    notifications: {
      query: notificationsGql,
      variables() {
        return {
          unreadOnly: true
        }
      },
      skip() {
        return !this.currentUser
      }
    }
  },
  watch: {
    value() {
      this.drawer = this.value
    },
    collapsed() {
      if (process.client) {
        localStorage.setItem('collapsed', this.collapsed.toString())
      }
    }
  },
  methods: {
    async logout() {
      await this.$apollo.provider.defaultClient.cache.writeQuery({
        query: currentUserGql,
        data: { currentUser: null }
      })
      await this.$apolloHelpers.onLogout()
    },
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (process.client) {
        localStorage.setItem('dark', this.$vuetify.theme.dark.toString())
      }
    }
  }
}
</script>

<style scoped></style>
