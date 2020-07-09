<template>
  <v-card
    outlined
    style="background-color: transparent; border-width: 1px; border-radius: 10px; min-height: 80px"
  >
    <v-row align="center" class="ma-0">
      <a
        v-if="
          (post.type === 'LINK' || post.type === 'IMAGE') &&
            (post.thumbnailUrl || isTwitterLink)
        "
        :href="post.link"
        rel="noopener"
        target="_blank"
        style="height: 78px"
      >
        <v-avatar
          tile
          size="78"
          :width="isYoutubeLink ? 128 : undefined"
          style="border-radius: 10px"
        >
          <!--<img
            alt="Thumbnail"
            :src="isTwitterLink ? twitterbird : post.thumbnailUrl"
            style="height: 78px; border-radius: 10px"
            :style="{ 'max-width': isYoutubeLink ? '128px' : '78px' }"
          />-->
        </v-avatar>
      </a>

      <v-col class="px-3 pt-2 pb-0">
        <div v-if="sticky" class="overline text--secondary ml-8">
          Announcement
        </div>

        <v-row align="center" class="mx-0">
          <!--<v-col class="flex-shrink-1 flex-grow-0 pl-0 py-0 pr-1">
            <v-btn
              v-if="
                (post.type === 'TEXT' && post.textContent) ||
                  ((post.type === 'LINK' || post.type === 'IMAGE') &&
                    post.link.startsWith('https://'))
              "
              aria-label="View preview"
              small
              icon
              class="mr-1"
              @click.prevent="expanded = !expanded"
            >
              <v-icon v-if="post.type === 'TEXT'">{{
                expanded
                  ? $vuetify.icons.values.mdiTextBoxOutline
                  : $vuetify.icons.values.mdiTextBox
              }}</v-icon>

              <v-icon v-else-if="post.type === 'LINK'">{{
                expanded
                  ? $vuetify.icons.values.mdiLinkBoxOutline
                  : $vuetify.icons.values.mdiLinkBox
              }}</v-icon>

              <v-icon v-else-if="post.type === 'IMAGE'">{{
                expanded
                  ? $vuetify.icons.values.mdiImageOutline
                  : $vuetify.icons.values.mdiImage
              }}</v-icon>
            </v-btn>
          </v-col>-->

          <v-col class="pa-0 flex-grow-1">
            <span>
              <a
                v-if="$route.name.startsWith('post') && post.type === 'LINK'"
                :href="post.link"
                rel="noopener"
                target="_blank"
                class="text--primary"
              >
                {{ post.title }}
              </a>

              <nuxt-link
                v-else
                :to="`/p/${post.id}/${urlName}`"
                class="text--primary"
              >
                {{ post.title }}
              </nuxt-link>

              <span
                v-if="post.type === 'TEXT'"
                style="font-size: .625rem"
                class="text--secondary"
              >
                (text post)
              </span>

              <a
                v-else
                :href="post.link"
                target="_blank"
                rel="noopener"
                style="font-size: .625rem"
                class="text--secondary hoverable"
              >
                ({{ post.domain }})
              </a>

              <!--<span class="ml-2">
                <TopicChip
                  v-for="topic in post.topics"
                  :key="topic.name"
                  :topic-data="topic"
                />
              </span>-->
            </span>
          </v-col>
        </v-row>

        <!--<v-row class="mb-1 mt-2 mx-0" align="center">
          <v-chip
            small
            outlined
            :color="post.isEndorsed ? 'primary' : ''"
            @click.prevent="toggleEndorsement"
          >
            <v-avatar left class="mr-1">
              <v-icon small>{{ $vuetify.icons.values.mdiRocket }}</v-icon>
            </v-avatar>
            {{ post.endorsementCount }}
          </v-chip>

          <v-chip
            small
            outlined
            class="ml-2"
            :to="`/p/${post.id}/${urlName}`"
            nuxt
          >
            <v-avatar left class="mr-1">
              <v-icon small>{{
                $vuetify.icons.values.mdiCommentOutline
              }}</v-icon>
            </v-avatar>
            {{ post.commentCount }}
            {{ newCommentsCount > 0 ? `(+${newCommentsCount})` : '' }}
          </v-chip>

          <v-chip
            small
            outlined
            :to="`/u/${post.author.username}`"
            nuxt
            class="ml-2"
          >
            <v-avatar left class="mr-1">
              <v-icon small>{{
                $vuetify.icons.values.mdiAccountOutline
              }}</v-icon>
            </v-avatar>
            {{ post.author.username }}
          </v-chip>

          <v-spacer />

          <span style="font-size: .75rem" class="text&#45;&#45;secondary mr-1">{{
            timeSince
          }}</span>

          <v-btn
            aria-label="Share"
            small
            icon
            class="ml-2"
            @click.prevent="doNothing"
          >
            <v-icon class="text&#45;&#45;secondary">{{
              $vuetify.icons.values.mdiShareOutline
            }}</v-icon>
          </v-btn>
        </v-row>-->
      </v-col>
    </v-row>

    <!--Expand-->
    <div v-if="isPostView">
      <div v-if="post.type === 'LINK' || post.type === 'IMAGE'">
        <v-divider class="mb-2 mt-0" />

        <div v-if="isYoutubeLink" class="px-4">
          <youtube width="640" :video-id="$youtube.getIdFromUrl(post.link)" />
        </div>

        <div v-else-if="isTwitterLink" class="px-4">
          <Tweet :id="post.link.split('status/')[1].split('?')[0]" />
        </div>

        <div
          v-else-if="post.type === 'IMAGE' && post.link.startsWith('https://')"
        >
          <div class="mx-4 body-2 pb-1">
            <div ref="wrapper" style="max-width: none">
              <a ref="link" :href="post.link" rel="noopener" target="_blank">
                <img ref="img" :src="post.link" style="max-width: 250px" />
              </a>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="mx-4 body-2 pb-1">
            <a :href="post.link" rel="noopener" target="_blank">{{
              post.link
            }}</a>
          </div>
        </div>
      </div>

      <div v-else-if="post.type === 'TEXT' && post.textContent">
        <v-divider class="mb-3 mt-0" />
        <TextContent
          :text-content="post.textContent"
          class="mx-4 body-2 pb-1"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
import { Tweet } from 'vue-tweet-embed'
import togglePostEndorsementGql from '../gql/togglePostEndorsement.graphql'
import { timeSince } from '../util/timeSince'
// import TopicChip from './TopicChip'
import TextContent from './TextContent'

export default {
  name: 'DesktopPost',
  components: { TextContent, /* TopicChip, */ Tweet },
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
  computed: {
    timeSince() {
      return timeSince(new Date(this.post.createdAt))
    },
    urlName() {
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
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
    },
    newCommentsCount() {
      if (!this.post.postView) return 0
      return this.post.commentCount - this.post.postView.lastCommentCount
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
    async toggleEndorsement() {
      if (!this.$apolloHelpers.getToken()) {
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
