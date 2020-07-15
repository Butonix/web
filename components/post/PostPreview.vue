<template>
  <div>
    <div
      v-if="
        imagePreview ||
          ($route.name === 'p-id-title' &&
            $route.params.id === post.id &&
            expand &&
            isEmbeddableImage)
      "
      style="max-width: none"
      class="px-4"
    >
      <a :href="post.link" rel="noopener" target="_blank">
        <img
          alt="Image preview"
          :src="post.link"
          :style="$device.isDesktop ? 'max-width: 75%' : 'max-width: 100%'"
        />
      </a>
    </div>

    <client-only>
      <div
        v-if="
          $route.name === 'p-id-title' &&
            $route.params.id === post.id &&
            expand &&
            (isYoutubeLink || isTweetLink)
        "
        class="px-4"
      >
        <Youtube
          v-if="isYoutubeLink"
          :video-id="youtubeId"
          style="max-width: 100%"
        />
        <Tweet v-else-if="isTweetLink" :id="tweetId" style="max-width: 100%" />
      </div>
    </client-only>

    <div
      v-if="
        $route.name === 'p-id-title' &&
          $route.params.id === post.id &&
          post.type === 'TEXT' &&
          post.textContent &&
          expand
      "
      class="px-2 pb-2"
    >
      <TextContent
        :text-content="post.textContent"
        :dark="$vuetify.theme.dark"
      />
    </div>

    <div
      v-if="post.type === 'TEXT' && post.textContent && !expand"
      class="px-2 pb-2"
    >
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
import { Youtube, getIdFromUrl } from 'vue-youtube'
import { Tweet } from 'vue-tweet-embed'
import TextContent from '~/components/TextContent'

export default {
  name: 'PostPreview',
  components: { TextContent, Youtube, Tweet },
  props: {
    post: {
      type: Object,
      required: true
    },
    imagePreview: {
      type: Boolean,
      required: true
    },
    expand: {
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
    },
    isYoutubeLink() {
      return (
        this.post.type === 'LINK' &&
        (this.post.link.includes('youtube.com/') ||
          this.post.link.includes('youtu.be/'))
      )
    },
    isTweetLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.includes('twitter.com/') &&
        this.post.link.includes('/status/')
      )
    },
    youtubeId() {
      if (!this.isYoutubeLink) return ''
      else return getIdFromUrl(this.post.link)
    },
    tweetId() {
      if (!this.isTweetLink) return ''
      else return this.post.link.split('status/')[1].split('?')[0]
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
