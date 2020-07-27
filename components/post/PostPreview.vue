<template>
  <div>
    <div v-if="post.type === 'TEXT' && post.textContent">
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

    <v-row
      v-else-if="expandedView && post.type === 'IMAGE' && isEmbeddableImage"
      class="mt-2"
      no-gutters
      justify="start"
    >
      <a :href="post.link" rel="noopener" target="_blank">
        <img alt="Image preview" :src="post.link" style="max-height: 500px" />
      </a>
    </v-row>

    <v-row
      v-else-if="
        expandedView &&
          (isYoutubeLink || isTweetLink || isSpotifyLink || isInstagramLink)
      "
      no-gutters
      justify="start"
      class="mt-2"
    >
      <client-only>
        <div v-if="isYoutubeLink" class="youtubecontainer">
          <iframe
            :src="`https://www.youtube.com/embed/${youtubeId}`"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="youtube"
          />
        </div>

        <!--<Tweet v-else-if="isTweetLink" :id="tweetId" />-->
        <vue-friendly-iframe
          v-else-if="isSpotifyLink"
          :src="spotifyUrl"
          width="300"
          height="380"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
          class="spotifyframe"
        />
        <instagram-embed
          v-else-if="isInstagramLink"
          :url="post.link"
          :max-width="500"
        />
      </client-only>
    </v-row>
  </div>
</template>

<script>
import { getIdFromUrl } from 'vue-youtube'
import InstagramEmbed from 'vue-instagram-embed'
import TextContent from '@/components/TextContent'

export default {
  name: 'PostPreview',
  components: {
    TextContent,
    InstagramEmbed
  },
  props: {
    post: {
      type: Object,
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
    expandedView: {
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

.spotifyframe >>> iframe {
  width: 300px;
  height: 380px;
}

.youtubecontainer {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
}

.youtube {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
