<template>
  <v-card
    v-show="!post.hidden || $route.name.startsWith('Post')"
    outlined
    style="background-color: transparent"
  >
    <v-row align="center" class="ma-0">
      <a
        v-if="post.type === 'LINK' && (post.thumbnailUrl || isTwitterLink)"
        :href="post.link"
        rel="noopener"
        target="_blank"
        style="height: 72px"
      >
        <v-img
          :max-width="isYoutubeLink ? 128 : 72"
          height="72"
          :src="isTwitterLink ? twitterbird : post.thumbnailUrl"
        />
      </a>

      <v-col class="px-3 pt-2 pb-1">
        <div v-if="sticky" class="overline text--secondary ml-8">
          Announcement
        </div>

        <v-row
          align="center"
          class="mx-0"
          :class="isTitleOnlyTextPost ? 'mb-1' : ''"
        >
          <v-btn
            v-if="!isTitleOnlyTextPost"
            small
            icon
            class="mr-1"
            @click.prevent="expanded = !expanded"
          >
            <v-icon>{{ expanded ? icons.up : icons.down }}</v-icon>
          </v-btn>

          <div>
            <a
              v-if="$route.name.startsWith('Post') && post.type === 'LINK'"
              :href="post.link"
              rel="noopener"
              target="_blank"
              class="text--primary"
            >
              {{ post.title }}
            </a>

            <nuxt-link
              v-else
              :to="`/post/${post.id}/${urlName}`"
              class="text--primary"
            >
              {{ post.title }}
            </nuxt-link>

            <span
              v-if="post.type === 'TEXT'"
              style="font-size: 10px"
              class="text--secondary"
            >
              (text post)
            </span>

            <a
              v-else
              :href="post.link"
              target="_blank"
              rel="noopener"
              style="font-size: 10px"
              class="text--secondary hoverable"
            >
              ({{ post.domain }})
            </a>
          </div>

          <span class="ml-2">
            <TopicChip
              v-for="topic in post.topics"
              :key="topic.name"
              :topic-data="topic"
            />
          </span>
        </v-row>

        <v-row class="my-1 mx-0">
          <v-chip
            small
            outlined
            :color="post.isEndorsed ? 'primary' : ''"
            :to="`/user/@${post.author.username}`"
          >
            <v-avatar left class="mr-1">
              <v-icon small>{{ icons.profile }}</v-icon>
            </v-avatar>
            {{ post.author.username }}
          </v-chip>

          <v-chip
            small
            outlined
            class="ml-2"
            :color="post.isEndorsed ? 'primary' : ''"
            @click.prevent="toggleEndorsement"
          >
            <v-avatar left class="mr-1">
              <v-icon small>{{ icons.endorse }}</v-icon>
            </v-avatar>
            {{ post.endorsementCount }}
          </v-chip>

          <v-chip
            small
            outlined
            class="ml-2"
            :to="`/post/${post.id}/${urlName}`"
          >
            <v-avatar left class="mr-1">
              <v-icon small>{{ icons.comment }}</v-icon>
            </v-avatar>
            {{ post.commentCount }}
            {{ newCommentsCount > 0 ? `(+${newCommentsCount})` : '' }}
          </v-chip>

          <v-spacer />

          <v-btn small icon class="ml-2" @click.prevent="doNothing">
            <v-icon class="text--secondary">{{ icons.share }}</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <!--Expand-->
    <div v-if="expanded && !isTitleOnlyTextPost">
      <div v-if="post.type === 'LINK'">
        <v-divider class="mb-2 mt-0" />

        <div v-if="isYoutubeLink" class="px-4">
          <youtube width="640" :video-id="$youtube.getIdFromUrl(post.link)" />
        </div>

        <div v-if="isTwitterLink" class="px-4">
          <Tweet :id="post.link.split('status/')[1].split('?')[0]" />
        </div>

        <div v-else-if="!isImageUrl">
          <div class="mx-4 body-2 pb-1">
            <a :href="post.link" rel="noopener" target="_blank">{{
              post.link
            }}</a>
          </div>
        </div>

        <div v-else-if="isImageUrl">
          <div class="mx-4 body-2 pb-1">
            <div ref="wrapper" style="max-width: none">
              <a ref="link" :href="post.link" rel="noopener" target="_blank">
                <img ref="img" :src="post.link" style="max-width: 250px" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="post.type === 'TEXT'">
        <v-divider class="mb-3 mt-0" />
        <div
          v-if="post.author.isCurrentUser && !editing"
          class="mx-4 body-2 primary--text"
        >
          <span class="hoverable" @click="editing = true">Edit post</span>
        </div>
        <TextContent
          v-if="!editing"
          :text-content="post.textContent"
          class="mx-4 body-2 pb-1"
        />
        <div v-if="editing" class="mx-4">
          <v-textarea v-model="newTextContent" hide-details filled />
          <v-row class="mx-0 my-2">
            <v-spacer />
            <v-btn class="mr-1" small text @click="cancelEdit">Cancel</v-btn>
            <v-btn
              :loading="editBtnLoading"
              small
              text
              :disabled="newTextContent.length === 0"
              @click="editPost"
              >Done Editing</v-btn
            >
          </v-row>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import isImageUrl from 'is-image-url'
import { Tweet } from 'vue-tweet-embed'
import {
  mdiChevronUp,
  mdiChevronDown,
  mdiRocket,
  mdiCommentOutline,
  mdiAccountOutline,
  mdiShareOutline
} from '@mdi/js'
import editPostGql from '../gql/editPost.graphql'
import TopicChip from './TopicChip'
import TextContent from './TextContent'

export default {
  name: 'DesktopPost',
  components: { TextContent, TopicChip, Tweet },
  props: {
    post: {
      type: Object,
      required: true
    },
    expand: {
      type: Boolean,
      default: false
    },
    sticky: {
      type: Boolean,
      default: false
    },
    isPostView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newTextContent: this.post.textContent,
      editBtnLoading: false,
      editing: false,
      expanded: this.expand,
      icons: {
        down: mdiChevronDown,
        up: mdiChevronUp,
        endorse: mdiRocket,
        comment: mdiCommentOutline,
        profile: mdiAccountOutline,
        share: mdiShareOutline
      },
      twitterbird: require('~/assets/twitterbird.jpg')
    }
  },
  computed: {
    urlName() {
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    },
    isImageUrl() {
      return this.post.type === 'LINK' && isImageUrl(this.post.link)
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
    isTitleOnlyTextPost() {
      return this.post.type === 'TEXT' && !this.post.textContent
    }
  },
  watch: {
    expanded() {
      if (!process.client) return
      this.$nextTick(() => {
        const $img = this.$refs.img
        const $link = this.$refs.link
        const $wrapper = this.$refs.wrapper

        if (this.expanded && $img && $link && $wrapper) {
          this.addImgDrag($img, $link, $wrapper)
        }
      })
    }
  },
  mounted() {
    const $img = this.$refs.img
    const $link = this.$refs.link
    const $wrapper = this.$refs.wrapper

    if ($img && $link && $wrapper) this.addImgDrag($img, $link, $wrapper)
  },
  methods: {
    doNothing() {},
    cancelEdit() {
      this.editing = false
      this.newTextContent = this.post.textContent
    },
    async editPost() {
      if (this.newTextContent.length === 0) return
      this.editBtnLoading = true
      await this.$apollo.mutate({
        mutation: editPostGql,
        variables: {
          postId: this.post.id,
          newTextContent: this.newTextContent
        }
      })
      this.post.textContent = this.newTextContent
      this.editing = false
      this.editBtnLoading = false
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

<style scoped></style>
