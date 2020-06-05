<template>
  <span class="text--secondary">
    <Username :user="post.author" />
    <span class="ml-3 caption font-weight-medium">{{ timeSince }} ago</span>

    <!--Comment-->
    <v-btn
      :to="`/post/${post.id}/${urlName}`"
      nuxt
      text
      x-small
      class="ml-1 font-weight-medium caption text--secondary"
      style="text-transform: none; font-size: 12px"
      @click="toggleEndorsement"
    >
      <span v-if="$breakpoint.mdAndUp" class="mr-1 text--secondary">
        {{ post.commentCount }}
        {{
          $breakpoint.mdAndUp
            ? `Comment${post.commentCount === 1 ? '' : 's'}`
            : ''
        }}
      </span>

      <span v-else>
        {{ post.commentCount }}
      </span>

      <v-icon x-small class="text--secondary">mdi-comment</v-icon>
    </v-btn>

    <!--Endorse-->
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <span v-on="post.author.isCurrentUser ? on : undefined">
          <v-btn
            text
            x-small
            class="ml-1 font-weight-medium caption"
            :style="post.isEndorsed ? 'color: var(--v-primary-base)' : ''"
            style="text-transform: none; font-size: 12px"
            :disabled="post.author.isCurrentUser"
            @click="toggleEndorsement"
          >
            <span
              v-if="$breakpoint.mdAndUp"
              class="mr-1"
              :class="post.isEndorsed ? '' : 'text--secondary'"
            >
              {{ post.endorsementCount }}
              {{
                $breakpoint.mdAndUp
                  ? `Endorsement${post.endorsementCount === 1 ? '' : 's'}`
                  : ''
              }}
            </span>

            <span v-else>
              {{ post.endorsementCount }}
            </span>

            <v-icon
              x-small
              :style="post.isEndorsed ? 'color: var(--v-primary-base)' : ''"
              :class="post.isEndorsed ? '' : 'text--secondary'"
              >mdi-star</v-icon
            >
          </v-btn>
        </span>
      </template>
      <span v-if="post.author.isCurrentUser"
        >Cannot endorse your own posts</span
      >
    </v-tooltip>

    <!--Bookmark-->
    <v-btn
      text
      x-small
      class="ml-1 font-weight-medium caption"
      :style="post.isBookmarked ? 'color: var(--v-primary-base)' : ''"
      style="text-transform: none; font-size: 12px"
      @click.prevent="post.isBookmarked = !post.isBookmarked"
    >
      <span
        v-if="$breakpoint.mdAndUp"
        class="mr-1"
        :class="post.isBookmarked ? '' : 'text--secondary'"
      >
        {{ post.isBookmarked ? 'Bookmarked' : 'Bookmark' }}
      </span>

      <v-icon
        x-small
        :style="post.isBookmarked ? 'color: var(--v-primary-base)' : ''"
        :class="post.isBookmarked ? '' : 'text--secondary'"
        >mdi-bookmark</v-icon
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
      <span v-if="$breakpoint.mdAndUp" class="mr-1 text--secondary">
        Share
      </span>

      <v-icon x-small class="text--secondary">mdi-share-variant</v-icon>
    </v-btn>

    <!--Hide/Report-->
    <span v-if="$breakpoint.mdAndUp">
      <span v-if="!post.author.isCurrentUser">
        <span
          v-if="!hiding"
          class="caption ml-3 hoverable font-weight-regular"
          @click="hiding = true"
          >Hide</span
        >
        <span
          v-else-if="hidden"
          class="caption ml-3 font-weight-medium font-italic"
          >Hidden</span
        >
        <span v-else class="caption ml-3 font-weight-medium">
          <span class="font-weight-medium">
            Hide this post? You won't see it again.
          </span>
          <span class="hoverable font-weight-medium" @click="hidePost"
            >Yes</span
          >
          /
          <span class="hoverable font-weight-medium" @click="hiding = false"
            >No</span
          >
        </span>
      </span>
      <span v-if="!post.author.isCurrentUser">
        <span
          v-if="!reporting"
          class="caption ml-3 hoverable font-weight-regular"
          @click="reporting = true"
          >Report</span
        >
        <span
          v-else-if="reported"
          class="caption ml-3 font-weight-medium font-italic"
          >Reported</span
        >
        <span v-else class="caption ml-3 font-weight-medium">
          <span class="font-weight-medium">
            Report this post to Comet admins?
          </span>
          <span class="hoverable font-weight-medium" @click="reportPost"
            >Yes</span
          >
          /
          <span class="hoverable font-weight-medium" @click="reporting = false"
            >No</span
          >
        </span>
      </span>
    </span>

    <!--Hide/Report mobile menu-->
    <v-btn
      text
      x-small
      class="ml-1 font-weight-medium caption"
      style="text-transform: none; font-size: 12px"
    >
      <v-icon x-small class="text--secondary">mdi-dots-vertical</v-icon>
    </v-btn>
  </span>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import togglePostEndorsementGql from '../gql/togglePostEndorsement.graphql'
import postGql from '../gql/post.graphql'
import Username from './Username'

export default {
  name: 'PostActions',
  components: { Username },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hiding: false,
      hidden: false,
      reporting: false,
      reported: false
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
    }
  },
  methods: {
    async toggleEndorsement() {
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
    hidePost() {
      this.hidden = true
    },
    reportPost() {
      this.reported = true
    },
    sharePost() {
      if (navigator.share) {
        navigator.share({
          title: `"${this.post.title}" on Comet`,
          text: `"${this.post.title}" on Comet`,
          url: `https://getcomet.net/post/${this.post.id}/${this.urlName}`
        })
      }
    }
  }
}
</script>

<style scoped></style>
