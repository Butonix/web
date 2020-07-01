<template>
  <div>
    <v-card
      tile
      flat
      class="py-3 px-4"
      :class="level === 0 ? '' : 'ml-4'"
      :style="{
        'border-left-color': borderColor,
        'border-left-width': '2px',
        'border-left-style': level > 0 ? 'solid' : 'none',
        'background-color': isNew
          ? $vuetify.theme.dark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.12)'
          : 'transparent'
      }"
      @click="expand"
    >
      <div class="text--secondary" style="font-size: .875rem">
        <span class="font-weight-medium">{{ comment.author.username }}</span>
        <span
          >{{ comment.endorsementCount }} rocket{{
            comment.endorsementCount === 1 ? '' : 's'
          }}</span
        >
        <span>{{ timeSince }}</span>
      </div>
      <TextContent
        v-if="!editing"
        :text-content="comment.textContent"
        class="body-2 comment text--primary"
      />
    </v-card>

    <v-expand-transition>
      <div v-if="expanded && $store.state.expandedCommentId === comment.id">
        <v-row class="ma-0">
          <v-btn tile icon class="flex-grow-1">
            <v-icon>{{ icons.endorse }}</v-icon>
          </v-btn>
          <v-btn tile icon class="flex-grow-1">
            <v-icon>{{ icons.reply }}</v-icon>
          </v-btn>
          <v-btn tile icon class="flex-grow-1">
            <v-icon>{{ icons.profile }}</v-icon>
          </v-btn>
        </v-row>
      </div>
    </v-expand-transition>

    <div v-show="!childrenCollapsed">
      <MobileComment
        v-for="c in comment.childComments"
        :key="c.id"
        :post="post"
        :post-view="postView"
        :comment="c"
        :level="level + 1"
        :sort="sort"
      />
    </div>

    <v-divider v-if="level === 0" class="my-0" />
  </div>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import {
  mdiBookmark,
  mdiComment,
  mdiDotsVertical,
  mdiShareVariant,
  mdiStar,
  mdiTrashCan,
  mdiPencil,
  mdiChevronLeft,
  mdiAccountOutline,
  mdiRocket,
  mdiReply
} from '@mdi/js'
import toggleCommentEndorsementGql from '../gql/toggleCommentEndorsement.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import postCommentsGql from '../gql/postComments.graphql'
import recordPostViewGql from '../gql/recordPostView.graphql'
import currentUserGql from '../gql/currentUser.graphql'
import deleteCommentGql from '../gql/deleteComment.graphql'
import editCommentGql from '../gql/editComment.graphql'
import { timeSince } from '../util/timeSince'
import TextContent from './TextContent'

export default {
  name: 'MobileComment',
  components: { TextContent },
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
      expanded: false,
      editing: false,
      newTextContent: this.comment.textContent,
      editBtnLoading: false,
      replying: false,
      replyText: '',
      loading: false,
      currentUser: null,
      submitCommentErr: '',
      childrenCollapsed: false,
      deleted: false,
      icons: {
        share: mdiShareVariant,
        comment: mdiComment,
        star: mdiStar,
        bookmark: mdiBookmark,
        delete: mdiTrashCan,
        dots: mdiDotsVertical,
        edit: mdiPencil,
        cancelDelete: mdiChevronLeft,
        profile: mdiAccountOutline,
        endorse: mdiRocket,
        reply: mdiReply
      }
    }
  },
  computed: {
    expandedCommentId() {
      return this.$store.state.expandedCommentId
    },
    timeSince() {
      return timeSince(new Date(this.comment.createdAt))
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
    },
    borderColor() {
      const l = this.level % 5
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
    expandedCommentId(val) {
      if (val !== this.comment.id) this.expanded = false
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    expand() {
      this.expanded = !this.expanded
      this.$store.commit('setExpandedCommentId', this.comment.id)
    },
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
      if (this.currentUser.id !== this.comment.author.id) return

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
