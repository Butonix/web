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
      <div
        class="body-2 comment"
        style="font-family: 'Open Sans', sans-serif !important"
        v-html="textContents"
      />
      <div class="text--secondary">
        <span v-if="isOp" class="overline font-weight-medium text--primary"
          >[OP]&nbsp;</span
        >
        <Username :user="comment.author" />
        <span class="caption font-weight-medium ml-3">{{ timeSince }} ago</span>
        <span
          v-if="!comment.author.isCurrentUser"
          class="caption ml-3 hoverable font-weight-medium"
          :style="{ 'font-style': comment.isEndorsed ? 'italic' : 'normal' }"
          @click="toggleEndorsement"
        >
          {{ comment.isEndorsed ? 'Endorsed!' : 'Endorse' }} ({{
            comment.endorsementCount
          }})
        </span>
        <span v-else class="caption ml-3 font-weight-medium"
          >{{ comment.endorsementCount }} Endorsement{{
            comment.endorsementCount === 1 ? '' : 's'
          }}</span
        >
        <span
          v-if="!profile"
          class="caption font-weight-medium hoverable ml-3"
          @click="replying = !replying"
          >{{ replying ? 'Cancel reply' : 'Reply' }}</span
        >
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

    <Comment
      v-for="c in comment.childComments"
      :key="c.id"
      :post="post"
      :post-view="postView"
      :comment="c"
      :level="level + 1"
    />
  </div>
</template>

<script>
import marked from 'marked'
import { formatDistanceToNowStrict } from 'date-fns'
import xss from 'xss'
import toggleCommentEndorsementGql from '../gql/toggleCommentEndorsement.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import postCommentsGql from '../gql/postComments.graphql'
import postViewGql from '../gql/postView.graphql'
import { escapeHtml } from '../util/escapeHtml'
import Username from './Username'
import TextEditor from './TextEditor'

export default {
  name: 'Comment',
  components: { Username, TextEditor },
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
      required: false
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
      loading: false
    }
  },
  computed: {
    textContents() {
      return this.comment.textContent
        ? xss(marked(escapeHtml(this.comment.textContent)))
        : undefined
    },
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.comment.createdAt))
    },
    urlName() {
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
  methods: {
    async submitReply() {
      this.loading = true
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
            variables: { postId: this.comment.postId }
          })
          data.postComments.unshift(submitComment)
          store.writeQuery({
            query: postCommentsGql,
            variables: { postId: this.comment.postId },
            data
          })
          this.replyText = ''
          this.replying = false
        }
      })
      await this.$apollo.mutate({
        mutation: postViewGql,
        variables: {
          postId: this.comment.postId
        }
      })
      this.loading = false
    },
    async toggleEndorsement() {
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
        },
        update: (store, { data: { toggleCommentEndorsement } }) => {
          const data = store.readQuery({
            query: postCommentsGql,
            variables: { postId: this.comment.postId }
          })
          const index = data.postComments.findIndex(
            (comment) => comment.id === this.comment.id
          )
          data.postComments[index].isEndorsed = toggleCommentEndorsement
          store.writeQuery({
            query: postCommentsGql,
            variables: { postId: this.comment.postId },
            data
          })
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
