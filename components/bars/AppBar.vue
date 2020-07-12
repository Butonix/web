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
    <v-container class="py-0" :class="$device.isDesktop ? '' : 'px-0'">
      <v-row class="ma-0" align="center" no-gutters>
        <CometLogo />

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

          <NewPostButton />

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

        <div>
          <ProfileMenu />
        </div>

        <template v-if="$device.isDesktop">
          <client-only>
            <v-menu offset-y transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <v-btn
                  class="ml-1"
                  icon
                  :color="$vuetify.theme.dark ? '' : '#7289da'"
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
import NewPostButton from '../buttons/NewPostButton'
import CometLogo from '../buttons/CometLogo'

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
  methods: {
    clickCometLogo() {
      if (this.$route.path === '/') {
        window.scrollTo(0, 0)
      } else {
        this.$router.push({ path: '/', query: this.$store.state.homeQuery })
      }
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

<style scoped></style>
