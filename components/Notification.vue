<template>
  <v-card
    outlined
    class="mb-1 py-1 px-4"
    :style="
      !read
        ? $vuetify.theme.dark
          ? 'border-color: #FFFFFF'
          : 'border-color: #000000'
        : ''
    "
  >
    <nuxt-link
      :to="`/post/${notification.post.id}/${urlName}`"
      class="caption font-weight-medium text--secondary"
      ><span v-if="notification.parentCommentId" class="font-weight-regular"
        >Reply to your comment on:
      </span>
      <span v-else class="font-weight-regular">Reply to your post: </span
      >{{ notification.post.title }}</nuxt-link
    >

    <TextContent
      :text-content="notification.comment.textContent"
      class="body-2 comment"
    />
    <div class="text--secondary">
      <Username :user-data="notification.fromUser" />
      <span class="caption font-weight-medium ml-3">{{ timeSince }} ago</span>
      <span
        v-if="!read"
        class="caption font-weight-medium ml-3 hoverable"
        @click="markAsRead"
        >Mark as read</span
      >
      <span v-else class="caption font-weight-medium ml-3">Read</span>
    </div>
  </v-card>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import markNotificationReadGql from '../gql/markNotificationRead.graphql'
import notificationsGql from '../gql/notifications.graphql'
import TextContent from './TextContent'
import Username from './Username'

export default {
  name: 'Notification',
  components: { Username, TextContent },
  props: {
    notification: {
      type: Object,
      required: true
    },
    unreadOnly: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      read: this.notification.read
    }
  },
  computed: {
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.notification.createdAt))
    },
    urlName() {
      return this.notification.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    }
  },
  methods: {
    async markAsRead() {
      await this.$apollo.mutate({
        mutation: markNotificationReadGql,
        variables: {
          id: this.notification.id
        },
        refetchQueries: [
          {
            query: notificationsGql,
            variables: { unreadOnly: this.unreadOnly }
          }
        ]
      })
      this.read = true
    }
  }
}
</script>

<style scoped></style>
