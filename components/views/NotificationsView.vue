<template>
  <v-container fluid>
    <v-row v-if="currentUser">
      <v-col>
        <div class="headline">
          Interactions
        </div>
        <v-row class="mx-0 my-2">
          <v-btn
            :ripple="false"
            text
            small
            class="mr-1"
            :class="unreadOnly ? '' : 'text--secondary'"
            :outlined="unreadOnly"
            @click="unreadOnly = true"
            >Unread Only
            {{ unreadOnly ? `(${notifications.length})` : '' }}</v-btn
          >
          <v-btn
            :ripple="false"
            text
            small
            class="mr-1"
            :class="!unreadOnly ? '' : 'text--secondary'"
            :outlined="!unreadOnly"
            @click="unreadOnly = false"
            >All {{ !unreadOnly ? `(${notifications.length})` : '' }}</v-btn
          >

          <v-divider vertical />

          <v-btn text small @click="markAllAsRead">Mark all as read</v-btn>
        </v-row>
        <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          :unread-only="unreadOnly"
          class="mb-1"
        />
        <div v-if="notifications.length === 0" class="title">
          No {{ unreadOnly ? 'new ' : '' }}interactions
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <div class="headline">Must be logged in to access this page.</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import currentUserGql from '../../gql/currentUser.graphql'
import notificationsGql from '../../gql/notifications.graphql'
import Notification from '../Notification'
import markAllNotificationsReadGql from '../../gql/markAllNotificationsRead.graphql'

export default {
  name: 'NotificationsView',
  components: { Notification },
  data() {
    return {
      currentUser: null,
      notifications: [],
      unreadOnly: true
    }
  },
  methods: {
    async markAllAsRead() {
      await this.$apollo.mutate({
        mutation: markAllNotificationsReadGql,
        refetchQueries: [
          {
            query: notificationsGql,
            variables: { unreadOnly: this.unreadOnly }
          }
        ],
        awaitRefetchQueries: true
      })
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    },
    notifications: {
      query: notificationsGql,
      variables() {
        return {
          unreadOnly: this.unreadOnly
        }
      },
      skip() {
        return !this.currentUser
      },
      fetchPolicy: 'cache-and-network'
    }
  }
}
</script>

<style scoped></style>
