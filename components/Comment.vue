<template>
  <MobileComment
    v-if="!$device.isDesktop"
    :comment="comment"
    :level="level"
    :profile="profile"
    :post="post"
    :sort="sort"
    :post-view="postView"
  />
  <DesktopComment
    v-else
    :comment="comment"
    :level="level"
    :profile="profile"
    :post="post"
    :sort="sort"
    :post-view="postView"
  />
</template>

<script>
import MobileComment from './MobileComment'
import DesktopComment from './DesktopComment'

export default {
  name: 'Comment',
  components: { DesktopComment, MobileComment },
  props: {
    comment: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    profile: {
      type: Boolean,
      default: false
    },
    post: {
      type: Object,
      required: false,
      default: null
    },
    sort: {
      type: Object,
      required: false,
      default: null
    },
    postView: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped></style>
