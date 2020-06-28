<template>
  <DesktopPost
    v-if="$device.isDesktop"
    :post="post"
    :expand="expand"
    :sticky="sticky"
    :is-post-view="isPostView"
    :class="isPostView ? '' : 'mb-1'"
  />
  <MobilePost
    v-else
    :post="post"
    :expand="expand"
    :sticky="sticky"
    :is-post-view="isPostView"
    :class="isPostView ? '' : 'mb-3'"
  />
</template>

<script>
import DesktopPost from './DesktopPost'
import MobilePost from './MobilePost'
export default {
  name: 'Post',
  components: { MobilePost, DesktopPost },
  props: {
    post: {
      type: Object,
      required: true
    },
    expand: {
      type: Boolean,
      default: false
    },
    sticky: {
      type: Boolean,
      default: false
    },
    isPostView: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
