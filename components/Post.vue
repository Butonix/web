<template>
  <div class="pb-3">
    <DesktopPost
      v-if="$device.isDesktop"
      :post="source"
      :expand="expand"
      :sticky="sticky"
      :is-post-view="isPostView"
    />
    <MobilePost
      v-else
      :post="source"
      :expand="expand"
      :sticky="sticky"
      :is-post-view="isPostView"
    />
  </div>
</template>

<script>
import DesktopPost from './DesktopPost'
import MobilePost from './MobilePost'

export default {
  name: 'Post',
  components: { MobilePost, DesktopPost },
  props: {
    index: {
      type: Number,
      default: -1
    },
    source: {
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
