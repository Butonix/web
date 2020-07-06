<template>
  <v-app>
    <!--<NavDrawer v-model="drawer" />-->

    <v-app-bar
      app
      bottom
      :hide-on-scroll="!$device.isIos"
      class="bottomappbar"
      height="56"
    >
      <v-bottom-navigation grow color="primary">
        <v-btn
          :to="{ path: '/', query: $store.state.homeQuery }"
          nuxt
          class="font-weight-regular"
          style="letter-spacing: normal"
        >
          <span>Home</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn
          class="font-weight-regular"
          style="letter-spacing: normal"
          @click="openNotifications"
        >
          <span>Notifications</span>
          <v-badge
            v-if="notifications.length > 0"
            overlap
            :content="notifications.length"
          >
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-bell-outline</v-icon>
        </v-btn>

        <v-btn
          to="/search"
          nuxt
          class="font-weight-regular"
          style="letter-spacing: normal"
        >
          <span>Search</span>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn
          to="/topics"
          nuxt
          class="font-weight-regular"
          style="letter-spacing: normal"
        >
          <span>Topics</span>
          <v-icon>mdi-newspaper</v-icon>
        </v-btn>

        <v-btn
          class="font-weight-regular"
          style="letter-spacing: normal"
          @click="openCompose"
        >
          <span>Submit</span>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app-bar>

    <v-app-bar
      v-if="$device.isDesktop"
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
          v-if="$store.state.currentPostTitle && $route.name.startsWith('post')"
          class="ml-4"
          style="line-height: normal"
        >
          <div class="title">{{ $store.state.currentPostTitle }}</div>
          <div>
            {{ $store.state.currentPostComments }} Comment{{
              $store.state.currentPostComments === 1 ? '' : 's'
            }}
          </div>
        </div>

        <div v-if="$route.name.startsWith('post')" class="ml-4">
          <CommentSortMenu />
        </div>

        <div
          v-if="$route.path === '/' || $route.name.startsWith('topic-')"
          class="ml-4"
        >
          <TypeMenu />
        </div>

        <div
          v-if="$route.path === '/' || $route.name.startsWith('topic-')"
          class="ml-2"
        >
          <SortMenu />
        </div>

        <v-spacer />

        <ProfileMenu />
      </v-row>
    </v-app-bar>

    <v-app-bar
      v-else
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

        <v-spacer />

        <div v-if="$route.name.startsWith('post')">
          <CommentSortMenu />
        </div>

        <div
          v-if="$route.path === '/' || $route.name.startsWith('topic-')"
          class="ml-4"
        >
          <TypeMenu />
        </div>

        <div
          v-if="$route.path === '/' || $route.name.startsWith('topic-')"
          class="ml-2"
        >
          <SortMenu />
        </div>

        <ProfileMenu />
      </v-row>
    </v-app-bar>

    <v-main>
      <!--<v-fade-transition>
        <nuxt />
      </v-fade-transition>-->
      <nuxt />
      <Snackbar />
    </v-main>
    <!--<v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import currentUserGql from '../gql/currentUser.graphql'
import Snackbar from '../components/Snackbar'
import notificationsGql from '../gql/notifications.graphql'
import TypeMenu from '../components/buttons/TypeMenu'
import SortMenu from '../components/buttons/SortMenu'
import ProfileMenu from '../components/buttons/ProfileMenu'
import CommentSortMenu from '../components/buttons/CommentSortMenu'

export default {
  name: 'Default',
  components: { CommentSortMenu, ProfileMenu, SortMenu, TypeMenu, Snackbar },
  data() {
    return {
      currentUser: null,
      drawer: false,
      searchText: '',
      cometLogo: require('~/assets/comet_logo2.png'),
      notifications: []
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
    },
    openNotifications() {
      if (this.currentUser) {
        this.$router.push('/notifications')
      } else {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to view notifications'
        })
      }
    },
    openCompose() {
      if (this.currentUser) {
        this.$router.push('/new')
      } else {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to submit a post'
        })
      }
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
