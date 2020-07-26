<template>
  <v-app-bar
    clipped-left
    dense
    app
    flat
    :color="$vuetify.theme.dark ? '#202124' : '#F1F3F4'"
    :style="
      $vuetify.theme.dark
        ? 'border-bottom: 1px solid rgba(255, 255, 255, .12)'
        : 'border-bottom: 1px solid rgba(0, 0, 0, .12)'
    "
  >
    <v-row class="ma-0" align="center" no-gutters>
      <CometLogo />

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
