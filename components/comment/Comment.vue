<template>
  <div
    v-if="
      !idState.deleted ||
        (comment.childComments && comment.childComments.length > 0)
    "
    :id="comment.id"
    :style="{
      'border-color': $vuetify.theme.dark
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)',
      'border-width': '1px',
      'border-radius': $device.isDesktop && level === 0 ? '10px' : '0',
      'border-left-style': $device.isDesktop && level === 0 ? 'solid' : 'none',
      'border-right-style': $device.isDesktop && level === 0 ? 'solid' : 'none',
      'border-bottom-style':
        $device.isDesktop && level === 0 ? 'solid' : 'none',
      'border-top-style': $device.isDesktop && level === 0 ? 'solid' : 'none'
    }"
  >
    <div
      :style="{
        'padding-left': 10 * level + 'px',
        'background-color': $vuetify.theme.dark
          ? idState.expanded && !$device.isDesktop
            ? '#35363A'
            : '#202124'
          : idState.expanded && !$device.isDesktop
          ? '#DEE1E6'
          : '#F8F9FA',
        'border-radius': $device.isDesktop ? '9px' : '0'
      }"
    >
      <div
        :style="{
          'border-left-color': borderColor,
          'border-left-width': '2px',
          'border-left-style': level > 0 ? 'solid' : 'none',
          'background-color': 'transparent'
        }"
        @click.stop.prevent="idState.expanded = !idState.expanded"
      >
        <v-card-text
          class="text--primary pt-3 pb-0 px-3"
          style="font-size: 1rem"
        >
          <div v-if="showPostTitle" class="mb-1">
            <nuxt-link
              :to="`/p/${comment.post.id}/${postUrlName}`"
              class="font-weight-medium text--secondary"
              style="font-size: 0.86rem"
              >{{ comment.post.title }}</nuxt-link
            >
          </div>

          <TextContent
            :dark="$vuetify.theme.dark"
            :text-content="comment.textContent"
          />
        </v-card-text>

        <v-card-actions class="px-3 pb-3 pt-2">
          <UsernameMenu
            v-if="comment.author"
            :user-data="comment.author"
            :op="post && post.author.id === comment.author.id"
          />
          <span v-else-if="!comment.author" class="text--secondary"
            >[deleted]</span
          >

          <span
            :title="editedTimeSince"
            class="text--secondary ml-2"
            style="font-size: 0.86rem"
            >{{ timeSince }}{{ editedTimeSince ? '*' : '' }}</span
          >

          <span
            v-if="!$device.isDesktop"
            class="ml-3"
            :class="comment.isEndorsed ? 'primary--text' : 'text--secondary'"
            style="font-size: 0.86rem; font-weight: 500"
          >
            {{ comment.endorsementCount }}
            <v-icon
              size="16"
              :class="comment.isEndorsed ? 'primary--text' : 'text--secondary'"
              style="padding-bottom: 3px"
              >{{ $vuetify.icons.values.mdiRocket }}</v-icon
            >
          </span>

          <span
            v-if="isNew"
            class="ml-3 primary--text"
            style="font-size: 0.86rem"
            >New</span
          >

          <template v-if="$device.isDesktop">
            <v-spacer />

            <v-btn
              small
              text
              rounded
              class="text--secondary"
              @click="idState.replying = !idState.replying"
            >
              <v-icon class="mr-2" size="20">{{
                $vuetify.icons.values.mdiReply
              }}</v-icon>
              Reply
            </v-btn>

            <v-btn
              small
              text
              rounded
              :class="comment.isEndorsed ? 'primary--text' : 'text--secondary'"
              :style="cssVars"
              :ripple="false"
              @click="toggleEndorsement"
            >
              <AnimatedRocket class="mr-2" :item="comment" />
              {{ comment.endorsementCount }}
            </v-btn>
          </template>
        </v-card-actions>
      </div>
      <client-only v-if="$device.isDesktop">
        <div v-if="idState.replying" class="pa-3">
          <Editor
            v-model="idState.replyHTML"
            show-cancel-btn
            :loading="idState.submitBtnLoading"
            @cancelled="idState.replying = false"
            @submitted="submitReply"
          />
        </div>
      </client-only>
    </div>

    <div
      v-show="idState.expanded"
      v-if="!$device.isDesktop"
      style="display: flex"
    >
      <v-btn text tile class="flex-grow-1" @click="openReplyDialog">
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiReply }}</v-icon>
        Reply
      </v-btn>

      <v-btn
        text
        tile
        class="flex-grow-1"
        :class="comment.isEndorsed ? 'primary&#45;&#45;text' : ''"
        @click="toggleEndorsement"
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiRocket }}</v-icon>
        {{ comment.endorsementCount }} Rocket{{
          comment.endorsementCount === 1 ? '' : 's'
        }}
      </v-btn>
    </div>

    <div v-show="!idState.childrenCollapsed">
      <Comment
        v-for="c in comment.childComments"
        :key="c.id"
        :post-view="postView"
        :post="post"
        :comment="c"
        :level="level + 1"
        @startreply="handleStartReply"
      />
    </div>
  </div>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
import { IdState } from 'vue-virtual-scroller'
import UsernameMenu from '../user/UsernameMenu'
import toggleCommentEndorsementGql from '../../gql/toggleCommentEndorsement.graphql'
import submitCommentGql from '../../gql/submitComment.graphql'
import postCommentsGql from '../../gql/postComments.graphql'
import recordPostViewGql from '../../gql/recordPostView.graphql'
import editCommentGql from '../../gql/editComment.graphql'
import deleteCommentGql from '../../gql/deleteComment.graphql'
import TextContent from '../TextContent'
import { isEditorEmpty } from '@/util/isEditorEmpty'
import { timeSince } from '@/util/timeSince'
import { urlName } from '@/util/urlName'
import AnimatedRocket from '@/components/AnimatedRocket'

export default {
  name: 'Comment',
  components: {
    AnimatedRocket,
    TextContent,
    Editor: () => import('@/components/editor/Editor'),
    UsernameMenu
  },
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
      deleted: false,
      expanded: false,
      replyDialog: false
    }
  },
  props: {
    showPostTitle: {
      type: Boolean,
      default: false
    },
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
    },
    post: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    timeSince() {
      return this.$device.isDesktop
        ? formatDistanceToNowStrict(new Date(this.comment.createdAt)) + ' ago'
        : timeSince(new Date(this.comment.createdAt))
    },
    postUrlName() {
      if (!this.comment.post) return ''
      return urlName(this.comment.post.title)
    },
    isEditEmpty() {
      return isEditorEmpty(this.idState.editHTML)
    },
    isReplyEmpty() {
      return isEditorEmpty(this.idState.replyHTML)
    },
    editedTimeSince() {
      if (!this.comment.editedAt) return ''
      return (
        'Edited ' +
        formatDistanceToNowStrict(new Date(this.comment.editedAt)) +
        ' ago'
      )
    },
    isNew() {
      if (!this.postView) return false
      return (
        new Date(this.comment.createdAt) > new Date(this.postView.createdAt)
      )
    },
    expandedCommentId: {
      get() {
        return this.$store.state.expandedCommentId
      },
      set(val) {
        this.$store.commit('setExpandedCommentId', val)
      }
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
    },
    cssVars() {
      return {
        '--theme-color': this.post.planet.themeColor
          ? this.post.planet.themeColor
          : '#EF5350'
      }
    }
  },
  watch: {
    'idState.editing'(editing) {
      if (editing) this.idState.editHTML = this.comment.textContent
    },
    'idState.expanded'(expanded) {
      if (!expanded) return
      this.expandedCommentId = this.comment.id
    },
    expandedCommentId(id) {
      if (id !== this.comment.id) this.idState.expanded = false
    },
    $route: {
      deep: true,
      handler() {
        if (!this.$route.query || !this.$route.query.replying) {
          this.idState.replyDialog = false
        }
      }
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.replying) {
      const query = Object.assign({}, this.$route.query)
      delete query.replying
      this.$router.push({ path: this.$route.path, query })
    }
  },
  methods: {
    handleStartReply(e) {
      this.$emit('startreply', e)
    },
    openReplyDialog() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to reply'
        })
        return
      }
      this.$emit('startreply', this.comment)
    },
    closeReplyDialog() {
      if (!this.isReplyEmpty) {
        const confirmed = window.confirm(
          'Are you sure you want to discard this reply?'
        )
        if (!confirmed) return
      }
      this.idState.replyDialog = false
      const query = Object.assign({}, this.$route.query)
      delete query.replying
      this.$router.push({ path: this.$route.path, query })
      this.idState.replyHTML = null
    },
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
            this.idState.replyDialog = false
            if (!this.comment.childComments) this.comment.childComments = []
            this.comment.childComments.unshift(submitComment)
          }
        })
        this.idState.replying = false
      } catch (e) {
        await this.$store.dispatch('displaySnackbar', {
          message: e.message.split('GraphQL error: ')[1]
        })
      }
      this.$apollo.mutate({
        mutation: recordPostViewGql,
        variables: {
          postId: this.comment.postId
        }
      })
      this.idState.submitBtnLoading = false
    },
    async toggleEndorsement() {
      this.idState.expanded = false

      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this comment'
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
