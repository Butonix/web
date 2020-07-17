<template>
  <v-card outlined class="bettercard" :ripple="false" style="cursor: auto">
    <v-list-item class="px-2">
      <PostThumbnail
        v-if="$device.isDesktop"
        :post="post"
        @thumbnailclick="thumbnailClick"
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
          <a
            v-if="post.type !== 'TEXT'"
            class="text--primary mr-1"
            style="font-size: 1.125rem; font-weight: 400"
            :href="post.link"
            target="_blank"
            rel="noopener"
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
            >
              <span>{{ topic.capitalizedName }}</span>
            </v-chip>
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>

      <PostThumbnail
        v-if="!$device.isDesktop"
        :post="post"
        @thumbnailclick="thumbnailClick"
      />
    </v-list-item>

    <div v-if="post.type === 'TEXT' && post.textContent" class="px-2 pb-3 pt-1">
      <TextContent
        :dark="$vuetify.theme.dark"
        :text-content="post.textContent"
      />
    </div>

    <div
      v-else-if="post.type === 'IMAGE' && isEmbeddableImage"
      style="max-width: none"
      class="pa-2"
    >
      <a :href="post.link" rel="noopener" target="_blank">
        <img
          alt="Image preview"
          :src="post.link"
          :style="$device.isDesktop ? 'max-width: 75%' : 'max-width: 100%'"
        />
      </a>
    </div>

    <div v-else-if="isYoutubeLink || isTweetLink" class="pb-2 px-2">
      <client-only>
        <Youtube
          v-if="isYoutubeLink"
          :video-id="youtubeId"
          style="max-width: 100%"
        />
        <Tweet v-else-if="isTweetLink" :id="tweetId" style="max-width: 100%" />
      </client-only>
    </div>

    <v-card-actions class="pt-0 pb-2">
      <UsernameMenu v-if="$device.isDesktop" :user-data="post.author" />
      <Username v-else :link="false" :user-data="post.author" />

      <span :title="editedTimeSince" class="text--secondary caption ml-2">{{
        timeSince
      }}</span>

      <v-spacer />

      <PostActions :post="post" />

      <PostOptions
        :post="post"
        :hidden="hidden"
        :reported="reported"
        @hidden="hidden = true"
        @unhidden="hidden = false"
        @reported="reported = true"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import { getIdFromUrl, Youtube } from 'vue-youtube'
import { Tweet } from 'vue-tweet-embed'
import UsernameMenu from '../user/UsernameMenu'
import Username from '../user/Username'
import PostThumbnail from './PostThumbnail'
import { timeSince } from '~/util/timeSince'
import PostActions from '~/components/post/PostActions'
import PostOptions from '~/components/post/PostOptions'
import { urlName } from '~/util/urlName'
import TextContent from '@/components/TextContent'

export default {
  name: 'PostViewPost',
  components: {
    Tweet,
    Youtube,
    TextContent,
    PostOptions,
    PostActions,
    Username,
    UsernameMenu,
    PostThumbnail
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hidden: false,
      reported: false
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
    isYoutubeLink() {
      return (
        this.post.type === 'LINK' &&
        (this.post.link.includes('youtube.com/') ||
          this.post.link.includes('youtu.be/'))
      )
    },
    isTweetLink() {
      return (
        this.post.type === 'LINK' &&
        this.post.link.includes('twitter.com/') &&
        this.post.link.includes('/status/')
      )
    },
    youtubeId() {
      if (!this.isYoutubeLink) return ''
      else return getIdFromUrl(this.post.link)
    },
    tweetId() {
      if (!this.isTweetLink) return ''
      else return this.post.link.split('status/')[1].split('?')[0]
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
  methods: {
    doNothing() {},
    thumbnailClick() {
      window.open(this.post.link, '_blank')
    }
  }
}
</script>

<style scoped></style>
