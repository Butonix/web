<template>
  <v-dialog
    ref="dialogref"
    v-model="dialogOpen"
    fullscreen
    hide-overlay
    :retain-focus="false"
  >
    <div
      style="background-color: rgba(0, 0, 0, 0.4)"
      :style="
        $device.isDesktop ? 'height: auto; min-height: 100%; display: flex' : ''
      "
      @click="goBack"
    >
      <div
        :style="
          $device.isDesktop
            ? 'max-width: 1280px; width: calc(100% - 160px); margin: 0 auto; display: flex; justify-content: center'
            : ''
        "
      >
        <div
          v-if="post"
          :style="{
            'background-color': $vuetify.theme.dark ? '#202124' : '#F8F9FA',
            height: $device.isDesktop ? 'auto' : '',
            'min-height': $device.isDesktop ? '100%' : '',
            width: $device.isDesktop ? '100%' : ''
          }"
          class="elevation-6"
          @click.stop.prevent="doNothing"
        >
          <v-app-bar
            v-if="!$device.isDesktop"
            fixed
            flat
            :style="
              $vuetify.theme.dark
                ? 'border-bottom: 1px solid rgba(255, 255, 255, .12); background-color: #202124'
                : 'border-bottom: 1px solid rgba(0, 0, 0, .12); background-color: #F1F3F4'
            "
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

          <v-app-bar
            v-else
            fixed
            flat
            dense
            class="pr-4"
            style="max-width: 1280px; width: calc(100% - 177px); left: auto; right: auto"
            :style="
              $vuetify.theme.dark
                ? 'border-bottom: 1px solid rgba(255, 255, 255, .12); background-color: #202124'
                : 'border-bottom: 1px solid rgba(0, 0, 0, .12); background-color: #F1F3F4'
            "
          >
            <v-toolbar-title
              class="text--secondary"
              style="font-size: 1rem; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: calc(100% - 324px); width: 100%"
              >{{ post.title }}</v-toolbar-title
            >

            <v-spacer />

            <v-btn text class="text--secondary" @click="goBack">
              <v-icon size="20" class="mr-2">{{
                $vuetify.icons.values.close
              }}</v-icon>
              Close
            </v-btn>
          </v-app-bar>

          <div
            :class="$device.isDesktop ? 'infocontainer' : ''"
            :style="
              $device.isDesktop ? 'padding-top: 48px' : 'padding-top: 68px'
            "
          >
            <div :class="$device.isDesktop ? 'postcol' : ''">
              <div
                class="mb-3"
                :class="$device.isDesktop ? 'pa-3' : 'px-3 pb-3'"
                :style="{
                  'border-radius': $device.isDesktop ? '10px' : '0',
                  'border-style': $device.isDesktop ? 'solid' : 'none',
                  'border-bottom-style': 'solid',
                  'border-width': '1px',
                  'border-color': $vuetify.theme.dark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.12)'
                }"
              >
                <Post is-post-view :post="post" />
              </div>

              <v-row
                v-if="!$device.isDesktop"
                no-gutters
                :class="$device.isDesktop ? '' : 'px-3'"
                class="pb-3"
                :style="{
                  'border-bottom-width': '1px',
                  'border-bottom-style': $device.isDesktop ? 'none' : 'solid',
                  'border-bottom-color': $vuetify.theme.dark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.12)'
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
                  @click="$refs.editordialog.open()"
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

              <div v-if="$device.isDesktop" class="mb-3">
                <client-only v-if="$store.state.currentUser">
                  <div class="text--secondary pb-3" style="font-size: 0.86rem">
                    Commenting as
                    <UsernameMenu :user-data="$store.state.currentUser" />
                  </div>
                  <Editor v-model="commentHTML" @submitted="submitComment" />
                </client-only>
                <v-card v-else flat :outlined="!$vuetify.theme.dark">
                  <v-card-actions class="px-4">
                    <span class="text--secondary"
                      >Sign up or log in to leave a comment</span
                    >
                    <v-spacer />
                    <v-btn text nuxt to="/login">Log in</v-btn>
                    <v-btn depressed color="primary" nuxt to="/signup"
                      >Sign up</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </div>

              <!--<DynamicScroller
                page-mode
                :items="threadedComments"
                :min-item-size="54"
                :buffer="500"
              >
                <template v-slot="{ item, index, active }">
                  <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :index="index"
                    :size-dependencies="[item.textContent]"
                  >
                    <div :class="$device.isDesktop ? 'pb-3' : ''">
                      <Comment
                        :post="post"
                        :post-view="postView"
                        :comment="item"
                        @startreply="handleStartReply"
                      />
                    </div>
                  </DynamicScrollerItem>
                </template>
              </DynamicScroller>-->

              <div
                v-for="comment in threadedComments"
                :key="comment.id"
                :class="$device.isDesktop ? 'pb-3' : ''"
              >
                <Comment
                  :post="post"
                  :post-view="postView"
                  :comment="comment"
                  @startreply="handleStartReply"
                />
              </div>

              <v-row
                v-show="
                  !$apollo.queries.postComments.loading &&
                    postComments.length === 0
                "
                justify="center"
                class="pt-4"
                no-gutters
              >
                No one has commented yet. Will you be the first?
              </v-row>

              <div style="height: 600px" />
            </div>

            <div v-if="$device.isDesktop" class="infocol">
              <div class="sticky">
                <PlanetInfoCard :planet="post.planet" />
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
      @submitted="submitComment"
    />
  </v-dialog>
</template>

<script>
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
// import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import postCommentsGql from '../gql/postComments.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import recordPostViewGql from '../gql/recordPostView.graphql'
import Comment from '../components/comment/Comment'
import CommentSortMenu from '../components/comment/sort/CommentSortMenu'
import { urlName } from '@/util/urlName'
import Post from '@/components/post/Post'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import UsernameMenu from '@/components/user/UsernameMenu'

export default {
  name: 'PostDialog',
  components: {
    UsernameMenu,
    Editor: () => import('@/components/editor/Editor'),
    EditorDialog: () => import('@/components/editor/EditorDialog'),
    PlanetInfoCard,
    Post,
    CommentSortMenu,
    Comment
    // DynamicScroller,
    // DynamicScrollerItem
  },
  props: {
    post: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      required: true
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
      replyingComment: null
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
      const fun = (comments) => {
        for (const comment of comments) {
          comment.childComments = this.postComments.filter(
            (c) => c.parentCommentId === comment.id
          )
          fun(comment.childComments)
        }
      }
      fun(thread)
      return thread
    }
  },
  watch: {
    post: {
      deep: true,
      handler() {
        this.updateThemeColor()
        this.postComments = []
        this.$nextTick(() => this.$refs.dialogref.$refs.dialog.scrollTo(0, 0))
      }
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
  },
  methods: {
    doNothing() {},
    handleStartReply(e) {
      this.replyingComment = e
      this.$refs.editordialog.open()
    },
    updateThemeColor() {
      if (!this.post || !this.dialogOpen) {
        this.$nextTick(() => {
          this.$vuetify.theme.themes.dark.primary = '#EF5350'
          this.$vuetify.theme.themes.light.primary = '#EF5350'
        })
      } else if (this.post.planet.themeColor) {
        this.$nextTick(() => {
          this.$vuetify.theme.themes.dark.primary = this.post.planet.themeColor
          this.$vuetify.theme.themes.light.primary = this.post.planet.themeColor
        })
      }
    },
    goBack() {
      this.dialogOpen = false
      window.history.pushState({}, null, this.$route.path)
    },
    handleHistoryChange(e) {
      this.$refs.editordialog.close()
      if (
        e.target.location.href.includes('/p/') &&
        e.target.location.href.includes('/comments/')
      )
        return
      this.dialogOpen = false
    },
    async submitComment() {
      console.log(this.commentHTML)
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
      }
    }
  }
}
</script>

<style scoped>
.infocontainer {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1280px;
  padding-bottom: 32px;
  position: relative;
  width: calc(100% - 160px);
}

.postcol {
  width: 100%;
  margin: 12px 24px 32px 32px;
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.infocol {
  display: none;
}

@media (min-width: 960px) {
  .postcol {
    max-width: 740px;
  }

  .infocol {
    display: block;
    width: 312px;
    min-width: 312px;
    margin: 12px 32px 32px 0;
  }
}
</style>
