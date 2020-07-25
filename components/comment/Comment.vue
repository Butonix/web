<template>
  <div
    v-if="
      !idState.deleted ||
        (comment.childComments && comment.childComments.length > 0)
    "
    :id="comment.id"
    :style="{
      border:
        level === 0 && !$vuetify.theme.dark
          ? '1px solid rgba(0, 0, 0, 0.12)'
          : '',
      'border-radius': '10px',
      'background-color': $vuetify.theme.dark ? '#35363A' : '#FFFFFF'
    }"
  >
    <div
      :style="{
        'padding-left': 10 * level + 'px',
        'background-color': $vuetify.theme.dark
          ? idState.expanded
            ? '#414245'
            : '#35363A'
          : idState.expanded
          ? '#F1F3F4'
          : '#FFFFFF',
        'border-radius': '9px'
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
          class="text--primary pt-2 pb-0 px-2"
          style="font-size: 1rem"
        >
          <div v-if="showPostTitle" class="mb-1">
            <nuxt-link
              :to="`/p/${comment.post.id}/${postUrlName}`"
              class="caption font-weight-medium text--secondary"
              >{{ comment.post.title }}</nuxt-link
            >
          </div>

          <TextContent
            :dark="$vuetify.theme.dark"
            :text-content="comment.textContent"
          />
        </v-card-text>

        <v-card-actions class="px-2 py-2">
          <UsernameMenu
            v-if="comment.author"
            :user-data="comment.author"
            :op="post && post.author.id === comment.author.id"
          />
          <span v-else-if="!comment.author" class="text--secondary"
            >[deleted]</span
          >

          <span :title="editedTimeSince" class="text--secondary caption ml-2"
            >{{ timeSince }}{{ editedTimeSince ? '*' : '' }}</span
          >

          <span
            v-if="!$device.isDesktop"
            class="caption ml-3"
            :class="comment.isEndorsed ? 'primary--text' : 'text--secondary'"
          >
            {{ comment.endorsementCount }}
            <v-icon
              size="12"
              :class="comment.isEndorsed ? 'primary--text' : 'text--secondary'"
              style="margin-bottom: 2px"
              >{{ $vuetify.icons.values.mdiRocket }}</v-icon
            >
          </span>

          <span v-if="isNew" class="caption ml-3 primary--text">New</span>

          <template v-if="$device.isDesktop">
            <v-spacer />

            <v-btn
              small
              text
              rounded
              class="text--secondary"
              @click="openReplyDialog"
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
              @click="toggleEndorsement"
            >
              <v-icon class="mr-2" size="20">{{
                $vuetify.icons.values.mdiRocket
              }}</v-icon>
              {{ comment.endorsementCount }}
            </v-btn>
          </template>
        </v-card-actions>
      </div>
    </div>

    <div
      v-if="!$device.isDesktop && idState.expanded"
      :style="
        $vuetify.theme.dark
          ? 'background-color: #35363A'
          : 'background-color: #FFFFFF'
      "
      style="border-bottom-left-radius: 9px; border-bottom-right-radius: 9px; display: flex"
    >
      <v-btn
        text
        tile
        class="flex-grow-1"
        nuxt
        :to="`/u/${comment.author.username}`"
      >
        <v-icon v-if="!comment.author.profilePicUrl" class="mr-2">{{
          $vuetify.icons.values.mdiAccountOutline
        }}</v-icon>
        <v-avatar v-else class="mr-2" size="28">
          <img :src="comment.author.profilePicUrl" alt="Profile Picture" />
        </v-avatar>
        {{ comment.author.username }}
      </v-btn>

      <v-btn text tile class="flex-grow-1" @click="openReplyDialog">
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiReply }}</v-icon>
        Reply
      </v-btn>

      <v-btn
        text
        tile
        class="flex-grow-1"
        :class="comment.isEndorsed ? 'primary--text' : ''"
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
        :comment="c"
        :level="level + 1"
      />
    </div>

    <client-only>
      <v-dialog
        v-model="idState.replyDialog"
        :retain-focus="false"
        persistent
        width="50%"
        :fullscreen="!$device.isDesktop"
        :transition="
          $device.isDesktop ? 'dialog-transition' : 'dialog-bottom-transition'
        "
      >
        <v-card
          :tile="!$device.isDesktop"
          :min-height="$device.isDesktop ? '400' : ''"
        >
          <div
            style="display: flex"
            :style="{
              'background-color': $vuetify.theme.dark ? '#202124' : '#F1F3F4',
              'border-bottom-width': '1px',
              'border-bottom-color': 'rgba(0, 0, 0, 0.12)',
              'border-bottom-style': $vuetify.theme.dark ? 'none' : 'solid'
            }"
          >
            <v-btn
              text
              tile
              class="flex-grow-1"
              height="50"
              @click="closeReplyDialog"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCloseCircleOutline
              }}</v-icon>
              Discard
            </v-btn>
            <v-btn
              text
              tile
              class="flex-grow-1"
              height="50"
              :disabled="isReplyEmpty"
              :loading="idState.submitBtnLoading"
              @click="submitReply"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCheckCircleOutline
              }}</v-icon>
              Done
            </v-btn>
          </div>

          <div
            style="font-size: 1rem; max-height: 200px; border-bottom-width: 1px; border-bottom-style: solid"
            class="pa-2"
            :style="{
              'border-bottom-color': $vuetify.theme.dark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.12)'
            }"
            v-html="comment.textContent"
          ></div>
          <div style="font-size: 1rem">
            <Editor
              v-model="idState.replyHTML"
              editable
              autofocus
              :style="$device.isDesktop ? 'max-height: 600px' : ''"
              style="overflow-y: auto"
              class="pa-2"
            />
          </div>
        </v-card>
      </v-dialog>
    </client-only>
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

export default {
  name: 'Comment',
  components: {
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
    openReplyDialog() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to reply'
        })
        return
      }
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, replying: 'true' }
      })
      this.idState.replyDialog = true
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
            if (this.$route.name === 'post-id-title') {
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
            }

            this.idState.replyHTML = null
            this.idState.replyDialog = false
            if (!this.comment.childComments) this.comment.childComments = []
            this.comment.childComments.unshift(submitComment)
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
      this.idState.expanded = false

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
