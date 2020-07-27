<template>
  <v-app-bar
    clipped-left
    app
    flat
    :dense="$device.isDesktop"
    :color="$vuetify.theme.dark ? '#202124' : '#F1F3F4'"
    :style="
      $vuetify.theme.dark
        ? 'border-bottom: 1px solid rgba(255, 255, 255, .12); background-color: #202124'
        : 'border-bottom: 1px solid rgba(0, 0, 0, .12); background-color: #F1F3F4'
    "
  >
    <v-row class="ma-0" align="center" no-gutters>
      <CometLogo v-if="$device.isDesktop" />

      <div
        v-if="!$device.isDesktop"
        style="position: fixed; top: 14px; left: 50%; transform: translateX(-50%); font-size: 21px; font-weight: 500"
      >
        <span v-if="$route.name === 'index'"
          >My Planets<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiEarth
          }}</v-icon></span
        >
        <span v-else-if="$route.name === 'universe'"
          >Universe<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiInfinity
          }}</v-icon></span
        >
        <span v-else-if="$route.name === 'signup'"
          >Sign Up<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiClipboardAccount
          }}</v-icon></span
        >
        <span v-else-if="$route.name === 'login'"
          >Log In<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiLogin
          }}</v-icon></span
        >
        <span v-else-if="$route.name === 'u-username'">
          {{ $route.params.username }}</span
        >
        <span v-else-if="$route.name === 'search'">Search</span>
      </div>

      <v-spacer />

      <template v-if="$device.isDesktop">
        <v-text-field
          v-model="searchText"
          hide-details
          flat
          class="mr-6"
          style="max-width: 25%; height: 34px"
          :background-color="$vuetify.theme.dark ? '' : '#DEE1E6'"
          solo
          label="Search"
          @keydown.enter="doSearch"
        >
          <template v-slot:append>
            <v-icon size="20" class="text--secondary">{{
              $vuetify.icons.values.mdiMagnify
            }}</v-icon>
          </template>
        </v-text-field>

        <div class="mr-4">
          <NewPostButton />
        </div>

        <div class="mr-1">
          <NotificationsMenu />
        </div>
      </template>

      <ProfileMenu v-if="$device.isDesktop" />

      <v-btn
        v-else
        icon
        nuxt
        :to="
          $store.state.currentUser
            ? `/u/${$store.state.currentUser.username}`
            : '/signup'
        "
      >
        <v-img
          v-if="
            $store.state.currentUser && $store.state.currentUser.profilePicUrl
          "
          contain
          width="32"
          height="32"
          :src="$store.state.currentUser.profilePicUrl"
        />
        <v-icon v-else>{{ $vuetify.icons.values.mdiAccountOutline }}</v-icon>
      </v-btn>

      <template v-if="$device.isDesktop">
        <client-only>
          <v-menu offset-y transition="slide-y-transition">
            <template v-slot:activator="{ on }">
              <v-btn
                class="ml-1"
                icon
                :color="$vuetify.theme.dark ? '' : '#7289da'"
                aria-label="Discord"
                v-on="on"
              >
                <v-icon>{{ $vuetify.icons.values.mdiDiscord }}</v-icon>
              </v-btn>
            </template>

            <iframe
              title="Discord widget"
              :src="
                `https://discordapp.com/widget?id=653652395959648314${
                  $vuetify.theme.dark ? '&theme=dark' : '&theme=light'
                }`
              "
              class="frame"
              height="500"
              allowtransparency="true"
              frameborder="0"
            />
          </v-menu>
        </client-only>
      </template>
    </v-row>
  </v-app-bar>
</template>

<script>
import ProfileMenu from '../buttons/profile/ProfileMenu'
import NewPostButton from '../buttons/new_post/NewPostButton'
import CometLogo from '../buttons/CometLogo'
import { capitalizedName } from '~/util/capitalizedName'
import NotificationsMenu from '@/components/notifications/NotificationsMenu'

export default {
  name: 'AppBar',
  components: {
    NotificationsMenu,
    CometLogo,
    NewPostButton,
    ProfileMenu
  },
  data() {
    return {
      notifications: [],
      searchText:
        this.$route.name === 'search' &&
        this.$route.query &&
        this.$route.query.q
          ? this.$route.query.q
          : ''
    }
  },
  computed: {
    capitalizedName() {
      if (this.$route.name !== 'p-name') return ''
      return capitalizedName(this.$route.params.name)
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    doSearch() {
      const query = {}
      if (this.searchText) query.q = this.searchText
      this.$router.push({ path: '/search', query })
    }
  }
}
</script>

<style scoped>
>>> .v-input__control {
  min-height: 34px !important;
  height: 34px !important;
}

>>> .v-label {
  font-size: 1rem;
}
</style>
