<template>
  <span class="text--secondary">
    <Username :user-data="post.author" />
    <span class="ml-3 caption font-weight-medium">{{ timeSince }} ago</span>

    <!--Comment-->
    <v-btn
      :to="`/post/${post.id}/${urlName}`"
      nuxt
      text
      x-small
      class="ml-1 font-weight-medium caption text--secondary"
      style="text-transform: none; font-size: 12px"
    >
      <span v-if="$device.isDesktop" class="mr-1 text--secondary">
        {{ post.commentCount }}
        {{ `Comment${post.commentCount === 1 ? '' : 's'}` }}
        {{ newCommentsCount > 0 ? `(${newCommentsCount} new)` : '' }}
      </span>

      <span v-else>
        {{ post.commentCount }}
        {{ newCommentsCount > 0 ? `(+${newCommentsCount})` : '' }}
        &nbsp;
      </span>

      <v-icon x-small class="text--secondary">{{ icons.comment }}</v-icon>
    </v-btn>

    <!--Endorse-->
    <v-btn
      text
      x-small
      class="ml-1 font-weight-medium caption"
      :style="post.isEndorsed ? 'color: var(--v-primary-base)' : ''"
      style="text-transform: none; font-size: 12px"
      :disabled="currentUser && post.author.id === currentUser.id"
      @click="toggleEndorsement"
    >
      <span
        v-if="$device.isDesktop"
        class="mr-1"
        :class="
          post.isEndorsed
            ? ''
            : currentUser && post.author.id === currentUser.id
            ? ''
            : 'text--secondary'
        "
      >
        {{ post.endorsementCount }} Endorsement{{
          post.endorsementCount === 1 ? '' : 's'
        }}
      </span>

      <span
        v-else
        :class="
          post.isEndorsed
            ? ''
            : currentUser && post.author.id === currentUser.id
            ? ''
            : 'text--secondary'
        "
      >
        {{ post.endorsementCount }}&nbsp;
      </span>

      <v-icon
        x-small
        :style="post.isEndorsed ? 'color: var(--v-primary-base)' : ''"
        :class="post.isEndorsed ? '' : 'text--secondary'"
        >{{ icons.star }}</v-icon
      >
    </v-btn>

    <!--Share-->
    <v-btn
      text
      x-small
      class="ml-1 font-weight-medium caption"
      style="text-transform: none; font-size: 12px"
      @click.prevent="sharePost"
    >
      <span v-if="$device.isDesktop" class="mr-1 text--secondary">
        Share
      </span>

      <v-icon x-small class="text--secondary">{{ icons.share }}</v-icon>
    </v-btn>

    <!--Hide-->
    <v-btn
      v-if="!sticky"
      text
      x-small
      class="ml-1 font-weight-medium caption"
      style="text-transform: none; font-size: 12px"
      @click="toggleHide"
    >
      <span v-if="$device.isDesktop" class="mr-1 text--secondary">
        {{ hidden ? 'Unhide' : 'Hide' }}
      </span>

      <v-icon x-small class="text--secondary">{{
        hidden ? icons.eye : icons.eyeOff
      }}</v-icon>
    </v-btn>
  </span>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import {
  mdiShareVariant,
  mdiComment,
  mdiStar,
  mdiBookmark,
  mdiEyeOff,
  mdiEye
} from '@mdi/js'
import togglePostEndorsementGql from '../gql/togglePostEndorsement.graphql'
import postGql from '../gql/post.graphql'
import currentUserGql from '../gql/currentUser.graphql'
import hidePostGql from '../gql/hidePost.graphql'
import unhidePostGql from '../gql/unhidePost.graphql'
import Username from './Username'

export default {
  name: 'PostActions',
  components: { Username },
  props: {
    post: {
      type: Object,
      required: true
    },
    postView: {
      type: Object,
      required: false,
      default: null
    },
    sticky: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hidden: this.post.isHidden,
      currentUser: null,
      icons: {
        share: mdiShareVariant,
        comment: mdiComment,
        star: mdiStar,
        bookmark: mdiBookmark,
        eyeOff: mdiEyeOff,
        eye: mdiEye
      }
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
    newCommentsCount() {
      if (!this.postView) return 0
      return this.post.commentCount - this.postView.lastCommentCount
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    async toggleEndorsement() {
      if (!this.currentUser) {
        this.$store.dispatch('showLoginDialog')
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
        },
        update: (store, { data: { togglePostEndorsement } }) => {
          try {
            const data = store.readQuery({
              query: postGql,
              variables: { postId: this.postId }
            })
            data.post.isEndorsed = togglePostEndorsement
            store.writeQuery({
              query: postGql,
              variables: { postId: this.postId },
              data
            })
          } catch (e) {}
        }
      })
    },
    toggleHide() {
      if (this.hidden) this.unhidePost()
      else this.hidePost()
    },
    hidePost() {
      this.hidden = true
      this.$apollo.mutate({
        mutation: hidePostGql,
        variables: {
          postId: this.post.id
        }
      })
    },
    unhidePost() {
      this.hidden = false
      this.$apollo.mutate({
        mutation: unhidePostGql,
        variables: {
          postId: this.post.id
        }
      })
    },
    sharePost() {
      if (!process.client) return
      const url = `https://getcomet.net/post/${this.post.id}/${this.urlName}`
      if (navigator.share) {
        navigator.share({
          title: `"${this.post.title}" on Comet`,
          text: `"${this.post.title}" on Comet`,
          url
        })
      } else {
        this.$copyText(url)
        this.$store.dispatch('displaySnackbar', 'Copied post link')
      }
    }
  }
}
</script>

<style scoped></style>
