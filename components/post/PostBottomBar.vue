<template>
  <v-row
    align="center"
    no-gutters
    :class="$device.isDesktop ? 'mt-1' : 'px-2 pb-2 pt-0'"
  >
    <span v-if="!post.author" class="text--secondary">[deleted]</span>
    <UsernameMenu v-else :user-data="post.author" :op="isPostView" />

    <span
      :title="editedTimeSince"
      class="text--secondary caption"
      style="margin-left: 6px"
      >{{ timeSince }}</span
    >

    <PostPlanet v-if="$device.isDesktop" class="ml-2" :post="post" />

    <v-spacer />

    <PostActions :post="post" />

    <PostOptions :post="post" />
  </v-row>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import PostOptions from '@/components/post/PostOptions'
import PostActions from '@/components/post/PostActions'
import UsernameMenu from '@/components/user/UsernameMenu'
import { timeSince } from '@/util/timeSince'
import PostPlanet from '@/components/post/PostPlanet'
export default {
  name: 'PostBottomBar',
  components: { PostPlanet, UsernameMenu, PostActions, PostOptions },
  props: {
    post: {
      type: Object,
      required: true
    },
    isPostView: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    timeSince() {
      return (
        (this.$device.isDesktop
          ? formatDistanceToNowStrict(new Date(this.post.createdAt)) + ' ago'
          : timeSince(new Date(this.post.createdAt))) +
        (this.post.editedAt ? '*' : '')
      )
    },
    editedTimeSince() {
      if (!this.post.editedAt) return ''
      return (
        'Edited ' +
        formatDistanceToNowStrict(new Date(this.post.editedAt)) +
        ' ago'
      )
    }
  }
}
</script>

<style scoped></style>
