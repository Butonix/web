<template>
  <div class="pb-3">
    <v-card outlined>
      <div class="px-2 pt-2">
        <span
          v-if="notif.parentCommentId"
          class="text--secondary"
          style="font-size: 1rem"
        >
          Reply to your comment on
        </span>
        <span v-else class="text--secondary" style="font-size: 1rem">
          Reply to your post
        </span>
        <nuxt-link
          class="text--secondary"
          :to="`/p/${notif.post.id}/${urlName}`"
          >&nbsp;"<span class="hoverable">{{ notif.post.title }}</span
          >"</nuxt-link
        >
        <div
          style="font-size: 1rem"
          class="text--primary py-2"
          v-html="notif.comment.textContent"
        />
      </div>
      <v-card-actions class="pt-0">
        <UsernameMenu :user-data="notif.fromUser" />
        <v-spacer />
        <v-btn text small class="text--secondary">Dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import UsernameMenu from '@/components/user/UsernameMenu'
import { urlName } from '@/util/urlName'

export default {
  name: 'Notification',
  components: { UsernameMenu },
  props: {
    notif: {
      type: Object,
      required: true
    }
  },
  computed: {
    urlName() {
      return urlName(this.notif.post.title)
    }
  },
  methods: {
    markRead() {}
  }
}
</script>

<style scoped></style>
