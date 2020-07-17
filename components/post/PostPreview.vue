<template>
  <div>
    <div v-if="imagePreview" style="max-width: none" class="pa-2">
      <a :href="post.link" rel="noopener" target="_blank">
        <img
          alt="Image preview"
          :src="post.link"
          :style="$device.isDesktop ? 'max-width: 75%' : 'max-width: 100%'"
        />
      </a>
    </div>

    <div v-if="post.type === 'TEXT' && post.textContent" class="px-2 pb-3 pt-1">
      <div
        :class="viewingMore || textContentHeight <= 90 ? '' : 'textcontent'"
        :style="textContentHeight <= 90 ? '' : 'cursor: pointer'"
        @click.stop.prevent="$emit('togglemore')"
      >
        <TextContent
          :text-content="post.textContent"
          :dark="$vuetify.theme.dark"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TextContent from '~/components/TextContent'

export default {
  name: 'PostPreview',
  components: { TextContent },
  props: {
    post: {
      type: Object,
      required: true
    },
    imagePreview: {
      type: Boolean,
      required: true
    },
    viewingMore: {
      type: Boolean,
      required: true
    },
    textContentHeight: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isEmbeddableImage() {
      return this.post.type === 'IMAGE' && this.post.link.startsWith('https://')
    }
  }
}
</script>

<style scoped>
.textcontent {
  max-height: 90px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}
</style>
