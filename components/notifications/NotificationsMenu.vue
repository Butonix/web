<template>
  <v-menu
    v-if="$store.state.currentUser"
    offset-y
    transition="slide-y-transition"
    :close-on-content-click="false"
    max-height="80%"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-badge
          v-if="notifications.length > 0"
          overlap
          :content="notifications.length"
        >
          <v-icon>{{ $vuetify.icons.values.mdiBellOutline }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ $vuetify.icons.values.mdiBellOutline }}</v-icon>
      </v-btn>
    </template>

    <v-card width="600">
      <v-toolbar
        dense
        style="position: sticky; top: 0; z-index: 100; border-bottom-width: 1px; border-bottom-style: solid"
        :style="{
          'border-bottom-color': $vuetify.theme.dark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.12)'
        }"
        flat
        :color="$vuetify.theme.dark ? '#313235' : '#F5F5F5'"
      >
        <v-toolbar-title
          >{{ notifications.length }} Unread Notifications</v-toolbar-title
        >
        <v-spacer />
        <v-toolbar-items>
          <v-btn text>Dismiss all</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <div class="pb-0 pt-3 px-3">
        <Notification
          v-for="notif in notifications"
          :key="notif.id"
          :notif="notif"
        />
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import notificationsGql from '@/gql/notifications'
import Notification from '@/components/notifications/Notification'

export default {
  name: 'NotificationsMenu',
  components: { Notification },
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
      }
    }
  }
}
</script>

<style scoped></style>
