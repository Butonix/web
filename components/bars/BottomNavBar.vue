<template>
  <v-app-bar
    :hide-on-scroll="!$device.isIos"
    app
    bottom
    class="bottomappbar"
    height="56"
  >
    <v-bottom-navigation grow color="#8D8D8D">
      <v-btn
        aria-label="Home"
        class="font-weight-regular"
        style="letter-spacing: normal"
        :to="{ path: '/', query: $store.state.homeQuery }"
        nuxt
        @click.stop.prevent="clickHomeButton"
      >
        <!--<span>Home</span>-->
        <v-icon :color="$route.name === 'index' ? 'primary' : ''">{{
          $vuetify.icons.values.mdiHome
        }}</v-icon>
      </v-btn>

      <v-btn
        aria-label="Search"
        to="/search"
        nuxt
        class="font-weight-regular"
        style="letter-spacing: normal"
      >
        <!--<span>Search</span>-->
        <v-icon :color="$route.name === 'search' ? 'primary' : ''">{{
          $vuetify.icons.values.mdiMagnify
        }}</v-icon>
      </v-btn>

      <v-bottom-sheet v-model="newPostBottomSheet">
        <template v-slot:activator="{ on }">
          <v-btn
            aria-label="New Post"
            class="font-weight-regular"
            style="letter-spacing: normal"
            v-on="on"
          >
            <!--<span>New Post</span>-->
            <v-icon :color="$route.name.startsWith('new') ? 'primary' : ''">{{
              $vuetify.icons.values.mdiPlusBox
            }}</v-icon>
          </v-btn>
        </template>

        <NewPostButtonContent @selected="newPostBottomSheet = false" />
      </v-bottom-sheet>

      <v-btn
        aria-label="Topics"
        to="/topics"
        nuxt
        class="font-weight-regular"
        style="letter-spacing: normal"
      >
        <!--<span>Topics</span>-->
        <v-icon :color="$route.name === 'topics' ? 'primary' : ''">{{
          $vuetify.icons.values.mdiNewspaper
        }}</v-icon>
      </v-btn>

      <v-btn
        aria-label="Notificatinos"
        to="/notifications"
        nuxt
        class="font-weight-regular"
        style="letter-spacing: normal"
      >
        <!--<span>Notifications</span>-->
        <v-badge v-if="notifications.length > 0" overlap content="1">
          <v-icon :color="$route.name === 'notifications' ? 'primary' : ''">{{
            $vuetify.icons.values.mdiBellOutline
          }}</v-icon>
        </v-badge>
        <v-icon
          v-else
          :color="$route.name === 'notifications' ? 'primary' : ''"
          >{{ $vuetify.icons.values.mdiBellOutline }}</v-icon
        >
      </v-btn>
    </v-bottom-navigation>
  </v-app-bar>
</template>

<script>
import notificationsGql from '../../gql/notifications.graphql'
import NewPostButtonContent from '../buttons/new_post/NewPostButtonContent'

export default {
  name: 'BottomNavBar',
  components: { NewPostButtonContent },
  data() {
    return {
      notifications: [],
      newPostBottomSheet: false
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
        return !this.$store.state.currentUser
      }
    }
  },
  methods: {
    openNotifications() {
      if (this.$store.state.currentUser) {
        this.$router.push('/notifications')
      } else {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to view notifications'
        })
      }
    },
    openCompose() {
      if (this.$store.state.currentUser) {
        this.$router.push('/new')
      } else {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to submit a post'
        })
      }
    },
    clickHomeButton() {
      if (this.$route.path === '/') {
        window.scrollTo(0, 0)
      } else {
        this.$router.push({ path: '/', query: this.$store.state.homeQuery })
      }
    }
  }
}
</script>

<style scoped></style>
