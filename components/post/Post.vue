<template>
  <v-card v-if="$device.isDesktop" outlined class="bettercard">
    <v-list-item class="px-2">
      <PostThumbnail :post="post" @thumbnailclick="toggleEmbed" />

      <v-list-item-content
        style="align-self: start; align-content: start"
        class="pt-2"
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

          <div v-if="post.type === 'TEXT' && post.textContent">
            <div
              ref="textcontent"
              :class="
                !idState.viewingMore && idState.textContentHeight >= 100
                  ? 'textcontent'
                  : ''
              "
            >
              <TextContent
                :dark="$vuetify.theme.dark"
                :text-content="post.textContent"
              />
            </div>

            <a
              v-if="idState.textContentHeight >= 150"
              @click.stop.prevent="idState.viewingMore = !idState.viewingMore"
              >View {{ idState.viewingMore ? 'less' : 'more' }}</a
            >
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <PostPreview
      :post="post"
      :expand="idState.expand"
      :image-preview="idState.imagePreview"
    />

    <v-card-actions class="pt-0 pb-2">
      <UsernameMenu :user-data="post.author" />

      <span class="caption text--secondary ml-2">{{ timeSince }}</span>

      <v-spacer />

      <v-btn
        small
        rounded
        text
        class="mr-2 ml-0 text--secondary"
        :to="`/p/${post.id}/${urlName}`"
        nuxt
        :title="
          `${post.commentCount} Comment${post.commentCount === 1 ? '' : 's'}`
        "
      >
        <v-icon size="20" class="mr-2">{{
          $vuetify.icons.values.mdiCommentOutline
        }}</v-icon>
        {{ post.commentCount }}
      </v-btn>

      <v-btn
        small
        rounded
        text
        class="mr-2 ml-0 "
        :class="post.isEndorsed ? '' : 'text--secondary'"
        :color="post.isEndorsed ? 'primary' : ''"
        :title="
          `${post.endorsementCount} Rocket${
            post.endorsementCount === 1 ? '' : 's'
          }`
        "
        @click.stop.prevent="toggleEndorsement"
      >
        <v-icon size="20" class="mr-2">{{
          $vuetify.icons.values.mdiRocket
        }}</v-icon>
        {{ post.endorsementCount }}
      </v-btn>

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
        class="pt-2"
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

          <div v-if="post.type === 'TEXT' && post.textContent">
            <div
              ref="textcontent"
              :class="
                !idState.viewingMore && idState.textContentHeight >= 100
                  ? 'textcontent'
                  : ''
              "
            >
              <TextContent
                :dark="$vuetify.theme.dark"
                :text-content="post.textContent"
              />
            </div>

            <a
              v-if="idState.textContentHeight >= 150"
              @click.stop.prevent="idState.viewingMore = !idState.viewingMore"
              >View {{ idState.viewingMore ? 'less' : 'more' }}</a
            >
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>

      <PostThumbnail :post="post" @thumbnailclick="toggleEmbed" />
    </v-list-item>

    <PostPreview
      :post="post"
      :expand="idState.expand"
      :image-preview="idState.imagePreview"
    />

    <v-card-actions class="pt-0 pb-2">
      <Username :user-data="post.author" />

      <span class="caption text--secondary ml-2">{{ timeSince }}</span>

      <v-spacer />

      <v-btn small rounded text class="mr-2 ml-0 text--secondary">
        <v-icon size="20" class="mr-2">{{
          $vuetify.icons.values.mdiCommentOutline
        }}</v-icon>
        {{ post.commentCount }}
      </v-btn>

      <v-btn
        small
        rounded
        text
        class="mr-2 ml-0 "
        :class="post.isEndorsed ? '' : 'text--secondary'"
        :color="post.isEndorsed ? 'primary' : ''"
        @click.stop.prevent="toggleEndorsement"
      >
        <v-icon size="20" class="mr-2">{{
          $vuetify.icons.values.mdiRocket
        }}</v-icon>
        {{ post.endorsementCount }}
      </v-btn>

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
import togglePostEndorsementGql from '../../gql/togglePostEndorsement.graphql'
import UsernameMenu from '../user/UsernameMenu'
import TextContent from '../TextContent'
import Username from '../user/Username'
import PostThumbnail from './PostThumbnail'
import PostOptions from './PostOptions'
import { timeSince } from '~/util/timeSince'
import PostPreview from '~/components/post/PostPreview'

export default {
  name: 'Post',
  components: {
    PostPreview,
    PostOptions,
    Username,
    TextContent,
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
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
        .split('_')
        .slice(0, 9)
        .join('_')
    },
    timeSince() {
      return this.$device.isDesktop
        ? formatDistanceToNowStrict(new Date(this.post.createdAt)) + ' ago'
        : timeSince(new Date(this.post.createdAt))
    },
    isEmbeddableImage() {
      return this.post.type === 'IMAGE' && this.post.link.startsWith('https://')
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
    if (this.$refs.textcontent) {
      this.idState.textContentHeight = this.$refs.textcontent.clientHeight
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
      if (this.post.type === 'IMAGE' && this.isEmbeddableImage) {
        this.idState.imagePreview = !this.idState.imagePreview
      } else {
        window.open(this.post.link, '_blank')
      }
    },
    async toggleEndorsement() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this post'
        })
        return
      }

      if (this.post.author.isCurrentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Cannot rocket your own post'
        })
        return
      }

      if (this.post.isEndorsed) {
        this.post.isEndorsed = false
        this.post.endorsementCount--
      } else {
        this.post.isEndorsed = true
        this.post.endorsementCount++
      }
      await this.$apollo.mutate({
        mutation: togglePostEndorsementGql,
        variables: {
          postId: this.post.id
        }
      })
    }
  }
}
</script>

<style scoped>
.textcontent {
  max-height: 100px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent);
  mask-image: linear-gradient(180deg, #000 60%, transparent);
}

.v-dialog__content >>> .v-dialog {
  box-shadow: none !important;
}
</style>
