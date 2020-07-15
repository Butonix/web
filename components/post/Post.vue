<template>
  <v-card v-if="$device.isDesktop" outlined class="bettercard">
    <v-list-item class="px-2">
      <PostThumbnail :post="post" @thumbnailclick="toggleEmbed" />

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
          <a
            v-if="post.type !== 'TEXT' && isPostView"
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :href="post.link"
            target="_blank"
            rel="noopener"
          >
            {{ post.title }}
          </a>
          <nuxt-link
            v-else
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :to="`/p/${post.id}/${urlName}`"
          >
            {{ post.title }}
          </nuxt-link>

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
            >
              <span>{{ topic.capitalizedName }}</span>
            </v-chip>
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <PostPreview
      ref="textcontent"
      :post="post"
      :expand="idState.expand"
      :image-preview="idState.imagePreview"
      :viewing-more="idState.viewingMore"
      :text-content-height="idState.textContentHeight"
      @togglemore="idState.viewingMore = !idState.viewingMore"
    />

    <v-card-actions class="pt-2 pb-2">
      <UsernameMenu :user-data="post.author" />

      <span class="caption text--secondary ml-2" :title="editedTimeSince">{{
        timeSince
      }}</span>

      <v-spacer />

      <PostActions :post="post" />

      <PostOptions
        :post="post"
        :hidden="idState.hidden"
        :reported="idState.reported"
        :blocked="idState.blocked"
        @hidden="idState.hidden = true"
        @unhidden="idState.hidden = false"
        @reported="idState.reported = true"
        @blocked="idState.blocked = true"
        @unblocked="idState.blocked = false"
      />
    </v-card-actions>
  </v-card>

  <!--MOBILE-->
  <v-card
    v-else
    outlined
    class="bettercard"
    nuxt
    :to="`/p/${post.id}/${urlName}`"
    :ripple="false"
  >
    <v-list-item class="px-2">
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
          <span
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
          >
            {{ post.title }}
          </span>

          <span v-if="post.type === 'TEXT'" class="text--secondary caption">
            (text post)
          </span>
          <span v-else class="text--secondary caption"
            >({{ post.domain }})</span
          >
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
            >
              <span>{{ topic.capitalizedName }}</span>
            </v-chip>
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>

      <PostThumbnail :post="post" @thumbnailclick="toggleEmbed" />
    </v-list-item>

    <PostPreview
      ref="textcontent"
      :post="post"
      :expand="idState.expand"
      :image-preview="idState.imagePreview"
      :viewing-more="idState.viewingMore"
      :text-content-height="idState.textContentHeight"
      @togglemore="idState.viewingMore = !idState.viewingMore"
    />

    <v-card-actions class="pt-2 pb-2">
      <Username :user-data="post.author" />

      <span class="caption text--secondary ml-2" :title="editedTimeSince">{{
        timeSince
      }}</span>

      <v-spacer />

      <PostActions :post="post" />

      <PostOptions
        :post="post"
        :hidden="idState.hidden"
        :reported="idState.reported"
        :blocked="idState.blocked"
        @hidden="idState.hidden = true"
        @unhidden="idState.hidden = false"
        @reported="idState.reported = true"
        @blocked="idState.blocked = true"
        @unblocked="idState.blocked = false"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import { formatDistanceToNowStrict } from 'date-fns'
import UsernameMenu from '../user/UsernameMenu'
import Username from '../user/Username'
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
    Username,
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
    $route: {
      deep: true,
      handler(val) {
        if (val.name === 'p-id-title' && val.params.id === this.post.id) {
          setTimeout(() => (this.idState.expand = true), 251)
        } else {
          setTimeout(() => (this.idState.expand = false), 251)
        }
      }
    }
  },
  mounted() {
    if (this.$route.name === 'p-id-title') return
    if (this.$refs.textcontent) {
      this.idState.textContentHeight = this.$refs.textcontent.$el.clientHeight
    }
  },
  idState() {
    return {
      userCard: false,
      viewingMore: false,
      textContentHeight: 0,
      dialog: false,
      imagePreview: false,
      expand:
        this.$route.name === 'p-id-title' &&
        this.$route.params.id === this.post.id,
      hidden: false,
      reported: false,
      blocked: false
    }
  },
  methods: {
    doNothing() {},
    toggleEmbed() {
      if (
        this.post.type === 'IMAGE' &&
        this.isEmbeddableImage &&
        this.$route.name !== 'p-id-title'
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
