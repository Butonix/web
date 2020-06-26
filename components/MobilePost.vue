<template>
  <v-card
    v-show="!post.hidden || $route.name.startsWith('Post')"
    :tile="isPostView"
    :to="isPostView ? '' : `/post/${post.id}/${urlName}`"
  >
    <div v-if="expanded && post.type === 'LINK'">
      <youtube
        v-if="isYoutubeLink"
        :width="'100%'"
        height="170"
        :video-id="$youtube.getIdFromUrl(post.link)"
      />
      <Tweet
        v-else-if="isTwitterLink"
        :id="post.link.split('status/')[1].split('?')[0]"
      />
      <a v-if="isImageUrl" :href="post.link" target="_blank" rel="noopener">
        <v-img :src="post.link" height="170" />
      </a>
    </div>

    <v-list-item style="min-height: 0; align-items: start" class="px-2 pb-0">
      <div class="mt-2">
        <div v-if="sticky" class="overline text--secondary">Announcement</div>

        <nuxt-link
          :to="`/post/${post.id}/${urlName}`"
          class="text--primary font-weight-light"
          style="display: block; line-height: normal"
          >{{ post.title }}</nuxt-link
        >
        <div
          class="font-weight-light text--secondary"
          style="font-size: .6875rem"
        >
          @{{ post.author.username }}
          <span class="font-weight-bold">&middot;</span>
          {{ timeSince }} ago
          <span class="font-weight-bold">&middot;</span>
          {{ post.domain ? post.domain : 'text' }}
          <span class="font-weight-bold">&middot;</span>
          <span
            v-for="topic in post.topics.slice(0, 3)"
            :key="topic.name"
            class="font-weight-medium"
            style="font-size: .75rem"
          >
            [{{ topic.capitalizedName }}]
          </span>
          <span v-if="post.topics.length > 3"
            >+{{ post.topics.length - 3 }} more</span
          >
        </div>
      </div>

      <v-list-item-avatar
        v-if="
          !expanded &&
            post.type === 'LINK' &&
            (post.thumbnailUrl || isTwitterLink)
        "
        tile
        size="48"
        class="mb-0 ml-auto"
      >
        <a :href="post.link" rel="noopener" target="_blank">
          <v-img
            max-width="48"
            height="48"
            :src="isTwitterLink ? twitterbird : post.thumbnailUrl"
          />
        </a>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-text
      v-if="expanded && !isTitleOnlyTextPost && post.type === 'TEXT'"
      class="px-2 py-0"
    >
      <div>
        <TextContent
          v-if="!editing"
          :text-content="post.textContent"
          class="body-2"
        />
        <div v-if="editing">
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
    </v-card-text>

    <v-card-actions class="pt-1">
      <v-row class="mx-0" align="center">
        <div
          class="font-weight-light text--secondary"
          style="font-size: .6875rem; line-height: normal"
        >
          <div>
            {{ post.endorsementCount }} endorsement{{
              post.endorsementCount === 1 ? '' : 's'
            }}
          </div>
          <div>
            {{ post.commentCount }}
            {{ `comment${post.commentCount === 1 ? '' : 's'}` }}
            {{ newCommentsCount > 0 ? `(${newCommentsCount} new)` : '' }}
          </div>
        </div>

        <v-spacer />

        <v-btn icon x-small tile class="pa-3 mr-3" @click.prevent="doNothing">
          <v-icon class="text--secondary">{{ icons.endorse }}</v-icon>
        </v-btn>

        <v-btn icon x-small tile class="pa-3" @click.prevent="doNothing">
          <v-icon class="text--secondary">{{ icons.dots }}</v-icon>
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import isImageUrl from 'is-image-url'
import { Tweet } from 'vue-tweet-embed'
import {
  mdiChevronUp,
  mdiChevronDown,
  mdiRocket,
  mdiDotsVertical
} from '@mdi/js'
import { formatDistanceToNowStrict } from 'date-fns'
import editPostGql from '../gql/editPost.graphql'
import TextContent from './TextContent'

export default {
  name: 'MobilePost',
  components: { TextContent, Tweet },
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
        dots: mdiDotsVertical
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
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.post.createdAt))
    },
    editedTimeSince() {
      if (!this.post.editedAt) return ''
      return formatDistanceToNowStrict(new Date(this.post.editedAt))
    },
    newCommentsCount() {
      if (!this.post.postView) return 0
      return this.post.commentCount - this.post.postView.lastCommentCount
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
    }
  }
}
</script>

<style scoped></style>
