<template>
  <v-card
    v-show="!post.hidden || $route.name.startsWith('Post')"
    outlined
    nuxt
    :to="
      $breakpoint.mdAndUp || $route.name.startsWith('Post')
        ? ''
        : `/post/${post.id}/${urlName}`
    "
  >
    <v-row align="center" class="ma-0">
      <a
        v-if="post.type === 'LINK' && post.thumbnailUrl && $breakpoint.mdAndUp"
        :href="post.link"
        target="_blank"
        style="height: 72px"
      >
        <img
          :src="post.thumbnailUrl"
          style="height: 72px; object-fit: cover"
          :style="`width: ${isYoutubeLink ? '128px' : '72px'}`"
          alt="Thumbnail"
        />
      </a>

      <v-list-item
        v-if="!$breakpoint.mdAndUp"
        style="min-height: 0"
        class="px-2 pb-0"
      >
        <div class="mt-2">
          <span class="mr-2">{{ post.title }}</span>
          <TopicChip
            v-for="topic in post.topics"
            :key="topic.name"
            :topic="topic"
          />
        </div>

        <v-list-item-avatar
          v-if="post.type === 'LINK' && post.thumbnailUrl"
          tile
          size="64"
          class="mb-0 ml-auto"
        >
          <img
            :src="post.thumbnailUrl"
            style="height: 64px; object-fit: contain"
          />
        </v-list-item-avatar>
      </v-list-item>
      <div v-else class="px-3 pt-2 pb-1">
        <v-row align="center" class="ma-0">
          <v-btn
            v-if="!isTitleOnlyTextPost && $breakpoint.mdAndUp"
            small
            icon
            class="mr-1"
            @click="expanded = !expanded"
          >
            <v-icon>{{
              expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
            }}</v-icon>
          </v-btn>

          <a
            v-if="$route.name.startsWith('Post') && post.type === 'LINK'"
            :href="post.link"
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

          <span class="ml-2">
            <TopicChip
              v-for="topic in post.topics"
              :key="topic.name"
              :topic="topic"
            />
          </span>
        </v-row>

        <div>
          <PostActions :post="post" />
        </div>
      </div>
    </v-row>

    <v-card-actions v-if="!$breakpoint.mdAndUp" class="pt-0 pb-1">
      <PostActions :post="post" />
    </v-card-actions>

    <!--Expand-->
    <div v-if="expanded && !isTitleOnlyTextPost">
      <div v-if="post.type === 'LINK'">
        <v-divider class="mb-2 mt-0" />

        <div v-if="isYoutubeLink" class="px-4">
          <youtube
            :width="$breakpoint.mdAndUp ? '640' : '100%'"
            :video-id="$youtube.getIdFromUrl(post.link)"
          />
        </div>

        <div v-if="isTwitterLink" class="px-4">
          <Tweet :id="post.link.split('status/')[1].split('?')[0]" />
        </div>

        <div v-else-if="!isImageUrl">
          <div class="mx-4 body-2 pb-1">
            <a :href="post.link" target="_blank">{{ post.link }}</a>
          </div>
        </div>

        <div v-else-if="isImageUrl">
          <div class="mx-4 body-2 pb-1">
            <a :href="post.link" target="_blank">
              <img
                :src="post.link"
                style="display: block; max-width: 100%; max-height: 700px; width: auto; height: auto"
              />
            </a>
          </div>
        </div>
      </div>

      <div v-else-if="post.type === 'TEXT'">
        <v-divider class="mb-3 mt-0" />
        <div class="mx-4 body-2 pb-1 opensans" v-html="textContents" />
      </div>
    </div>
  </v-card>
</template>

<script>
import marked from 'marked'
import { formatDistanceToNowStrict } from 'date-fns'
import isImageUrl from 'is-image-url'
import { Tweet } from 'vue-tweet-embed'
import DOMPurify from 'dompurify'
import { escapeHtml } from '../util/escapeHtml'
import TopicChip from './TopicChip'
import PostActions from './PostActions'

export default {
  name: 'Post',
  components: { PostActions, TopicChip, Tweet },
  props: {
    post: {
      type: Object,
      required: true
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: this.expand,
      postView: null
    }
  },
  computed: {
    urlName() {
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    },
    textContents() {
      return this.post.textContent
        ? DOMPurify.sanitize(marked(escapeHtml(this.post.textContent)))
        : undefined
    },
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.post.createdAt))
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
  }
}
</script>

<style scoped>
.opensans {
  font-family: 'Open Sans', sans-serif !important;
}
</style>
