<template>
  <div
    v-show="dialogOpen"
    style="bottom: 0; left: 0; right: 0; position: fixed; height: 100%; width: 100%; z-index: 50; background-color: rgba(28,28,28,.9)"
    :style="{ top: $device.isDesktop ? '48px' : '56px' }"
  >
    <v-app-bar
      v-if="!$device.isDesktop"
      class="topappbar"
      flat
      style="position: fixed; top: 0; z-index: 700"
      :style="{
        'border-bottom-width': '1px',
        'border-bottom-style': 'solid',
        'border-bottom-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)'
      }"
    >
      <v-app-bar-nav-icon @click="goBack">
        <v-icon>{{ $vuetify.icons.values.mdiArrowLeft }}</v-icon>
      </v-app-bar-nav-icon>

      <div
        style="position: fixed; top: 14px; left: 50%; transform: translateX(-50%); font-size: 21px; font-weight: 500"
      >
        {{ post ? post.planet.name : '' }}
      </div>
    </v-app-bar>

    <div
      style="bottom: 0; left: 0; right: 0; position: fixed; height: 100%; width: 100%; z-index: 50; backface-visibility: hidden"
      :style="{ top: $device.isDesktop ? '48px' : '56px' }"
    >
      <div
        ref="dialog"
        style="height: 100%; overflow-y: auto; position: relative; width: 100%; will-change: transform; contain: layout style size"
        @click.stop.prevent="goBack"
      >
        <div
          v-if="$device.isDesktop"
          style="background-color: #030303; color: #E8EAED; position: sticky; box-sizing: border-box; height: 48px; left: 0; margin: 0 auto; max-width: 1280px; right: 0; top: 0; width: calc(100% - 160px); z-index: 70"
          @click.stop.prevent="doNothing"
        >
          <div
            style="padding: 0 32px; align-items: center; box-sizing: border-box; display: flex; height: 100%; margin: auto; max-width: 1128px; width: 100%"
          >
            <div
              style="align-items: center; display: flex; flex: 1; max-width: calc(100% - 324px); width: 100%"
            >
              <div
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              >
                {{ post ? post.title : '' }}
              </div>
            </div>

            <div
              style="display: flex; justify-content: flex-end; margin-left: 12px; width: 312px"
            >
              <v-btn text small style="color: #9AA0A6" @click="goBack">
                <v-icon class="mr-2" size="20">{{
                  $vuetify.icons.values.close
                }}</v-icon>
                Close
              </v-btn>
            </div>
          </div>
        </div>

        <div
          style="will-change: transform; box-sizing: border-box; display: flex; justify-content: center; max-width: 1280px; padding-bottom: 32px; position: relative"
          :style="{
            'background-color': $vuetify.theme.dark ? '#202124' : '#F1F3F4',
            margin: $device.isDesktop ? '0 auto' : '',
            width: $device.isDesktop ? 'calc(100% - 160px)' : '100%'
          }"
          @click.stop.prevent="doNothing"
        >
          <div
            style="flex: 1; min-height: 100vh; min-width: 0; padding-bottom: 1px; width: 100%; word-break: break-word"
            class="left"
            :style="{
              margin: $device.isDesktop ? '12px 12px 32px 32px' : ''
            }"
          >
            <div
              :style="{
                'border-width': '1px',
                'border-radius': '10px',
                'border-style': $device.isDesktop ? 'solid' : 'none',
                'border-color': $vuetify.theme.dark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.12)',
                'background-color': $vuetify.theme.dark ? '#202124' : '#F8F9FA'
              }"
              :class="$device.isDesktop ? 'pa-3 mb-3' : 'pa-3'"
            >
              <Post v-if="post" :post="post" is-post-view />
            </div>

            <div v-if="$device.isDesktop" class="pb-3">
              <div v-if="$store.state.currentUser">
                <div class="pb-3">
                  <span class="text--secondary" style="font-size: 0.86rem"
                    >Commenting as
                    <UsernameMenu :user-data="$store.state.currentUser"
                  /></span>
                </div>

                <client-only>
                  <Editor
                    v-model="commentHTML"
                    :loading="submitBtnLoading"
                    @submitted="submitComment"
                  />
                </client-only>
              </div>

              <v-card
                v-else
                flat
                :outlined="!$vuetify.theme.dark"
                :style="
                  $vuetify.theme.dark
                    ? 'background-color: #35363A'
                    : 'background-color: #F8F9FA'
                "
              >
                <v-card-actions class="px-4">
                  <span class="text--secondary"
                    >Sign up or log in to leave a comment</span
                  >
                  <v-spacer />
                  <v-btn text nuxt to="/login">Log in</v-btn>
                  <v-btn
                    depressed
                    color="primary"
                    class="white--text"
                    nuxt
                    to="/signup"
                    >Sign up</v-btn
                  >
                </v-card-actions>
              </v-card>
            </div>

            <v-row
              v-else
              no-gutters
              class="pb-3 px-3 pt-3"
              :style="{
                'border-width': '1px',
                'border-top-style': $device.isDesktop ? 'none' : 'solid',
                'border-bottom-style': $device.isDesktop ? 'none' : 'solid',
                'border-color': $vuetify.theme.dark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.12)',
                'background-color': $vuetify.theme.dark ? '#202124' : '#F8F9FA'
              }"
            >
              <v-btn
                v-if="$store.state.currentUser"
                rounded
                depressed
                color="primary"
                class="white--text"
                :class="$device.isDesktop ? '' : 'flex-grow-1 mr-3'"
                style="justify-content: start"
                height="34"
                @click="composeRootComment"
              >
                <v-icon class="mr-2">{{
                  $vuetify.icons.values.mdiPencil
                }}</v-icon>
                <span class="mr-2">Write a comment...</span>
              </v-btn>

              <v-btn
                v-if="!$store.state.currentUser"
                rounded
                depressed
                color="primary"
                class="white--text"
                :class="$device.isDesktop ? '' : 'flex-grow-1 mr-3'"
                style="justify-content: start"
                height="34"
                to="/login"
                nuxt
              >
                <v-icon class="mr-2">{{
                  $vuetify.icons.values.mdiPencil
                }}</v-icon>
                Log in to comment
              </v-btn>

              <v-spacer v-if="$device.isDesktop" />

              <CommentSortMenu />
            </v-row>

            <div
              v-show="renderedComments.length > 0"
              style="box-sizing: border-box"
              :style="{
                'border-style': $device.isDesktop ? 'solid' : 'none',
                'border-bottom-style': 'solid',
                'border-color': $vuetify.theme.dark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.12)',
                'border-width': '1px',
                'border-radius': $device.isDesktop ? '10px' : '0',
                'background-color': $vuetify.theme.dark ? '#202124' : '#F8F9FA'
              }"
            >
              <Comment
                v-for="(comment, index) in renderedComments"
                :key="comment.id"
                :comment="comment"
                :style="{
                  'border-top-style':
                    comment.level === 0 && index > 0 ? 'solid' : 'none',
                  'border-color': $vuetify.theme.dark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.12)',
                  'border-top-width': '1px'
                }"
                @startreply="handleStartReply"
              />
            </div>
            <div style="height: 600px" />
          </div>

          <div
            v-if="$device.isDesktop"
            style="margin: 12px 32px 32px 0; padding: 0; right: 0; top: 0; width: 312px"
            class="right"
          >
            <div
              style="display: flex; flex-direction: column; height: 100%; top: 0; width: 312px"
            >
              <div style="position: sticky; top: 60px">
                <PlanetInfoCard
                  v-if="post"
                  :style="
                    $vuetify.theme.dark ? '' : 'background-color: #F8F9FA'
                  "
                  :planet="post.planet"
                />
                <InfoLinks class="mt-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditorDialog
      ref="editordialog"
      v-model="commentHTML"
      :parent-text-content="
        replyingComment ? replyingComment.textContent : null
      "
      :loading="submitBtnLoading"
      @submitted="submitComment"
    />
  </div>
</template>

<script>
import postCommentsGql from '../gql/postComments.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import recordPostViewGql from '../gql/recordPostView.graphql'
import Comment from '../components/comment/Comment'
import { urlName } from '@/util/urlName'
import Post from '@/components/post/Post'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import UsernameMenu from '@/components/user/UsernameMenu'
import CommentSortMenu from '@/components/comment/sort/CommentSortMenu'
import InfoLinks from '@/components/InfoLinks'

function flat(r, a) {
  const b = {}
  Object.keys(a).forEach(function(k) {
    if (k !== 'childComments') {
      b[k] = a[k]
    }
  })
  r.push(b)
  if (Array.isArray(a.childComments)) {
    b.childComments = a.childComments.map(function(a) {
      return a.id
    })
    return a.childComments.reduce(flat, r)
  }
  return r
}

export default {
  name: 'PostDialog',
  components: {
    InfoLinks,
    CommentSortMenu,
    PlanetInfoCard,
    UsernameMenu,
    Editor: () => import('@/components/editor/Editor'),
    EditorDialog: () => import('@/components/editor/EditorDialog'),
    Post,
    Comment
  },
  props: {
    post: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      required: true
    },
    standalone: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postComments: [],
      postView: null,
      commentHTML: null,
      submitBtnLoading: false,
      dialogOpen: this.value,
      addedEventListener: false,
      replyingComment: null,
      renderedCommentsCount: 5
    }
  },
  computed: {
    postId() {
      return this.post ? this.post.id : ''
    },
    urlName() {
      if (!this.post) return ''
      return urlName(this.post.title)
    },
    threadedComments() {
      if (this.postComments.length === 0) return []
      const thread = this.postComments.filter((c) => c.parentCommentId === null)
      const fun = (comments, level) => {
        for (const comment of comments) {
          comment.childComments = this.postComments.filter(
            (c) => c.parentCommentId === comment.id
          )
          comment.level = level
          comment.post = this.post
          comment.postView = this.postView
          fun(comment.childComments, level + 1)
        }
      }
      fun(thread, 0)
      return thread.reduce(flat, [])
    },
    renderedComments() {
      return this.threadedComments.slice(0, this.renderedCommentsCount)
    }
  },
  watch: {
    'post.id'() {
      this.updateThemeColor()
      this.postComments = []
      this.renderedCommentsCount = 5
      this.$nextTick(() => this.$refs.dialog.scrollTo(0, 0))
    },
    async dialogOpen() {
      this.updateThemeColor()
      this.$emit('input', this.dialogOpen)

      if (!this.dialogOpen && this.addedEventListener) {
        window.removeEventListener('popstate', this.handleHistoryChange)
        this.addedEventListener = false
      } else if (!this.addedEventListener) {
        window.addEventListener('popstate', this.handleHistoryChange)
        this.addedEventListener = true
      }

      if (this.$store.state.currentUser && this.dialogOpen && this.postId) {
        const { data } = await this.$apollo.mutate({
          mutation: recordPostViewGql,
          variables: {
            postId: this.postId
          }
        })
        this.postView = data.recordPostView
      }
    },
    value() {
      this.dialogOpen = this.value
    }
  },
  destroyed() {
    if (this.addedEventListener) {
      window.removeEventListener('popstate', this.handleHistoryChange)
      this.addedEventListener = false
    }
  },
  async mounted() {
    this.updateThemeColor()
    if (!this.addedEventListener) {
      window.addEventListener('popstate', this.handleHistoryChange)
      this.addedEventListener = true
    }

    setInterval(() => {
      if (this.threadedComments.length < this.renderedCommentsCount) return
      this.renderedCommentsCount++
    }, 50)

    if (!this.dialogOpen) {
      window.document.documentElement.style.overflowY = 'scroll'
    } else {
      window.document.documentElement.style.overflowY = 'hidden'
    }
  },
  methods: {
    doNothing() {},
    composeRootComment() {
      this.replyingComment = null
      this.$refs.editordialog.open()
    },
    handleStartReply(e) {
      this.replyingComment = e
      this.$refs.editordialog.open()
    },
    updateThemeColor() {
      if (
        (!this.post || !this.dialogOpen) &&
        this.$route.name !== 'p-planetname-sort-time'
      ) {
        this.$nextTick(() => {
          this.$vuetify.theme.themes.dark.primary = '#EF5350'
          this.$vuetify.theme.themes.light.primary = '#EF5350'
        })
      } else if (this.post && this.post.planet.themeColor) {
        this.$nextTick(() => {
          this.$vuetify.theme.themes.dark.primary = this.post.planet.themeColor
          this.$vuetify.theme.themes.light.primary = this.post.planet.themeColor
        })
      }
    },
    goBack() {
      this.dialogOpen = false
      if (!this.standalone) {
        window.history.pushState({}, null, this.$route.path)
      }
    },
    handleHistoryChange(e) {
      if (this.standalone) return
      if (
        e.target.location.href.includes('/p/') &&
        e.target.location.href.includes('/comments/')
      )
        return
      if (this.$refs.editordialog) {
        this.$refs.editordialog.close()
      }
      this.dialogOpen = false
    },
    async submitComment() {
      this.submitBtnLoading = true
      try {
        await this.$apollo.mutate({
          mutation: submitCommentGql,
          variables: {
            postId: this.postId,
            textContent: this.commentHTML,
            parentCommentId: this.replyingComment
              ? this.replyingComment.id
              : null
          },
          update: (store, { data: { submitComment } }) => {
            const data = store.readQuery({
              query: postCommentsGql,
              variables: {
                postId: this.postId
                // sort: this.sort.sort.toUpperCase()
              }
            })
            data.postComments.unshift(submitComment)
            store.writeQuery({
              query: postCommentsGql,
              variables: {
                postId: this.postId
                // sort: this.sort.sort.toUpperCase()
              },
              data
            })
            if (this.replyingComment) {
              if (!this.replyingComment.childComments)
                this.replyingComment.childComments = []
              this.replyingComment.childComments.unshift(submitComment)
            }
          }
        })
        this.commentHTML = null
        this.$refs.editordialog.close()

        await this.$apollo.mutate({
          mutation: recordPostViewGql,
          variables: {
            postId: this.postId
          }
        })
      } catch (e) {
        this.$store.dispatch('displaySnackbar', {
          message: e.message.split('GraphQL error: ')[1]
        })
      }
      this.submitBtnLoading = false
    }
  },
  apollo: {
    postComments: {
      query: postCommentsGql,
      variables() {
        return {
          postId: this.postId
        }
      },
      skip() {
        return !this.post || !this.dialogOpen || !this.postId
      },
      fetchPolicy: 'network-only'
    }
  }
}
</script>

<style scoped>
@media (min-width: 960px) {
  .left {
    max-width: 740px;
  }

  .right {
    display: block;
  }
}
</style>
