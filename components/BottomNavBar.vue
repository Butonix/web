<template>
  <v-app-bar
    :hide-on-scroll="!$device.isIos"
    app
    bottom
    class="bottomappbar"
    height="56"
  >
    <v-bottom-navigation grow color="primary">
      <v-btn
        aria-label="Home"
        :to="{ path: '/', query: $store.state.homeQuery }"
        nuxt
        class="font-weight-regular"
        style="letter-spacing: normal"
      >
        <span>Home</span>
        <v-icon>{{ $vuetify.icons.values.mdiHome }}</v-icon>
      </v-btn>

      <v-btn
        aria-label="Notifications"
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
          <v-icon>{{ $vuetify.icons.values.mdiBellOutline }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ $vuetify.icons.values.mdiBellOutline }}</v-icon>
      </v-btn>

      <v-btn
        aria-label="Search"
        to="/search"
        nuxt
        class="font-weight-regular"
        style="letter-spacing: normal"
      >
        <span>Search</span>
        <v-icon>{{ $vuetify.icons.values.mdiMagnify }}</v-icon>
      </v-btn>

      <v-btn
        aria-label="Topics"
        to="/topics"
        nuxt
        class="font-weight-regular"
        style="letter-spacing: normal"
      >
        <span>Topics</span>
        <v-icon>{{ $vuetify.icons.values.mdiNewspaper }}</v-icon>
      </v-btn>

      <v-btn
        aria-label="Submit"
        class="font-weight-regular"
        style="letter-spacing: normal"
        @click="openCompose"
      >
        <span>Submit</span>
        <v-icon>{{ $vuetify.icons.values.mdiPencil }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app-bar>
</template>

<script>
import notificationsGql from '../gql/notifications.graphql'

export default {
  name: 'BottomNavBar',
  data() {
    return {
      notifications: []
    }
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
        return !this.currentUser
      }
    }
  },
  methods: {
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

<style scoped></style>
