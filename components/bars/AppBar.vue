<template>
  <v-app-bar
    clipped-left
    app
    flat
    class="topappbar"
    :dense="$device.isDesktop"
    :style="
      $vuetify.theme.dark
        ? 'border-bottom: 1px solid rgba(255, 255, 255, .12)'
        : 'border-bottom: 1px solid rgba(0, 0, 0, .12)'
    "
  >
    <v-row class="ma-0" align="center" no-gutters>
      <CometLogo v-if="$device.isDesktop" />

      <div
        v-ripple
        :style="
          $device.isDesktop
            ? 'margin-left: 32px; padding-left: 8px; padding-right: 8px; padding-top: 4px; padding-bottom: 4px; border-radius: 10px; font-size: 18px; font-weight: 500'
            : 'position: fixed; top: 14px; left: 50%; transform: translateX(-50%); font-size: 21px; font-weight: 500'
        "
        class="unselectable"
        style="cursor: pointer"
        @click="openPlanetPrompt"
      >
        <span v-if="$route.name === 'sort-time'"
          >My Planets<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiEarth
          }}</v-icon></span
        >

        <span v-else-if="$route.name === 'universe-sort-time'"
          >Universe<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiInfinity
          }}</v-icon></span
        >

        <span v-else-if="$route.name === 'u-username-sort-time'">
          {{ $route.params.username }}</span
        >

        <span v-else-if="$route.name === 'g-galaxyname-sort-time'">
          {{ $route.params.galaxyname }}</span
        >

        <span v-else-if="$route.name === 'p-planetname-sort-time'">
          {{ $route.params.planetname }}</span
        >

        <span v-else-if="$route.name === 'search-sort-time'"
          >"{{ $route.query.q }}"</span
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

        <span v-else-if="$route.name === 'planets-explore'"
          >Explore Planets<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiTelescope
          }}</v-icon></span
        >

        <span v-else-if="$route.name.startsWith('submit')"
          >Submit<v-icon class="ml-2">{{
            $vuetify.icons.values.mdiPencilOutline
          }}</v-icon></span
        >

        <v-icon v-if="$device.isDesktop">
          {{
            $store.state.nav
              ? $vuetify.icons.values.mdiChevronLeft
              : $vuetify.icons.values.mdiChevronRight
          }}
        </v-icon>
      </div>

      <v-spacer />

      <template v-if="$device.isDesktop">
        <v-text-field
          v-model="searchText"
          hide-details
          flat
          class="mr-6"
          style="max-width: 25%; height: 34px"
          solo
          label="Search"
          @keydown.enter="doSearch"
          @click:append="doSearch"
        >
          <template v-slot:append>
            <v-icon
              size="20"
              class="text--secondary"
              style="cursor: pointer"
              @click="doSearch"
              >{{ $vuetify.icons.values.mdiMagnify }}</v-icon
            >
          </template>
        </v-text-field>

        <div class="mr-4">
          <NewPostButton />
        </div>

        <div class="mr-1">
          <NotificationsMenu />
        </div>
      </template>

      <ProfileMenu />

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

        <FeedbackDialog />
      </template>
    </v-row>
  </v-app-bar>
</template>

<script>
import ProfileMenu from '../buttons/profile/ProfileMenu'
import NewPostButton from '../buttons/new_post/NewPostButton'
import CometLogo from '../buttons/CometLogo'
import NotificationsMenu from '@/components/notifications/NotificationsMenu'
import FeedbackDialog from '@/components/FeedbackDialog'

export default {
  name: 'AppBar',
  components: {
    FeedbackDialog,
    NotificationsMenu,
    CometLogo,
    NewPostButton,
    ProfileMenu
  },
  data() {
    return {
      notifications: [],
      searchText:
        this.$route.name.startsWith('search') && this.$route.query.q
          ? this.$route.query.q
          : ''
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    doSearch() {
      if (!this.searchText) return
      const query = {}
      if (this.searchText) query.q = this.searchText
      this.$router.push({ path: '/search', query })
    },
    openPlanetPrompt() {
      if (this.$device.isDesktop) {
        this.$store.commit('setNav', !this.$store.state.nav)
        return
      }
      const planet = window.prompt('Go to Planet')
      if (!planet) return
      this.$router.push(`/p/${planet}`)
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
