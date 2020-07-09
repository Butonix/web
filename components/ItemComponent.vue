<template>
  <div class="pb-3">
    <v-card
      outlined
      style="background-color: transparent; border-width: 1px; border-radius: 10px"
    >
      <v-list-item>
        <a
          :href="source.link"
          target="_blank"
          rel="noopener"
          @click.stop.prevent="toggleEmbed"
        >
          <v-list-item-avatar
            v-if="source.type !== 'TEXT'"
            style="border-radius: 12px; align-self: start"
            class="my-3"
            size="64"
            :color="$vuetify.theme.dark ? '#313235' : 'grey lighten-2'"
          >
            <img
              v-if="source.thumbnailUrl"
              style="border-radius: 12px; object-fit: cover"
              :src="source.thumbnailUrl"
            />
            <v-icon v-else size="32" class="text--secondary">{{
              $vuetify.icons.values.mdiWeb
            }}</v-icon>
          </v-list-item-avatar>
        </a>

        <v-list-item-content style="align-self: start; align-content: start">
          <span v-if="source.sticky">
            <v-icon color="primary" size="13" class="mr-1">{{
              $vuetify.icons.values.mdiStar
            }}</v-icon>
            <span class="overline primary--text mb-0">ANNOUNCEMENT</span>
          </span>

          <v-list-item-title style="white-space: normal">
            <nuxt-link
              class="text--primary mr-1"
              style="font-size: 1.125rem; font-weight: 400"
              :to="`/p/${source.id}`"
            >
              {{ source.title }}
            </nuxt-link>
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="source.textContent || source.link"
            style="white-space: normal"
            class="pt-1"
          >
            <div>
              <TopicChip
                v-for="topic in source.topics"
                :key="topic.name"
                :topic-data="topic"
              />
            </div>
            <div v-if="source.type === 'TEXT' && source.textContent">
              <div
                ref="textcontent"
                :class="
                  !idState.viewingMore && idState.textContentHeight >= 100
                    ? 'textcontent'
                    : ''
                "
              >
                <TextContent :text-content="source.textContent" />
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
        <a :href="source.link" rel="noopener" target="_blank">
          <img alt="Image preview" :src="source.link" style="max-width: 100%" />
        </a>
      </div>
      <v-card-actions class="pt-0 pl-4 pr-2">
        <UsernameMenu :user-data="source.author" />

        <span class="caption text--secondary ml-2">{{ timeSince }}</span>

        <v-spacer />

        <v-btn rounded text class="mr-2 ml-0" :to="`/p/${source.id}`" nuxt>
          <v-icon class="mr-2">{{
            $vuetify.icons.values.mdiCommentOutline
          }}</v-icon>
          {{ source.commentCount }}
        </v-btn>

        <v-btn
          rounded
          text
          class="mr-2 ml-0"
          :color="source.isEndorsed ? 'primary' : ''"
          @click="toggleEndorsement"
        >
          <v-icon class="mr-2">{{ $vuetify.icons.values.mdiRocket }}</v-icon>
          {{ source.endorsementCount }}
        </v-btn>

        <v-btn icon class="text--secondary ml-0">
          <v-icon>{{ $vuetify.icons.values.mdiDotsVertical }}</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="idState.dialog">
      <div
        style="display: flex; justify-content: center"
        @click="idState.dialog = false"
      >
        <Tweet
          v-if="isTwitterLink"
          :id="source.link.split('status/')[1].split('?')[0]"
          @click.stop.prevent="doNothing"
        />
        <youtube
          v-else-if="isYoutubeLink"
          :video-id="$youtube.getIdFromUrl(source.link)"
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
import togglePostEndorsementGql from '../gql/togglePostEndorsement.graphql'
import UsernameMenu from './UsernameMenu'
import TextContent from './TextContent'
import TopicChip from './TopicChip'

export default {
  name: 'ItemComponent',
  components: { TopicChip, TextContent, UsernameMenu, Tweet },
  mixins: [
    IdState({
      idProp: (vm) => vm.source.id
    })
  ],
  props: {
    source: {
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
    }
  },
  computed: {
    isYoutubeLink() {
      return (
        this.source.type === 'LINK' &&
        (this.source.link.includes('youtube.com/') ||
          this.source.link.includes('youtu.be/'))
      )
    },
    isTwitterLink() {
      return (
        this.source.type === 'LINK' &&
        this.source.link.includes('twitter.com/') &&
        this.source.link.includes('/status/')
      )
    },
    isEmbeddableImage() {
      return (
        this.source.type === 'IMAGE' && this.source.link.startsWith('https://')
      )
    },
    isEmbed() {
      return this.isYoutubeLink || this.isTwitterLink || this.isEmbeddableImage
    },
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.source.createdAt)) + ' ago'
    }
  },
  watch: {
    'idState.dialog'(dialog) {
      if (!dialog || !this.isEmbeddableImage) return
      this.$nextTick(() => {
        const $img = this.$refs.img
        const $link = this.$refs.link
        const $wrapper = this.$refs.wrapper

        if ($img && $link && $wrapper) this.addImgDrag($img, $link, $wrapper)
      })
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
      if (this.source.type === 'IMAGE' && this.isEmbeddableImage) {
        this.idState.imagePreview = !this.idState.imagePreview
      } else if (this.source.type === 'LINK' && this.isEmbed) {
        this.idState.dialog = true
      } else {
        window.open(this.source.link, '_blank')
      }
    },
    async toggleEndorsement() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this post'
        })
        return
      }

      if (this.source.author.isCurrentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Cannot rocket your own post'
        })
        return
      }

      if (this.source.isEndorsed) {
        this.source.isEndorsed = false
        this.source.endorsementCount--
      } else {
        this.source.isEndorsed = true
        this.source.endorsementCount++
      }
      await this.$apollo.mutate({
        mutation: togglePostEndorsementGql,
        variables: {
          postId: this.source.id
        }
      })
    },
    addImgDrag($img, $link, $wrapper) {
      if (!$img || !$link || !$wrapper) return

      const threshold = 3

      $link.onclick = function(event) {
        event.preventDefault()
      }
      $link.onmousedown = function(event) {
        event.preventDefault() // prevents FF from overlaying the image with blue

        $link.dragging = true
        $link.startX = event.pageX
        $link.startY = event.pageY

        $img.originalWidth = $img.width

        $img.style.cssText = 'width: ' + $img.width + 'px;'
      }
      $link.onmousemove = function(event) {
        if (!$link.dragging) return
        const width =
          $img.originalWidth +
          event.pageX -
          $link.startX +
          event.pageY -
          $link.startY
        $img.style.cssText = 'cursor: nwse-resize; width: ' + width + 'px;'
      }
      $link.onmouseup = function(event) {
        // detect click not drag, goto link
        if (
          Math.abs(event.pageX - $link.startX + event.pageY - $link.startY) <=
            threshold &&
          event.button === 0
        ) {
          window.open($link.href, '_blank')
        }
        $link.dragging = false
        $img.style.cssText = $img.style.cssText.replace(
          'nwse-resize',
          'pointer'
        )
      }
      // prevent: leave container, mouse up, re-enter, still resizing
      $link.onmouseenter = function(event) {
        $link.dragging = false
      }
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
