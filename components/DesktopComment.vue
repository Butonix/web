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
      <TextContent
        v-if="!editing"
        :text-content="comment.textContent"
        class="body-2 comment"
      />
      <div v-if="editing">
        <v-textarea
          v-model="newTextContent"
          rows="2"
          hide-details
          filled
          class="mt-1"
        />
        <v-row class="mx-0 my-2">
          <v-spacer />
          <v-btn
            aria-label="Cancel edit"
            class="mr-1"
            small
            text
            @click="cancelEdit"
            >Cancel</v-btn
          >
          <v-btn
            aria-label="Done editing"
            :loading="editBtnLoading"
            small
            text
            :disabled="newTextContent.length === 0"
            @click="editComment"
            >Done Editing</v-btn
          >
        </v-row>
      </div>
      <div class="text--secondary">
        <span v-if="isOp" class="overline font-weight-medium text--primary"
          >[OP]&nbsp;</span
        >
        <span
          class="caption font-weight-medium ml-1"
          :title="editedTimeSince ? `Edited ${editedTimeSince} ago` : ''"
          >{{ timeSince }}{{ $device.isDesktop ? ' ago' : ''
          }}{{ editedTimeSince ? '*' : '' }}</span
        >

        <v-btn
          aria-label="Endorse Comment"
          text
          x-small
          class="font-weight-medium caption"
          :style="comment.isEndorsed ? 'color: var(--v-primary-base)' : ''"
          style="text-transform: none; font-size: 12px"
          :disabled="comment.author.isCurrentUser"
          @click="toggleEndorsement"
        >
          <span
            v-if="$device.isDesktop"
            class="mr-1"
            :class="
              comment.isEndorsed
                ? ''
                : comment.author.isCurrentUser
                ? ''
                : 'text--secondary'
            "
          >
            {{ comment.endorsementCount }} Endorsement{{
              comment.endorsementCount === 1 ? '' : 's'
            }}
          </span>

          <span
            v-else
            :class="
              comment.isEndorsed
                ? ''
                : comment.author.isCurrentUser
                ? ''
                : 'text--secondary'
            "
          >
            {{ comment.endorsementCount }}&nbsp;
          </span>

          <v-icon
            x-small
            :style="comment.isEndorsed ? 'color: var(--v-primary-base)' : ''"
            :class="comment.isEndorsed ? '' : 'text--secondary'"
            >{{ $vuetify.icons.values.mdiRocket }}</v-icon
          >
        </v-btn>

        <span
          v-if="!profile"
          class="caption font-weight-medium hoverable"
          @click="replying = !replying"
          >{{ replying ? 'Cancel reply' : 'Reply' }}</span
        >

        <span
          v-if="!profile && comment.childComments.length > 0"
          class="ml-1 caption font-weight-medium hoverable"
          @click="childrenCollapsed = !childrenCollapsed"
          >{{
            $device.isDesktop
              ? childrenCollapsed
                ? 'Show replies'
                : 'Hide replies'
              : childrenCollapsed
              ? 'Expand'
              : 'Collapse'
          }}</span
        >

        <span v-if="$device.isDesktop">
          <!--Delete-->
          <v-menu v-if="comment.author.isCurrentUser">
            <template v-slot:activator="{ on }">
              <v-btn
                aria-label="Delete Comment"
                text
                x-small
                class="font-weight-medium caption"
                style="text-transform: none; font-size: 12px"
                :disabled="deleted"
                v-on="on"
              >
                <span class="mr-1" :class="deleted ? '' : 'text--secondary'">
                  {{ deleted ? 'Deleted' : 'Delete' }}
                </span>
                <v-icon x-small :class="deleted ? '' : 'text--secondary'">{{
                  $vuetify.icons.values.mdiTrashCan
                }}</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-subheader
                >Are you sure you want to delete this comment?</v-subheader
              >
              <v-list-item @click="deleteComment">
                <v-list-item-icon class="mr-3">
                  <v-icon>{{ $vuetify.icons.values.mdiTrashCan }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{
                  deleted ? 'Deleted' : 'Delete'
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!--Edit-->
          <span
            v-if="!deleted && comment.author.isCurrentUser"
            class="ml-1 caption font-weight-medium hoverable"
            @click="editing = true"
            >Edit</span
          >
        </span>

        <span v-else>
          <v-menu v-if="post.author.isCurrentUser">
            <template v-slot:activator="{ on }">
              <v-btn
                aria-label="More options"
                text
                x-small
                class="font-weight-medium caption"
                style="text-transform: none; font-size: 12px"
                v-on="on"
              >
                <v-icon x-small>{{
                  $vuetify.icons.values.mdiDotsVertical
                }}</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item :disabled="deleted" @click="deleteComment">
                <v-list-item-icon class="mr-3">
                  <v-icon>{{ $vuetify.icons.values.mdiTrashCan }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{
                  deleted ? 'Deleted' : 'Delete'
                }}</v-list-item-title>
              </v-list-item>

              <v-list-item :disabled="deleted" @click="editing = true">
                <v-list-item-icon class="mr-3">
                  <v-icon>{{ $vuetify.icons.values.mdiPencil }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
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
          aria-label="Submit Comment"
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
      <DesktopComment
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
import toggleCommentEndorsementGql from '../gql/toggleCommentEndorsement.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import postCommentsGql from '../gql/postComments.graphql'
import recordPostViewGql from '../gql/recordPostView.graphql'
import deleteCommentGql from '../gql/deleteComment.graphql'
import editCommentGql from '../gql/editComment.graphql'
import TextEditor from './TextEditor'
import TextContent from './TextContent'

export default {
  name: 'DesktopComment',
  components: { TextContent, TextEditor },
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
      editing: false,
      newTextContent: this.comment.textContent,
      editBtnLoading: false,
      replying: false,
      replyText: '',
      loading: false,
      submitCommentErr: '',
      childrenCollapsed: false,
      deleted: false
    }
  },
  computed: {
    timeSince() {
      return formatDistanceToNowStrict(new Date(this.comment.createdAt))
    },
    editedTimeSince() {
      if (!this.comment.editedAt) return ''
      return formatDistanceToNowStrict(new Date(this.comment.editedAt))
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
  methods: {
    cancelEdit() {
      this.editing = false
      this.newTextContent = this.comment.textContent
    },
    async editComment() {
      if (this.newTextContent.length === 0) return
      this.editBtnLoading = true
      await this.$apollo.mutate({
        mutation: editCommentGql,
        variables: {
          commentId: this.comment.id,
          newTextContent: this.newTextContent
        }
      })
      this.comment.textContent = this.newTextContent
      this.editing = false
      this.editBtnLoading = false
    },
    async deleteComment() {
      if (this.$store.state.currentUser.id !== this.comment.author.id) return

      if (!this.$device.isDesktop) {
        if (!process.client) return
        const confirmed = window.confirm(
          'Are you sure you want to delete this comment?'
        )
        if (!confirmed) return
      }

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
      if (!this.$store.state.currentUser) {
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
