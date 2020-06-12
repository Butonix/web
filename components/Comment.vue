<template>
  <div
    :style="{
      'margin-left': level === 0 ? '0' : '24px'
    }"
  >
    <v-card
      outlined
      class="mb-1 py-1 px-4"
      :style="
        isNew
          ? $vuetify.theme.dark
            ? 'border-color: #FFFFFF'
            : 'border-color: #000000'
          : ''
      "
    >
      <nuxt-link
        v-if="profile"
        :to="`/post/${comment.postId}/${urlName}`"
        class="caption font-weight-medium text--secondary"
        >{{ comment.post.title }}</nuxt-link
      >
      <TextContent :text-content="comment.textContent" class="body-2 comment" />
      <div class="text--secondary">
        <span v-if="isOp" class="overline font-weight-medium text--primary"
          >[OP]&nbsp;</span
        >
        <Username :user-data="comment.author" />
        <span class="caption font-weight-medium ml-3">{{ timeSince }} ago</span>

        <v-btn
          text
          x-small
          class="ml-1 font-weight-medium caption"
          :style="comment.isEndorsed ? 'color: var(--v-primary-base)' : ''"
          style="text-transform: none; font-size: 12px"
          :disabled="currentUser && comment.author.id === currentUser.id"
          @click="toggleEndorsement"
        >
          <span
            v-if="$device.isDesktop"
            class="mr-1"
            :class="
              comment.isEndorsed
                ? ''
                : currentUser && comment.author.id === currentUser.id
                ? ''
                : 'text--secondary'
            "
          >
            {{ comment.endorsementCount }} Endorsement{{
              comment.endorsementCount === 1 ? '' : 's'
            }}
          </span>

          <span v-else> {{ comment.endorsementCount }}&nbsp; </span>

          <v-icon
            x-small
            :style="comment.isEndorsed ? 'color: var(--v-primary-base)' : ''"
            :class="comment.isEndorsed ? '' : 'text--secondary'"
            >{{ icons.star }}</v-icon
          >
        </v-btn>

        <span
          v-if="!profile"
          class="caption font-weight-medium hoverable ml-3"
          @click="replying = !replying"
          >{{ replying ? 'Cancel reply' : 'Reply' }}</span
        >

        <span
          v-if="!profile && comment.childComments.length > 0"
          class="caption font-weight-medium hoverable ml-3"
          @click="childrenCollapsed = !childrenCollapsed"
          >{{ childrenCollapsed ? 'Show replies' : 'Hide replies' }}</span
        >

        <!--Delete-->
        <v-menu v-if="currentUser && comment.author.id === currentUser.id">
          <template v-slot:activator="{ on }">
            <v-btn
              text
              x-small
              class="ml-1 font-weight-medium caption"
              style="text-transform: none; font-size: 12px"
              :disabled="deleted"
              v-on="on"
            >
              <span class="mr-1" :class="deleted ? '' : 'text--secondary'">
                {{ deleted ? 'Deleted' : 'Delete' }}
              </span>
              <v-icon x-small :class="deleted ? '' : 'text--secondary'">{{
                icons.delete
              }}</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-subheader
              >Are you sure you want to delete this comment?</v-subheader
            >
            <v-list-item @click="deleteComment">
              <v-list-item-icon class="mr-3">
                <v-icon>{{ icons.delete }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{
                deleted ? 'Deleted' : 'Delete'
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card>

    <div
      v-if="replying"
      :style="$device.isDesktop ? 'width: 40%' : 'width: 100%'"
    >
      <TextEditor
        v-model="replyText"
        :label="'Write your reply'"
        class="mt-2"
        :rows="3"
        :err="submitCommentErr"
        :show-details="submitCommentErr.length > 0"
      />
      <v-row>
        <v-spacer />
        <v-btn
          depressed
          small
          class="mt-1"
          text
          :loading="loading"
          :disabled="!replyText"
          @click="submitReply"
          >Submit Comment</v-btn
        >
      </v-row>
    </div>

    <div v-show="!childrenCollapsed">
      <Comment
        v-for="c in comment.childComments"
        :key="c.id"
        :post="post"
        :post-view="postView"
        :comment="c"
        :level="level + 1"
        :sort="sort"
      />
    </div>
  </div>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import {
  mdiBookmark,
  mdiComment,
  mdiShareVariant,
  mdiStar,
  mdiTrashCan
} from '@mdi/js'
import toggleCommentEndorsementGql from '../gql/toggleCommentEndorsement.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import postCommentsGql from '../gql/postComments.graphql'
import recordPostViewGql from '../gql/recordPostView.graphql'
import currentUserGql from '../gql/currentUser.graphql'
import deleteCommentGql from '../gql/deleteComment.graphql'
import Username from './Username'
import TextEditor from './TextEditor'
import TextContent from './TextContent'

export default {
  name: 'Comment',
  components: { TextContent, Username, TextEditor },
  props: {
    comment: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    profile: {
      type: Boolean,
      default: false
    },
    post: {
      type: Object,
      required: false,
      default: null
    },
    sort: {
      type: Object,
      required: false,
      default: null
    },
    postView: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      replying: false,
      replyText: '',
      loading: false,
      currentUser: null,
      submitCommentErr: '',
      childrenCollapsed: false,
      deleted: false,
      icons: {
        share: mdiShareVariant,
        // dots: mdiDotsVertical,
        comment: mdiComment,
        star: mdiStar,
        bookmark: mdiBookmark,
        delete: mdiTrashCan
      }
    }
  },
  computed: {
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.comment.createdAt))
    },
    urlName() {
      if (!this.comment.post) return ''
      return this.comment.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
    },
    isNew() {
      if (!this.postView) return false
      return (
        new Date(this.comment.createdAt).getTime() >
        new Date(this.postView.createdAt).getTime()
      )
    },
    isOp() {
      if (!this.post) return false
      return this.comment.author.username === this.post.author.username
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    async deleteComment() {
      if (this.currentUser.id !== this.comment.author.id) return
      this.deleted = true
      await this.$apollo.mutate({
        mutation: deleteCommentGql,
        variables: { commentId: this.comment.id }
      })
    },
    async submitReply() {
      this.loading = true
      try {
        await this.$apollo.mutate({
          mutation: submitCommentGql,
          variables: {
            textContent: this.replyText,
            postId: this.comment.postId,
            parentCommentId: this.comment.id
          },
          update: (store, { data: { submitComment } }) => {
            const data = store.readQuery({
              query: postCommentsGql,
              variables: {
                postId: this.comment.postId,
                sort: this.sort.sort.toUpperCase()
              }
            })
            data.postComments.unshift(submitComment)
            store.writeQuery({
              query: postCommentsGql,
              variables: {
                postId: this.comment.postId,
                sort: this.sort.sort.toUpperCase()
              },
              data
            })
            this.replyText = ''
            this.replying = false
          }
        })
        await this.$apollo.mutate({
          mutation: recordPostViewGql,
          variables: {
            postId: this.comment.postId
          }
        })
      } catch (e) {
        this.submitCommentErr = e.message.split('GraphQL error: ')[1]
      }
      this.loading = false
    },
    async toggleEndorsement() {
      if (!this.currentUser) {
        this.$store.dispatch('showLoginDialog')
        return
      }

      if (this.comment.isEndorsed) {
        this.comment.isEndorsed = false
        this.comment.endorsementCount--
      } else {
        this.comment.isEndorsed = true
        this.comment.endorsementCount++
      }
      await this.$apollo.mutate({
        mutation: toggleCommentEndorsementGql,
        variables: {
          commentId: this.comment.id
        }
      })
    }
  }
}
</script>

<style scoped>
.comment >>> blockquote {
  padding: 0 8px !important;
  margin-left: 5px !important;
  border-left: 2px solid var(--v-primary-base) !important;
}
</style>
