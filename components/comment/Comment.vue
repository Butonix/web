<template>
  <v-card
    v-if="
      !idState.deleted ||
        (comment.childComments && comment.childComments.length > 0)
    "
    :id="comment.id"
    :flat="$vuetify.theme.dark"
    :outlined="!$vuetify.theme.dark"
    :style="{
      'margin-left': level === 0 ? '0' : '29px',
      'border-width': $vuetify.theme.dark || level > 0 ? undefined : '1px',
      'border-left-color': level > 0 ? borderColor : '',
      'border-left-width': level > 0 ? '2px' : '1px',
      'border-left-style': level > 0 || !$vuetify.theme.dark ? 'solid' : 'none',
      'border-top-left-radius': level > 0 ? '0' : '10px',
      'border-bottom-left-radius': level > 0 ? '0' : '10px',
      'border-top-style': level > 0 || $vuetify.theme.dark ? 'none' : 'solid',
      'border-bottom-style':
        level > 0 || $vuetify.theme.dark ? 'none' : 'solid',
      'border-right-style': level > 0 || $vuetify.theme.dark ? 'none' : 'solid'
    }"
  >
    <v-card-text class="text--primary pb-0 pt-3" style="font-size: 1rem">
      <div v-if="idState.editing">
        <div class="overline text--secondary">EDIT</div>
        <div
          class="pt-4 pb-1 px-4"
          :style="{
            'background-color': $vuetify.theme.dark ? '#202124' : '#FFFFFF'
          }"
          style="border-radius: 10px"
        >
          <Editor v-model="idState.editHTML" editable />
          <v-row>
            <v-spacer />
            <v-btn small text color="primary" @click="idState.editing = false"
              >Cancel</v-btn
            >
            <v-btn
              small
              text
              color="primary"
              :loading="idState.editBtnLoading"
              :disabled="isEditEmpty"
              @click="editComment"
              >Done</v-btn
            >
          </v-row>
        </div>
      </div>

      <TextContent
        v-else
        :dark="$vuetify.theme.dark"
        :text-content="comment.textContent"
      />
    </v-card-text>
    <v-card-actions class="px-4">
      <UsernameMenu
        v-if="comment.author && $device.isDesktop"
        :user-data="comment.author"
      />
      <Username
        v-else-if="comment.author && !$device.isDesktop"
        :user-data="comment.author"
      />
      <span v-else-if="!comment.author" class="text--secondary">[deleted]</span>
      <span class="caption text--secondary ml-2">{{ timeSince }}</span>

      <v-spacer />

      <v-btn
        v-if="$device.isDesktop && !idState.replying && comment.author"
        small
        rounded
        text
        class="text--secondary"
        @click="idState.replying = true"
      >
        Reply
        <v-icon size="20" class="ml-2">{{
          $vuetify.icons.values.mdiReply
        }}</v-icon>
      </v-btn>

      <v-btn
        v-if="!$device.isDesktop && !idState.replying && comment.author"
        small
        icon
        class=" text--secondary"
        @click="idState.replying = true"
      >
        <v-icon>{{ $vuetify.icons.values.mdiReply }}</v-icon>
      </v-btn>

      <v-btn
        v-if="comment.author"
        small
        rounded
        text
        class="ml-1 ml-0 "
        :class="comment.isEndorsed ? '' : 'text--secondary'"
        :color="comment.isEndorsed ? 'primary' : ''"
        @click="toggleEndorsement"
      >
        <v-icon size="20" class="mr-2">{{
          $vuetify.icons.values.mdiRocket
        }}</v-icon>
        {{ comment.endorsementCount }}
      </v-btn>

      <v-menu
        v-if="comment.author && comment.author.isCurrentUser"
        transition="slide-y-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn small icon class="text--secondary ml-2" v-on="on">
            <v-icon size="20">{{
              $vuetify.icons.values.mdiDotsVertical
            }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item @click="idState.editing = true">
            <v-list-item-icon>
              <v-icon>{{ $vuetify.icons.values.mdiPencil }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="deleteComment">
            <v-list-item-icon>
              <v-icon>{{ $vuetify.icons.values.mdiTrashCan }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>

    <div v-if="idState.replying" class="px-4 pb-3">
      <div class="overline text--secondary">REPLY</div>
      <div
        style="border-radius: 10px; border-width: 1px; border-color: rgba(0, 0, 0, 0.12);"
        :style="{
          'background-color': $vuetify.theme.dark ? '#202124' : '#FFFFFF',
          'border-style': $vuetify.theme.dark ? 'none' : 'solid'
        }"
        class="pt-4 pb-1 px-4"
      >
        <Editor v-model="idState.replyHTML" editable />
        <v-row>
          <v-spacer />

          <v-btn small text color="primary" @click="idState.replying = false"
            >Cancel</v-btn
          >

          <v-btn
            small
            text
            color="primary"
            :loading="idState.submitBtnLoading"
            :disabled="isReplyEmpty"
            @click="submitReply"
            >Post Reply</v-btn
          >
        </v-row>
      </div>
    </div>

    <div v-show="!idState.childrenCollapsed">
      <Comment
        v-for="c in comment.childComments"
        :key="c.id"
        :post-view="postView"
        :comment="c"
        :level="level + 1"
      />
    </div>
  </v-card>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import { IdState } from 'vue-virtual-scroller'
import UsernameMenu from '../user/UsernameMenu'
import toggleCommentEndorsementGql from '../../gql/toggleCommentEndorsement.graphql'
import Editor from '../editor/Editor'
import submitCommentGql from '../../gql/submitComment.graphql'
import postCommentsGql from '../../gql/postComments.graphql'
import recordPostViewGql from '../../gql/recordPostView.graphql'
import editCommentGql from '../../gql/editComment.graphql'
import { isEditorEmpty } from '../../util/isEditorEmpty'
import deleteCommentGql from '../../gql/deleteComment.graphql'
import { timeSince } from '../../util/timeSince'
import TextContent from '../TextContent'
import Username from '~/components/user/Username'

export default {
  name: 'Comment',
  components: { Username, TextContent, Editor, UsernameMenu },
  mixins: [
    IdState({
      idProp: (vm) => vm.comment.id
    })
  ],
  idState() {
    return {
      replying: false,
      replyHTML: null,
      submitBtnLoading: false,
      editBtnLoading: false,
      childrenCollapsed: false,
      editing: false,
      editHTML: null,
      deleted: false
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    postView: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    level: {
      type: Number,
      default: 0
    }
  },
  computed: {
    timeSince() {
      return this.$device.isDesktop
        ? formatDistanceToNowStrict(new Date(this.comment.createdAt)) + ' ago'
        : timeSince(new Date(this.comment.createdAt))
    },
    isEditEmpty() {
      return isEditorEmpty(this.idState.editHTML)
    },
    isReplyEmpty() {
      return isEditorEmpty(this.idState.replyHTML)
    },
    borderColor() {
      const l = (this.level - 1) % 5
      switch (l) {
        case 0:
          return '#F44336'
        case 1:
          return '#3F51B5'
        case 2:
          return '#009688'
        case 3:
          return '#4CAF50'
        case 4:
          return '#FF9800'
      }
      return '#F44336'
    }
  },
  watch: {
    'idState.editing'(editing) {
      if (editing) this.idState.editHTML = this.comment.textContent
    }
  },
  methods: {
    async deleteComment() {
      const confirmed = window.confirm(
        'Are you sure you want to delete this comment?'
      )
      if (!confirmed) return
      this.comment.textContent = {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ text: '[deleted]', type: 'text' }] }
        ]
      }
      this.comment.authorId = null
      this.comment.author = null
      this.idState.deleted = true
      await this.$apollo.mutate({
        mutation: deleteCommentGql,
        variables: { commentId: this.comment.id }
      })
    },
    async editComment() {
      this.idState.editBtnLoading = true
      await this.$apollo.mutate({
        mutation: editCommentGql,
        variables: {
          commentId: this.comment.id,
          newTextContent: this.idState.editHTML
        }
      })
      this.comment.textContent = this.idState.editHTML
      this.idState.editing = false
      this.idState.editBtnLoading = false
    },
    async submitReply() {
      this.idState.submitBtnLoading = true
      try {
        await this.$apollo.mutate({
          mutation: submitCommentGql,
          variables: {
            textContent: this.idState.replyHTML,
            postId: this.comment.postId,
            parentCommentId: this.comment.id
          },
          update: (store, { data: { submitComment } }) => {
            const data = store.readQuery({
              query: postCommentsGql,
              variables: {
                postId: this.comment.postId
                // sort: this.sort.sort.toUpperCase()
              }
            })
            data.postComments.unshift(submitComment)
            store.writeQuery({
              query: postCommentsGql,
              variables: {
                postId: this.comment.postId
                // sort: this.sort.sort.toUpperCase()
              },
              data
            })
            this.idState.replyHTML = null
            this.idState.replying = false
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
      this.idState.submitBtnLoading = false
    },
    async toggleEndorsement() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this comment'
        })
        return
      }

      if (this.comment.author.isCurrentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Cannot rocket your own comment'
        })
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

<style scoped></style>
