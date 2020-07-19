<template>
  <div v-if="!isPostView">
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

  <div v-else>
    <div v-if="post.type === 'TEXT' && post.textContent" class="px-2 pb-3 pt-1">
      <TextContent
        :dark="$vuetify.theme.dark"
        :text-content="post.textContent"
      />
    </div>

    <div
      v-else-if="post.type === 'IMAGE' && isEmbeddableImage"
      style="max-width: none"
      class="pa-2"
    >
      <a :href="post.link" rel="noopener" target="_blank">
        <img
          alt="Image preview"
          :src="post.link"
          :style="$device.isDesktop ? 'max-width: 75%' : 'max-width: 100%'"
        />
      </a>
    </div>

    <div
      v-else-if="
        isYoutubeLink || isTweetLink || isSpotifyLink || isInstagramLink
      "
      class="pb-2 px-2"
    >
      <client-only>
        <Youtube
          v-if="isYoutubeLink"
          :video-id="youtubeId"
          style="max-width: 100%"
        />
        <Tweet v-else-if="isTweetLink" :id="tweetId" style="max-width: 100%" />
        <iframe
          v-else-if="isSpotifyLink"
          :src="spotifyUrl"
          width="300"
          height="380"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
        />
        <instagram-embed
          v-else-if="isInstagramLink"
          :url="post.link"
          :max-width="500"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
import { getIdFromUrl, Youtube } from 'vue-youtube'
import { Tweet } from 'vue-tweet-embed'
import InstagramEmbed from 'vue-instagram-embed'
import TextContent from '~/components/TextContent'

export default {
  name: 'PostPreview',
  components: { TextContent, Youtube, Tweet, InstagramEmbed },
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
    },
    isPostView: {
      type: Boolean,
      default: false
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
    isSpotifyLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.startsWith('https://open.spotify.com/')
      )
    },
    isInstagramLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.startsWith('https://www.instagram.com/p/')
      )
    },
    spotifyUrl() {
      if (!this.isSpotifyLink) return ''
      const split = this.post.link.split('.com/')
      return (split[0] + '.com/embed/' + split[1]).split('?si=')[0]
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
