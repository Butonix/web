<template>
  <div v-intersect.once="updateTextContentSize">
    <v-list-item
      class="px-0"
      :style="isPostView ? 'min-height: 0' : 'min-height: 60px'"
    >
      <PostThumbnail v-if="$device.isDesktop" :post="post" />

      <v-list-item-content
        class="pa-0"
        style="align-content: space-between; align-self: start"
        :style="isPostView ? 'min-height: 0' : 'min-height: 60px'"
      >
        <span v-if="post.sticky">
          <v-icon color="primary" size="13" class="mr-1">{{
            $vuetify.icons.values.mdiStar
          }}</v-icon>
          <span class="overline primary--text mb-0">ANNOUNCEMENT</span>
        </span>

        <v-list-item-title style="white-space: normal">
          <v-btn
            v-if="showExpandBtn && !isPostView"
            width="16"
            height="16"
            icon
            class="mr-1 pb-1 text--secondary"
            @click.stop.prevent="idState.expand = !idState.expand"
          >
            <v-icon size="16">{{
              idState.expand
                ? $vuetify.icons.values.mdiArrowCollapse
                : $vuetify.icons.values.mdiArrowExpand
            }}</v-icon>
          </v-btn>

          <nuxt-link
            v-if="!isPostView"
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            event=""
            :to="`/p/${post.planet.name}/comments/${post.id}/${urlName}`"
          >
            {{ post.title }}
          </nuxt-link>

          <a
            v-else-if="post.link"
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :href="post.link"
            target="_blank"
            rel="noopener nofollow noreferrer"
            @click.stop.prevent="openLink"
          >
            {{ post.title }}
          </a>

          <span
            v-else
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
          >
            {{ post.title }}
          </span>

          <template v-if="$device.isDesktop">
            <nuxt-link
              v-if="post.type === 'TEXT'"
              :to="`/p/${post.planet.name}/comments/${post.id}/${urlName}`"
              class="text--secondary hoverable"
              style="font-size: 0.86rem"
            >
              (text post)
            </nuxt-link>
            <a
              v-else
              :href="post.link"
              target="_blank"
              rel="noopener nofollow noreferrer"
              class="text--secondary hoverable"
              style="font-size: 0.86rem"
              >({{ post.domain }})</a
            >
          </template>

          <template v-else>
            <span
              v-if="post.type === 'TEXT'"
              class="text--secondary"
              style="font-size: 0.86rem"
              >(text post)</span
            >
            <span v-else class="text--secondary" style="font-size: 0.86rem"
              >({{ post.domain }})</span
            >
          </template>
        </v-list-item-title>

        <div v-if="!$device.isDesktop" class="mt-1">
          <PlanetNameMenu :planet-data="post.planet" />
        </div>

        <PostPreview
          v-if="$device.isDesktop"
          ref="textcontent"
          :key="post.id"
          :expand="idState.expand || isPostView"
          :is-post-view="isPostView"
          :post="post"
          :text-content-height="idState.textContentHeight"
          @togglemore="idState.expand = !idState.expand"
        />

        <PostBottomBar
          v-if="$device.isDesktop && !isPostView"
          class="mt-2"
          :post="post"
          :is-post-view="isPostView"
          @toggleblock="toggleBlock"
        />
      </v-list-item-content>

      <PostThumbnail v-if="!$device.isDesktop" :post="post" />
    </v-list-item>

    <PostPreview
      v-if="!$device.isDesktop"
      ref="textcontent"
      :key="post.id"
      :expand="idState.expand || isPostView"
      :is-post-view="isPostView"
      :post="post"
      :text-content-height="idState.textContentHeight"
      @togglemore="idState.expand = !idState.expand"
    />

    <PostBottomBar
      v-if="!$device.isDesktop || isPostView"
      class="mt-2"
      :post="post"
      :is-post-view="isPostView"
      @toggleblock="toggleBlock"
    />
  </div>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import PostThumbnail from './PostThumbnail'
import { urlName } from '~/util/urlName'
import PostBottomBar from '@/components/post/PostBottomBar'
import PostPreview from '@/components/post/PostPreview'
import PlanetNameMenu from '@/components/planet/PlanetNameMenu'

export default {
  name: 'Post',
  components: {
    PlanetNameMenu,
    PostPreview,
    PostBottomBar,
    PostThumbnail
  },
  mixins: [
    IdState({
      idProp: (vm) => vm.post.id
    })
  ],
  props: {
    post: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    isPostView: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isExpandable() {
      return (
        this.post.textContent ||
        this.isEmbeddableImage ||
        this.isYoutubeLink ||
        this.isSpotifyLink ||
        this.isTweetLink ||
        this.isInstagramLink
      )
    },
    showExpandBtn() {
      return (
        (this.post.textContent && this.idState.textContentHeight > 90) ||
        this.isEmbeddableImage ||
        this.isYoutubeLink ||
        this.isSpotifyLink ||
        this.isTweetLink ||
        this.isInstagramLink
      )
    },
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
    isSpotifyLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.startsWith('https://open.spotify.com/')
      )
    },
    isTweetLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.includes('twitter.com/') &&
        this.post.link.includes('/status/')
      )
    },
    isInstagramLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.startsWith('https://www.instagram.com/p/')
      )
    },
    urlName() {
      if (!this.post) return ''
      return urlName(this.post.title)
    }
  },
  watch: {
    'post.isHidden'() {
      this.$emit('togglehidden')
    },
    '$route.query.expanded'() {
      if (this.$route.query.expanded === 'yes') this.idState.expand = true
      else this.idState.expand = false
    }
  },
  idState() {
    return {
      textContentHeight: -1,
      didGetTextContentHeight: false,
      reported: false,
      expand: this.$route.query.expanded === 'yes'
    }
  },
  mounted() {
    this.$nextTick(() => this.updateTextContentSize())
  },
  methods: {
    doNothing() {},
    openLink() {
      window.open(this.post.link, '_blank')
    },
    updateTextContentSize() {
      if (
        this.$refs.textcontent &&
        this.post.textContent &&
        !this.idState.didGetTextContentHeight
      ) {
        this.idState.textContentHeight = this.$refs.textcontent.$el.clientHeight
        this.idState.didGetTextContentHeight = true
      }
    },
    toggleBlock() {
      this.post.author.isBlocking = !this.post.author.isBlocking
      this.$emit('toggleblock')
    }
  }
}
</script>

<style scoped>
.v-dialog__content >>> .v-dialog {
  box-shadow: none !important;
}

.v-list-item__content > *:not(:last-child) {
  margin-bottom: 0;
}
</style>
