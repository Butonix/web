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
      <v-list-item link nuxt to="/">
        <v-list-item-icon>
          <v-icon>{{ icons.home }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Home</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <LoginDialog v-if="!currentUser" />

      <v-list-item v-else link nuxt :to="`/user/${currentUser.username}`">
        <v-list-item-icon>
          <v-icon>{{ icons.account }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >My Profile (@{{ currentUser.username }})
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-badge overlap :content="1">
            <v-icon>{{ icons.bell }}</v-icon>
          </v-badge>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Interactions</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>{{ icons.bookmarkMultiple }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Bookmarked</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item link nuxt to="/filters">
        <v-list-item-icon>
          <v-icon>{{ icons.filter }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="font-weight-regular"
            >Filters</v-list-item-title
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
  mdiHome
} from '@mdi/js'
import currentUserGql from '../gql/currentUser.graphql'
import LoginDialog from '../components/LoginDialog'

export default {
  name: 'NavDrawer',
  components: { LoginDialog },
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
        home: mdiHome
      }
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
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
      this.currentUser = null
      await this.$apolloHelpers.onLogout()
      await this.$apollo.query({ query: currentUserGql })
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
