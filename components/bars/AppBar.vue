<template>
  <v-app-bar
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
        <CometLogo v-if="$device.isDesktop || $route.name !== 't-name'" />

        <span
          v-if="$route.name === 't-name'"
          :class="$device.isDesktop ? 'ml-4' : ''"
          style="font-size: 1.286rem; cursor: pointer"
          class="unselectable"
          @click="scrollToTop"
          >{{ capitalizedName }}</span
        >

        <v-spacer />

        <template v-if="$device.isDesktop">
          <v-text-field
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
          />

          <div class="mr-4">
            <NewPostButton />
          </div>

          <v-menu
            v-if="$store.state.currentUser"
            offset-y
            transition="slide-y-transition"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon class="ml-4 mr-1" v-on="on">
                <v-badge v-if="notifications.length > 0" overlap content="1">
                  <v-icon>{{ $vuetify.icons.values.mdiBellOutline }}</v-icon>
                </v-badge>
                <v-icon v-else>{{
                  $vuetify.icons.values.mdiBellOutline
                }}</v-icon>
              </v-btn>
            </template>

            <v-card class="pa-2" width="300">
              <v-card outlined class="mb-2">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle
                      >This is a notification</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions>
                  <UsernameMenu :user-data="$store.state.currentUser" />
                </v-card-actions>
              </v-card>

              <div
                style="display: flex; justify-content: center"
                class="caption text--secondary"
              >
                That's all!
              </div>
            </v-card>
          </v-menu>
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
import notificationsGql from '../../gql/notifications.graphql'
import ProfileMenu from '../buttons/profile/ProfileMenu'
import UsernameMenu from '../user/UsernameMenu'
import NewPostButton from '../buttons/new_post/NewPostButton'
import CometLogo from '../buttons/CometLogo'
import { capitalizedName } from '~/util/capitalizedName'

export default {
  name: 'AppBar',
  components: {
    CometLogo,
    NewPostButton,
    UsernameMenu,
    ProfileMenu
  },
  data() {
    return {
      notifications: []
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
    }
  },
  apollo: {
    notifications: {
      query: notificationsGql,
      variables() {
        return {
          unreadOnly: true
        }
      }
    }
  }
}
</script>

<style scoped>
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
</style>
