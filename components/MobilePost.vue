<template>
  <v-card
    v-show="!post.hidden || $route.name.startsWith('Post')"
    flat
    :outlined="!isPostView"
    style="background-color: transparent"
    :tile="isPostView"
    :to="isPostView ? '' : `/post/${post.id}/${urlName}`"
    :ripple="false"
    :class="isPostView ? 'pb-2 px-3 pt-3' : 'pa-2'"
  >
    <v-list-item style="min-height: 0; align-items: start" class="pa-0">
      <div>
        <div v-if="sticky" class="overline text--secondary">Announcement</div>

        <nuxt-link
          :to="`/post/${post.id}/${urlName}`"
          class="text--primary font-weight-light"
          style="display: block; line-height: normal; font-size: 1.25rem"
          >{{ post.title }}</nuxt-link
        >
        <div class="text--secondary" style="font-size: .875rem">
          {{ post.author.username }}
          <span class="font-weight-bold">&middot;</span>
          {{ timeSince }}
          <span class="font-weight-bold">&middot;</span>
          <span
            v-for="topic in post.topics"
            :key="topic.name"
            class="font-weight-medium primary--text"
          >
            [{{ topic.capitalizedName }}]
          </span>
          <span v-if="post.domain"
            >({{ post.domain ? post.domain : 'text' }})</span
          >
        </div>
      </div>

      <v-list-item-avatar
        v-if="post.type === 'LINK'"
        tile
        :color="
          isTwitterLink || post.thumbnailUrl
            ? ''
            : `${$vuetify.theme.dark ? '#212121' : 'grey lighten-3'}`
        "
        style="border-radius: 12px"
        size="64"
        class="my-0 ml-auto"
        @click.prevent="openLink"
      >
        <a :href="post.link" rel="noopener" target="_blank">
          <v-img
            v-if="post.thumbnailUrl || isTwitterLink"
            max-width="64"
            height="64"
            :src="isTwitterLink ? twitterbird : post.thumbnailUrl"
          />
          <v-icon v-else large>{{ icons.link }}</v-icon>
        </a>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-text
      v-if="expanded && !isTitleOnlyTextPost && post.type === 'TEXT'"
      class="pa-0"
    >
      <div class="pt-3">
        <TextContent
          v-if="!editing"
          :text-content="post.textContent"
          class="body-2 text--primary"
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

    <v-card-actions class="pt-3 pb-0 px-0">
      <v-row class="mx-0" align="center">
        <!--<div
          class="text&#45;&#45;secondary"
          style="font-size: .875rem; line-height: normal"
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
        </div>-->

        <v-btn
          small
          outlined
          rounded
          class="betterbutton"
          :style="
            $vuetify.theme.dark
              ? 'border-color: rgba(255, 255, 255, 0.12);'
              : 'border-color: rgba(0, 0, 0, 0.12);'
          "
        >
          <v-icon small class="mr-2">{{ icons.endorse }}</v-icon>
          {{ post.endorsementCount }}
        </v-btn>

        <v-btn
          small
          outlined
          rounded
          class="betterbutton ml-2"
          :style="
            $vuetify.theme.dark
              ? 'border-color: rgba(255, 255, 255, 0.12);'
              : 'border-color: rgba(0, 0, 0, 0.12);'
          "
        >
          <v-icon small class="mr-2">{{ icons.comment }}</v-icon>
          {{ post.commentCount }}
          {{ newCommentsCount > 0 ? `(+${newCommentsCount})` : '' }}
        </v-btn>

        <v-spacer />

        <v-menu bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon small v-on="on" @click.stop.prevent="doNothing">
              <v-icon class="text--secondary">{{ icons.dots }}</v-icon>
            </v-btn>
          </template>

          <v-list class="py-0">
            <v-list-item v-if="canShare" @click="share">
              <v-list-item-icon class="my-2">
                <v-icon>{{ icons.share }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="py-2">
                <v-list-item-title>Share</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-else @click="copyLink">
              <v-list-item-icon class="my-2">
                <v-icon>{{ icons.copy }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="py-2">
                <v-list-item-title>Copy Link</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon class="my-2">
                <v-icon>{{ icons.report }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="py-2">
                <v-list-item-title>Report</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon class="my-2">
                <v-icon>{{ icons.topics }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="py-2">
                <v-list-item-title>Topics</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="`/user/@${post.author.username}`">
              <v-list-item-icon class="my-2">
                <v-icon>{{ icons.profile }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="py-2">
                <v-list-item-title
                  >{{ post.author.username }}'s profile</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import isImageUrl from 'is-image-url'
import {
  mdiChevronUp,
  mdiChevronDown,
  mdiRocket,
  mdiDotsVertical,
  mdiWeb,
  mdiCommentOutline,
  mdiShareOutline,
  mdiNewspaper,
  mdiAlertOctagonOutline,
  mdiAccountOutline
} from '@mdi/js'
import { formatDistanceToNowStrict } from 'date-fns'
import editPostGql from '../gql/editPost.graphql'
import { timeSince } from '../util/timeSince'
import TextContent from './TextContent'

export default {
  name: 'MobilePost',
  components: { TextContent },
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
        dots: mdiDotsVertical,
        link: mdiWeb,
        comment: mdiCommentOutline,
        share: mdiShareOutline,
        topics: mdiNewspaper,
        report: mdiAlertOctagonOutline,
        profile: mdiAccountOutline
      },
      twitterbird: require('~/assets/twitterbird.jpg')
    }
  },
  computed: {
    canShare() {
      return process.client && navigator.share
    },
    urlName() {
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    },
    timeSince() {
      return timeSince(new Date(this.post.createdAt))
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
    share() {
      if (!this.canShare) return
      const url = `https://getcomet.net/post/${this.post.id}/${this.urlName}`
      navigator.share({
        title: `"${this.post.title}" on Comet`,
        text: `"${this.post.title}" on Comet`,
        url
      })
    },
    copyLink() {
      const url = `https://getcomet.net/post/${this.post.id}/${this.urlName}`
      this.$copyText(url)
      this.$store.dispatch('displaySnackbar', 'Copied post link')
    },
    openLink() {
      window.open(this.post.link, '_blank')
    },
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
