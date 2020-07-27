<template>
  <div @click="goToIfMobile">
    <v-list-item class="px-0">
      <PostThumbnail
        v-if="$device.isDesktop"
        :post="post"
        @thumbnailclick="toggleEmbed"
      />

      <v-list-item-content
        class="pa-0"
        style="align-content: space-between"
        :style="$device.isDesktop ? 'min-height: 60px' : ''"
      >
        <span v-if="post.sticky">
          <v-icon color="primary" size="13" class="mr-1">{{
            $vuetify.icons.values.mdiStar
          }}</v-icon>
          <span class="overline primary--text mb-0">ANNOUNCEMENT</span>
        </span>

        <v-list-item-title style="white-space: normal">
          <nuxt-link
            v-if="$route.name !== 'post-id-title' || post.type === 'TEXT'"
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :to="`/p/${post.planet.name}/comments/${post.id}/${urlName}`"
          >
            {{ post.title }}
          </nuxt-link>

          <a
            v-else
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :href="post.link"
            target="_blank"
            rel="noopener"
          >
            {{ post.title }}
          </a>

          <template v-if="$device.isDesktop">
            <nuxt-link
              v-if="post.type === 'TEXT'"
              :to="`/p/${post.planet.name}/comments/${post.id}/${urlName}`"
              class="text--secondary caption hoverable"
            >
              (text post)
            </nuxt-link>
            <a
              v-else
              :href="post.link"
              target="_blank"
              rel="noopener"
              class="text--secondary caption hoverable"
              >({{ post.domain }})</a
            >
          </template>

          <template v-else>
            <span v-if="post.type === 'TEXT'" class="text--secondary caption"
              >(text post)</span
            >
            <span v-else class="text--secondary caption"
              >({{ post.domain }})</span
            >
          </template>
        </v-list-item-title>

        <PostPlanet v-if="!$device.isDesktop" :post="post" class="mt-1" />

        <PostPreview
          v-if="$device.isDesktop"
          v-show="active && expandedView"
          :key="post.id"
          ref="textcontent"
          :expanded-view="expandedView"
          :post="post"
          :viewing-more="idState.viewingMore"
          :text-content-height="idState.textContentHeight"
          @togglemore="idState.viewingMore = !idState.viewingMore"
        />

        <PostBottomBar
          v-if="$device.isDesktop"
          :post="post"
          :is-post-view="isPostView"
          class="mt-2"
        />
      </v-list-item-content>

      <PostThumbnail
        v-if="!$device.isDesktop"
        :post="post"
        @thumbnailclick="toggleEmbed"
      />
    </v-list-item>

    <PostPreview
      v-if="!$device.isDesktop"
      v-show="active && expandedView"
      :key="post.id"
      ref="textcontent"
      :expanded-view="expandedView"
      :post="post"
      :viewing-more="idState.viewingMore"
      :text-content-height="idState.textContentHeight"
      @togglemore="idState.viewingMore = !idState.viewingMore"
    />

    <PostBottomBar
      v-if="!$device.isDesktop"
      class="mt-2"
      :post="post"
      :is-post-view="isPostView"
    />
  </div>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import { formatDistanceToNowStrict } from 'date-fns'
import PostThumbnail from './PostThumbnail'
import { timeSince } from '~/util/timeSince'
import { urlName } from '~/util/urlName'
import PostBottomBar from '@/components/post/PostBottomBar'
import PostPlanet from '@/components/post/PostPlanet'
import PostPreview from '@/components/post/PostPreview'

export default {
  name: 'Post',
  components: {
    PostPreview,
    PostPlanet,
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
    },
    expandedView: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    urlName() {
      if (!this.post) return ''
      return urlName(this.post.title)
    },
    isEmbeddableImage() {
      return this.post.type === 'IMAGE' && this.post.link.startsWith('https://')
    },
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
  },
  watch: {
    'post.isHidden'() {
      this.$emit('togglehidden')
    }
  },
  mounted() {
    if (this.isPostView) return
    if (this.$refs.textcontent) {
      this.idState.textContentHeight = this.$refs.textcontent.$el.clientHeight
    }
  },
  idState() {
    return {
      viewingMore: false,
      textContentHeight: 0,
      imagePreview: false,
      reported: false
    }
  },
  methods: {
    doNothing() {},
    toggleBlock() {
      this.post.author.isBlocking = !this.post.author.isBlocking
      this.$emit('toggleblock')
    },
    goToIfMobile() {
      if (this.$device.isDesktop || this.isPostView) return
      this.$router.push(
        `/p/${this.post.planet.name}/comments/${this.post.id}/${this.urlName}`
      )
    },
    toggleEmbed() {
      if (
        this.post.type === 'IMAGE' &&
        this.isEmbeddableImage &&
        !this.isPostView
      ) {
        this.idState.imagePreview = !this.idState.imagePreview
      } else {
        window.open(this.post.link, '_blank')
      }
    }
  }
}
</script>

<style scoped>
.v-dialog__content >>> .v-dialog {
  box-shadow: none !important;
}
</style>
