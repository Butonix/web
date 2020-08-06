<template>
  <div
    v-if="
      !deleted || (comment.childComments && comment.childComments.length > 0)
    "
  >
    <div
      :style="{
        'padding-left': comment.level ? 10 * comment.level + 'px' : '0',
        'background-color': $vuetify.theme.dark
          ? expanded && !$device.isDesktop
            ? '#35363A'
            : '#202124'
          : expanded && !$device.isDesktop
          ? '#DEE1E6'
          : '#F8F9FA',
        'border-radius': $device.isDesktop ? '10px' : '0'
      }"
    >
      <div
        :style="{
          'border-left-color': borderColor,
          'border-left-width': '2px',
          'border-left-style': comment.level
            ? comment.level > 0
              ? 'solid'
              : 'none'
            : 'none',
          'background-color': 'transparent'
        }"
        @click="expanded = !expanded"
      >
        <v-card-text
          class="text--primary pt-3 pb-0 px-3"
          style="font-size: 1rem"
        >
          <div v-if="showPostTitle" class="mb-1">
            <nuxt-link
              event=""
              :to="
                `/p/${comment.post.planet.name}/comments/${comment.post.id}/${postUrlName}`
              "
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
            :op="
              comment.post &&
                comment.post.author &&
                comment.post.author.id === comment.author.id
            "
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
            :class="isEndorsed ? 'primary--text' : 'text--secondary'"
            style="font-size: 0.86rem; font-weight: 500; display: inline-flex; align-items: center"
            :style="cssVars"
          >
            <span>
              {{ endorsementCount }}
            </span>
            <AnimatedRocket
              :key="comment.id"
              :item="{ id: comment.id, isEndorsed }"
              :size="16"
              :style="cssVars"
              class="ml-1"
            />
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
              v-if="!hideReply"
              small
              text
              rounded
              class="text--secondary"
              @click="replying = !replying"
            >
              <v-icon class="mr-2" size="20">{{
                $vuetify.icons.values.mdiReply
              }}</v-icon>
              Reply
            </v-btn>

            <v-btn
              :ripple="false"
              class="px-2"
              small
              rounded
              text
              :class="isEndorsed ? '' : 'text--secondary'"
              :title="
                `${endorsementCount} Rocket${endorsementCount === 1 ? '' : 's'}`
              "
              :style="cssVars"
              @click.stop.prevent="toggleEndorsement"
            >
              <AnimatedRocket
                :key="comment.id"
                class="mr-2"
                :item="{ id: comment.id, isEndorsed }"
              />
              <span :style="isEndorsed ? 'color: var(--theme-color)' : ''">{{
                endorsementCount
              }}</span>
            </v-btn>
          </template>
        </v-card-actions>
      </div>
      <client-only v-if="$device.isDesktop">
        <div v-if="replying" class="pa-3">
          <Editor
            v-model="replyHTML"
            show-cancel-btn
            :loading="submitBtnLoading"
            @cancelled="replying = false"
            @submitted="submitReply"
          />
        </div>
      </client-only>
    </div>

    <div v-show="expanded" v-if="!$device.isDesktop" style="display: flex">
      <v-btn text tile class="flex-grow-1" @click="openReplyDialog">
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiReply }}</v-icon>
        Reply
      </v-btn>

      <v-btn
        text
        tile
        class="flex-grow-1"
        :class="isEndorsed ? 'primary--text' : ''"
        @click="toggleEndorsement"
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiRocket }}</v-icon>
        {{ endorsementCount }} Rocket{{ endorsementCount === 1 ? '' : 's' }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { formatDistanceToNowStrict } from 'date-fns'
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
  props: {
    showPostTitle: {
      type: Boolean,
      default: false
    },
    comment: {
      type: Object,
      required: true
    },
    hideReply: {
      type: Boolean,
      default: false
    }
  },
  data() {
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
      isEndorsed: this.comment.isEndorsed,
      endorsementCount: this.comment.endorsementCount
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
      return isEditorEmpty(this.editHTML)
    },
    isReplyEmpty() {
      return isEditorEmpty(this.replyHTML)
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
      if (!this.comment.postView) return false
      return (
        new Date(this.comment.createdAt) >
        new Date(this.comment.postView.createdAt)
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
      if (!this.comment.level) return '#F44336'
      const l = (this.comment.level - 1) % 5
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
        '--theme-color': this.$vuetify.theme.themes.dark.primary
      }
    }
  },
  watch: {
    editing(editing) {
      if (editing) this.editHTML = this.comment.textContent
    },
    expanded(expanded) {
      if (!expanded) return
      this.expandedCommentId = this.comment.id
    },
    expandedCommentId(id) {
      if (id !== this.comment.id) this.expanded = false
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
    openReplyDialog() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to reply'
        })
        return
      }
      this.expanded = false
      this.$emit('startreply', this.comment)
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
      this.deleted = true
      await this.$apollo.mutate({
        mutation: deleteCommentGql,
        variables: { commentId: this.comment.id }
      })
    },
    async editComment() {
      this.editBtnLoading = true
      await this.$apollo.mutate({
        mutation: editCommentGql,
        variables: {
          commentId: this.comment.id,
          newTextContent: this.editHTML
        }
      })
      this.comment.textContent = this.editHTML
      this.editing = false
      this.editBtnLoading = false
    },
    async submitReply() {
      this.submitBtnLoading = true
      try {
        await this.$apollo.mutate({
          mutation: submitCommentGql,
          variables: {
            textContent: this.replyHTML,
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
            this.replyHTML = null
            if (!this.comment.childComments) this.comment.childComments = []
            this.comment.childComments.unshift(submitComment)
          }
        })
        this.replying = false
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
      this.submitBtnLoading = false
    },
    async toggleEndorsement() {
      this.expanded = false

      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to rocket this comment'
        })
        return
      }

      if (this.isEndorsed) {
        this.isEndorsed = false
        this.endorsementCount--
      } else {
        this.isEndorsed = true
        this.endorsementCount++
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
