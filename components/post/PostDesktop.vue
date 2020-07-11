<template>
  <div>
    <v-card outlined class="bettercard">
      <v-list-item>
        <a
          :href="post.link"
          target="_blank"
          rel="noopener"
          style="align-self: start"
          @click.stop.prevent="toggleEmbed"
        >
          <v-list-item-avatar
            v-if="post.type !== 'TEXT'"
            style="border-radius: 12px"
            class="my-3"
            size="64"
            :color="$vuetify.theme.dark ? '#313235' : 'grey lighten-2'"
          >
            <img
              v-if="post.thumbnailUrl"
              style="border-radius: 12px; object-fit: cover"
              :src="post.thumbnailUrl"
            />
            <v-icon v-else size="32" class="text--secondary">{{
              $vuetify.icons.values.mdiWeb
            }}</v-icon>
          </v-list-item-avatar>
        </a>

        <v-list-item-content style="align-self: start; align-content: start">
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
          <v-list-item-subtitle
            v-if="post.textContent || post.link"
            style="white-space: normal"
            class="pt-1"
          >
            <div>
              <TopicChip
                v-for="topic in post.topics"
                :key="topic.name"
                :topic-data="topic"
              />
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
                <Editor :value="post.textContent" />
              </div>

              <a
                v-if="idState.textContentHeight >= 150"
                @click="idState.viewingMore = !idState.viewingMore"
                >View {{ idState.viewingMore ? 'less' : 'more' }}</a
              >
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div v-if="idState.imagePreview" style="max-width: none" class="px-4">
        <a :href="post.link" rel="noopener" target="_blank">
          <img alt="Image preview" :src="post.link" style="max-width: 100%" />
        </a>
      </div>
      <v-card-actions class="pt-0 pl-4">
        <UsernameMenu :user-data="post.author" />

        <span class="caption text--secondary ml-2">{{ timeSince }}</span>

        <v-spacer />

        <v-btn
          small
          rounded
          text
          class="mr-2 ml-0 betterbutton text--secondary"
          :to="`/p/${post.id}/${urlName}`"
          nuxt
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
          class="mr-2 ml-0 betterbutton"
          :class="post.isEndorsed ? '' : 'text--secondary'"
          :color="post.isEndorsed ? 'primary' : ''"
          @click="toggleEndorsement"
        >
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiRocket
          }}</v-icon>
          {{ post.endorsementCount }}
        </v-btn>

        <v-btn small icon class="text--secondary ml-0">
          <v-icon size="20">{{ $vuetify.icons.values.mdiDotsVertical }}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="idState.dialog">
      <div
        v-if="idState.dialog"
        style="display: flex; justify-content: center"
        @click="idState.dialog = false"
      >
        <Tweet
          v-if="isTwitterLink"
          :id="post.link.split('status/')[1].split('?')[0]"
          @click.stop.prevent="doNothing"
        />
        <youtube
          v-else-if="isYoutubeLink"
          :video-id="$youtube.getIdFromUrl(post.link)"
          @click.stop.prevent="doNothing"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { IdState } from 'vue-virtual-scroller'
import { Tweet } from 'vue-tweet-embed'
import { formatDistanceToNowStrict } from 'date-fns'
import togglePostEndorsementGql from '../../gql/togglePostEndorsement.graphql'
import UsernameMenu from '../user/UsernameMenu'
import TopicChip from '../topic/TopicChip'
import Editor from '../editor/Editor'

export default {
  name: 'PostDesktop',
  components: { Editor, TopicChip, UsernameMenu, Tweet },
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
    isYoutubeLink() {
      return (
        this.post.type === 'LINK' &&
        (this.post.link.includes('youtube.com/') ||
          this.post.link.includes('youtu.be/'))
      )
    },
    isTwitterLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.includes('twitter.com/') &&
        this.post.link.includes('/status/')
      )
    },
    isEmbeddableImage() {
      return this.post.type === 'IMAGE' && this.post.link.startsWith('https://')
    },
    isEmbed() {
      return this.isYoutubeLink || this.isTwitterLink || this.isEmbeddableImage
    },
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.post.createdAt)) + ' ago'
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
      imagePreview: false
    }
  },
  methods: {
    doNothing() {},
    toggleEmbed() {
      if (this.post.type === 'IMAGE' && this.isEmbeddableImage) {
        this.idState.imagePreview = !this.idState.imagePreview
      } else if (this.post.type === 'LINK' && this.isEmbed) {
        this.idState.dialog = true
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
