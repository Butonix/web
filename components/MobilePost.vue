<template>
  <v-card
    flat
    :outlined="!isPostView"
    style="background-color: transparent; border-width: 1px; border-radius: 10px"
    :tile="isPostView"
    :ripple="false"
    :class="isPostView ? 'pb-0 px-4 pt-3' : 'pa-2'"
    @click="attemptNavigation"
  >
    <v-list-item style="min-height: 0; align-items: start" class="pa-0">
      <div>
        <div v-if="sticky" class="overline text--secondary">Announcement</div>

        <div
          class="text--primary font-weight-light"
          style="display: block; line-height: normal; font-size: 1.25rem"
          @click="followLink"
        >
          {{ post.title }}
        </div>
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
        v-if="post.type === 'LINK' || post.type === 'IMAGE'"
        tile
        :color="
          isTwitterLink || post.thumbnailUrl
            ? ''
            : `${$vuetify.theme.dark ? '#313235' : 'grey lighten-3'}`
        "
        style="border-radius: 12px"
        size="64"
        class="my-0 ml-auto"
        @click.prevent.stop="openLink"
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
        <v-chip
          outlined
          :color="post.isEndorsed ? 'primary' : ''"
          style="border-width: 1px"
          @click.prevent.stop="toggleEndorsement"
        >
          <v-avatar left class="mr-1">
            <v-icon small>{{ icons.endorse }}</v-icon>
          </v-avatar>
          {{ post.endorsementCount }}
        </v-chip>

        <v-chip
          outlined
          style="border-width: 1px"
          class="ml-2"
          @click="doNothing"
        >
          <v-avatar left class="mr-1">
            <v-icon small>{{ icons.comment }}</v-icon>
          </v-avatar>
          {{ post.commentCount }}
          {{ newCommentsCount > 0 ? `(+${newCommentsCount})` : '' }}
        </v-chip>

        <v-spacer />

        <v-bottom-sheet v-model="menu">
          <template v-slot:activator="{ on }">
            <v-btn icon small v-on="on" @click.stop.prevent="doNothing">
              <v-icon class="text--secondary">{{ icons.dots }}</v-icon>
            </v-btn>
          </template>

          <v-list class="py-0">
            <v-list-item nuxt :to="`/u/${post.author.username}`">
              <v-list-item-icon>
                <v-icon>{{ icons.profile }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  >{{ post.author.username }}'s profile</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ icons.topics }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Topics</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="canShare" @click="share">
              <v-list-item-icon>
                <v-icon>{{ icons.share }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Share</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-else @click="copyLink">
              <v-list-item-icon>
                <v-icon>{{ icons.copy }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Copy Link</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ icons.hide }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Hide</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>{{ icons.report }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Report</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-bottom-sheet>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
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
  mdiAccountOutline,
  mdiEyeOff,
  mdiContentCopy
} from '@mdi/js'
import { formatDistanceToNowStrict } from 'date-fns'
import editPostGql from '../gql/editPost.graphql'
import { timeSince } from '../util/timeSince'
import togglePostEndorsementGql from '../gql/togglePostEndorsement.graphql'
import currentUserGql from '../gql/currentUser.graphql'
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
      currentUser: null,
      menu: false,
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
        profile: mdiAccountOutline,
        hide: mdiEyeOff,
        copy: mdiContentCopy
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
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    doNothing() {},
    followLink() {
      if (!this.isPostView || this.post.type === 'TEXT') return
      window.open(this.post.link, '_blank')
    },
    attemptNavigation() {
      if (this.$route.name !== 'Post') {
        this.$router.push(`/post/${this.post.id}/${this.urlName}`)
      }
    },
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
      this.menu = false
      const url = `https://getcomet.net/post/${this.post.id}/${this.urlName}`
      this.$copyText(url)
      this.$store.dispatch('displaySnackbar', {
        message: 'Copied post link',
        success: true
      })
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
    },
    async toggleEndorsement() {
      if (!this.currentUser) {
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

<style scoped></style>
