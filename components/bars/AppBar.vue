<template>
  <v-app-bar
    short
    app
    flat
    :color="$vuetify.theme.dark ? '#202124' : ''"
    :style="
      $vuetify.theme.dark
        ? 'border-bottom: 1px solid rgba(255, 255, 255, .12)'
        : 'border-bottom: 1px solid rgba(0, 0, 0, .12)'
    "
  >
    <v-container class="pa-0">
      <v-row class="ma-0" align="center" no-gutters>
        <CometLogo
          v-if="
            $device.isDesktop ||
              ($route.name !== 't-name' && $route.name !== 'u-username')
          "
        />

        <span
          v-if="$route.name === 't-name'"
          :class="$device.isDesktop ? 'ml-4' : ''"
          style="font-size: 1.286rem; cursor: pointer"
          class="unselectable"
          @click="scrollToTop"
          >{{ capitalizedName }}</span
        >

        <span
          v-else-if="$route.name === 'u-username' && !$device.isDesktop"
          style="font-size: 1.286rem; cursor: pointer"
          class="ml-4 unselectable"
          @click="scrollToTop"
        >
          {{ $route.params.username }}
        </span>

        <v-spacer />

        <template v-if="$device.isDesktop">
          <v-text-field
            v-model="searchText"
            hide-details
            flat
            dense
            class="mr-6"
            style="max-width: 25%"
            :background-color="$vuetify.theme.dark ? '' : 'grey lighten-2'"
            solo
            rounded
            label="Search"
            :append-icon="$vuetify.icons.values.mdiMagnify"
            @keydown.enter="doSearch"
          />

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
        </template>
      </v-row>
    </v-container>
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
      if (this.$route.name !== 't-name') return ''
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

<style scoped></style>
