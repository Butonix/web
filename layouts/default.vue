<template>
  <v-app>
    <!--<NavDrawer v-model="drawer" />-->

    <v-app-bar app bottom hide-on-scroll class="bottomappbar">
      <v-bottom-navigation
        grow
        :background-color="$vuetify.theme.dark ? 'grey darken-4' : ''"
        color="primary"
      >
        <v-btn to="/" class="font-weight-light">
          <span>Home</span>
          <v-icon>{{ icons.home }}</v-icon>
        </v-btn>

        <v-btn to="/interactions" class="font-weight-light">
          <span>Interactions</span>
          <v-badge
            v-if="notifications.length > 0"
            overlap
            :content="notifications.length"
          >
            <v-icon>{{ icons.interactions }}</v-icon>
          </v-badge>
          <v-icon v-else>{{ icons.interactions }}</v-icon>
        </v-btn>

        <v-btn to="/search" class="font-weight-light">
          <span>Search</span>
          <v-icon>{{ icons.search }}</v-icon>
        </v-btn>

        <v-btn to="/new" class="font-weight-light">
          <span>Submit</span>
          <v-icon>{{ icons.newPost }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app-bar>

    <v-app-bar
      app
      flat
      :color="$vuetify.theme.dark ? '#121212' : '#FFFFFF'"
      clipped-left
      hide-on-scroll
    >
      <!--<v-app-bar-nav-icon v-if="!$device.isDesktop" @click="drawer = !drawer">
        <v-icon color="white">{{ icons.menu }}</v-icon>
      </v-app-bar-nav-icon>-->

      <v-row class="ma-0" align="center">
        <nuxt-link :to="{ path: '/', query: $store.state.homeQuery }">
          <v-img :src="cometLogo" width="96" />
        </nuxt-link>
        <v-spacer />
        <v-btn
          class="betterbutton mr-2"
          outlined
          rounded
          :style="
            $vuetify.theme.dark
              ? 'border-color: rgba(255, 255, 255, 0.12);'
              : 'border-color: rgba(0, 0, 0, 0.12);'
          "
        >
          <v-icon class="mr-2">{{ icons.hot }}</v-icon>
          All
        </v-btn>

        <v-btn
          class="betterbutton mr-1"
          outlined
          rounded
          :style="
            $vuetify.theme.dark
              ? 'border-color: rgba(255, 255, 255, 0.12);'
              : 'border-color: rgba(0, 0, 0, 0.12);'
          "
        >
          <v-icon class="mr-2">{{ icons.hot }}</v-icon>
          Hot
        </v-btn>
        <v-menu left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>{{ icons.profile }}</v-icon>
            </v-btn>
          </template>

          <v-list class="py-0">
            <v-list-item
              v-if="currentUser"
              :to="`/user/@${currentUser.username}`"
            >
              <v-list-item-avatar color="grey darken-3">
                <v-icon small>{{ icons.profile }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{
                  currentUser.username
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="!currentUser" to="/login">
              <v-list-item-icon>
                <v-icon>{{ icons.login }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Log in</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="currentUser" to="/settings">
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
        </v-menu>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-fade-transition mode="out-in">
        <nuxt />
      </v-fade-transition>
      <Snackbar />
    </v-content>
    <!--<v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import {
  mdiPlus,
  mdiMagnify,
  mdiMenu,
  mdiHome,
  mdiAccountOutline,
  mdiEmail,
  mdiPencil,
  mdiFire,
  mdiCogOutline,
  mdiWeatherNight,
  mdiLogout,
  mdiLogin
} from '@mdi/js'
import currentUserGql from '../gql/currentUser.graphql'
import Snackbar from '../components/Snackbar'
import notificationsGql from '../gql/notifications.graphql'

export default {
  name: 'Default',
  components: { Snackbar },
  data() {
    return {
      currentUser: null,
      drawer: false,
      searchText: '',
      cometLogo: require('~/assets/comet_logo.png'),
      notifications: [],
      icons: {
        plus: mdiPlus,
        magnify: mdiMagnify,
        menu: mdiMenu,
        home: mdiHome,
        profile: mdiAccountOutline,
        interactions: mdiEmail,
        search: mdiMagnify,
        newPost: mdiPencil,
        hot: mdiFire,
        settings: mdiCogOutline,
        dark: mdiWeatherNight,
        logout: mdiLogout,
        login: mdiLogin
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
  mounted() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const dark = localStorage.getItem('dark')

    if (dark) {
      this.$vuetify.theme.dark = dark === 'true'
    } else if (mq.matches) {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }

    mq.addEventListener('change', (e) => {
      if (!localStorage.getItem('dark')) {
        this.$vuetify.theme.dark = e.matches
      }
    })

    this.drawer = this.$device.isDesktop
  },
  methods: {
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (process.client) {
        localStorage.setItem('dark', this.$vuetify.theme.dark.toString())
      }
    },
    async logout() {
      await this.$apollo.provider.defaultClient.cache.writeQuery({
        query: currentUserGql,
        data: { currentUser: null }
      })
      await this.$apolloHelpers.onLogout()
    }
  }
}
</script>

<style scoped>
.bottomappbar >>> .v-toolbar__content {
  padding: 0;
  margin: 0;
}
</style>
