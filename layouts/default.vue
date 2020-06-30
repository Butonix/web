<template>
  <v-app>
    <!--<NavDrawer v-model="drawer" />-->

    <v-app-bar app bottom hide-on-scroll class="bottomappbar" height="56">
      <v-bottom-navigation grow color="primary">
        <v-btn to="/" class="font-weight-regular">
          <span>Home</span>
          <v-icon>{{ icons.home }}</v-icon>
        </v-btn>

        <v-btn to="/interactions" class="font-weight-regular">
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

        <v-btn to="/search" class="font-weight-regular">
          <span>Search</span>
          <v-icon>{{ icons.search }}</v-icon>
        </v-btn>

        <v-btn to="/topics" class="font-weight-regular">
          <span>Topics</span>
          <v-icon>{{ icons.topics }}</v-icon>
        </v-btn>

        <v-btn to="/new" class="font-weight-regular">
          <span>Submit</span>
          <v-icon>{{ icons.newPost }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app-bar>

    <v-app-bar
      app
      flat
      :color="$vuetify.theme.dark ? '#202124' : '#FFFFFF'"
      :style="
        $vuetify.theme.dark
          ? 'border-bottom: 1px solid rgba(255, 255, 255, .12)'
          : 'border-bottom: 1px solid rgba(0, 0, 0, .12)'
      "
    >
      <v-row class="ma-0" align="center">
        <nuxt-link :to="{ path: '/', query: $store.state.homeQuery }">
          <v-img :src="cometLogo" width="96" contain />
        </nuxt-link>

        <div
          v-if="
            $device.isDesktop &&
              $store.state.currentPostTitle &&
              $route.name === 'Post'
          "
          class="ml-4"
          style="line-height: normal"
        >
          <div class="title">{{ $store.state.currentPostTitle }}</div>
          <div>22 Comments</div>
        </div>

        <div v-if="$device.isDesktop && $route.name === 'Post'" class="ml-4">
          <CommentSortMenu />
        </div>

        <div
          v-if="
            $device.isDesktop &&
              ($route.name === 'Home' || $route.name === 'Topic')
          "
          class="ml-4"
        >
          <TypeMenu />
          <SortMenu />
        </div>

        <v-spacer />

        <TypeMenu
          v-if="
            !$device.isDesktop &&
              ($route.name === 'Home' || $route.name === 'Topic')
          "
        />
        <SortMenu
          v-if="
            !$device.isDesktop &&
              ($route.name === 'Home' || $route.name === 'Topic')
          "
        />

        <ProfileMenu />
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
  mdiLogin,
  mdiNewspaper,
  mdiInfinity
} from '@mdi/js'
import currentUserGql from '../gql/currentUser.graphql'
import Snackbar from '../components/Snackbar'
import notificationsGql from '../gql/notifications.graphql'
import TypeMenu from '../components/TypeMenu'
import SortMenu from '../components/SortMenu'
import ProfileMenu from '../components/ProfileMenu'
import CommentSortMenu from '../components/CommentSortMenu'

export default {
  name: 'Default',
  components: { CommentSortMenu, ProfileMenu, SortMenu, TypeMenu, Snackbar },
  data() {
    return {
      currentUser: null,
      drawer: false,
      searchText: '',
      cometLogo: require('~/assets/comet_logo2.png'),
      notifications: [],
      icons: {
        plus: mdiPlus,
        magnify: mdiMagnify,
        menu: mdiMenu,
        home: mdiHome,
        profile: mdiAccountOutline,
        interactions: mdiEmail,
        search: mdiMagnify,
        topics: mdiNewspaper,
        newPost: mdiPencil,
        hot: mdiFire,
        all: mdiInfinity,
        myFeed: mdiNewspaper,
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
