<template>
  <v-app-bar
    app
    bottom
    class="bottomappbar"
    :height="$device.isIos && isPWA ? 80 : 56"
    :color="$vuetify.theme.dark ? '#35363A' : '#F1F3F4'"
  >
    <v-bottom-navigation
      grow
      :style="$device.isIos && isPWA ? 'margin-bottom: 24px' : ''"
      class="elevation-0"
    >
      <v-btn
        aria-label="Home"
        class="navbtn"
        @click.stop.prevent="clickHomeButton"
      >
        <span class="primary--text">Posts</span>
        <v-icon color="primary">{{ $vuetify.icons.values.mdiHome }}</v-icon>
      </v-btn>

      <v-btn aria-label="Search" class="navbtn" @click="showSearchPrompt">
        <span class="text--secondary">Search</span>
        <v-icon class="text--secondary">{{
          $vuetify.icons.values.mdiMagnify
        }}</v-icon>
      </v-btn>

      <v-btn class="navbtn">
        <v-img contain width="44" src="/logo_mobile.png" />
      </v-btn>

      <v-bottom-sheet v-model="planetsBottomSheet" scrollable>
        <template v-slot:activator="{ on }">
          <v-btn aria-label="Planets" class="navbtn" v-on="on">
            <span class="text--secondary">Planets</span>
            <v-icon class="text--secondary">{{
              $vuetify.icons.values.mdiEarth
            }}</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-text class="px-0 pt-2" style="padding-bottom: 24px">
            <NavDrawerContents @selected="planetsBottomSheet = false" />
          </v-card-text>
        </v-card>
      </v-bottom-sheet>

      <v-btn aria-label="Messages" to="/messages" nuxt class="navbtn">
        <span
          :class="
            $route.name === 'messages' ? 'primary--text' : 'text--secondary'
          "
          >Messages</span
        >
        <v-badge v-if="notifications.length > 0" overlap content="1">
          <v-icon :color="$route.name === 'messages' ? 'primary' : ''">{{
            $vuetify.icons.values.mdiEmailOutline
          }}</v-icon>
        </v-badge>
        <v-icon
          v-else
          :color="$route.name === 'notifications' ? 'primary' : ''"
          >{{ $vuetify.icons.values.mdiEmailOutline }}</v-icon
        >
      </v-btn>
    </v-bottom-navigation>
  </v-app-bar>
</template>

<script>
import notificationsGql from '../../gql/notifications.graphql'
import NavDrawerContents from '@/components/bars/NavDrawerContents'

export default {
  name: 'BottomNavBar',
  components: { NavDrawerContents },
  data() {
    return {
      notifications: [],
      newPostBottomSheet: false,
      planetsBottomSheet: false,
      isPWA: false
    }
  },
  beforeMount() {
    this.isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')
  },
  apollo: {
    notifications: {
      query: notificationsGql,
      variables() {
        return {
          unreadOnly: true
        }
      },
      skip() {
        return !this.$store.state.currentUser
      }
    }
  },
  methods: {
    showSearchPrompt() {
      const search = window.prompt('Search')
      if (!search) return
      this.$router.push(`/search?q=${encodeURIComponent(search)}`)
    },
    clickHomeButton() {
      if (this.$route.name === 'sort-time') {
        window.scrollTo(0, 0)
      } else {
        this.$router.push({ path: '/' })
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

.v-app-bar >>> .v-app-bar--fixed {
  top: initial !important;
  bottom: 0 !important;
}

.v-app-bar.v-app-bar--fixed {
  top: initial !important;
  bottom: 0 !important;
}

.v-app-bar--fixed {
  top: initial !important;
  bottom: 0 !important;
}

.v-app-bar {
  top: initial !important;
  bottom: 0 !important;
}

.navbtn {
  font-weight: 400;
  min-width: 0 !important;
  letter-spacing: normal;
}
</style>
