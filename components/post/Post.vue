<template>
  <v-card
    outlined
    class="bettercard"
    :ripple="false"
    style="cursor: auto"
    @click="goToIfMobile"
  >
    <v-list-item class="px-2">
      <PostThumbnail
        v-if="$device.isDesktop"
        :post="post"
        @thumbnailclick="toggleEmbed"
      />

      <v-list-item-content
        style="align-self: start; align-content: start"
        class="py-2"
      >
        <span v-if="post.sticky">
          <v-icon color="primary" size="13" class="mr-1">{{
            $vuetify.icons.values.mdiStar
          }}</v-icon>
          <span class="overline primary--text mb-0">ANNOUNCEMENT</span>
        </span>

        <v-list-item-title style="white-space: normal">
          <nuxt-link
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :to="`/p/${post.id}/${urlName}`"
          >
            {{ post.title }}
          </nuxt-link>

          <template v-if="$device.isDesktop">
            <nuxt-link
              v-if="post.type === 'TEXT'"
              :to="`/p/${post.id}/${urlName}`"
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
        <v-list-item-subtitle style="white-space: normal" class="pt-1">
          <div>
            <v-chip
              v-for="topic in post.topics"
              :key="topic.name"
              outlined
              label
              small
              class="mr-1 px-2"
              nuxt
              :to="`/t/${topic.name}`"
              @click.stop.prevent="doNothing"
            >
              <span>{{ topic.capitalizedName }}</span>
            </v-chip>
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>

      <PostThumbnail
        v-if="!$device.isDesktop"
        :post="post"
        @thumbnailclick="toggleEmbed"
      />
    </v-list-item>

    <PostPreview
      ref="textcontent"
      :is-post-view="isPostView"
      :post="post"
      :image-preview="idState.imagePreview"
      :viewing-more="idState.viewingMore"
      :text-content-height="idState.textContentHeight"
      @togglemore="idState.viewingMore = !idState.viewingMore"
    />

    <v-card-actions class="pt-0 pb-2">
      <span v-if="!post.author" class="text--secondary">[deleted]</span>
      <UsernameMenu
        v-else
        :user-data="post.author"
        @toggleblock="toggleBlock"
      />

      <span :title="editedTimeSince" class="text--secondary caption ml-2">{{
        timeSince
      }}</span>

      <v-spacer />

      <PostActions :post="post" />

      <PostOptions
        :post="post"
        :reported="idState.reported"
        @reported="idState.reported = true"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import { formatDistanceToNowStrict } from 'date-fns'
import UsernameMenu from '../user/UsernameMenu'
import PostThumbnail from './PostThumbnail'
import { timeSince } from '~/util/timeSince'
import PostPreview from '~/components/post/PostPreview'
import PostActions from '~/components/post/PostActions'
import PostOptions from '~/components/post/PostOptions'
import { urlName } from '~/util/urlName'

export default {
  name: 'Post',
  components: {
    PostOptions,
    PostActions,
    PostPreview,
    UsernameMenu,
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
      this.$router.push(`/p/${this.post.id}/${this.urlName}`)
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
