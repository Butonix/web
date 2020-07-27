<template>
  <v-dialog
    ref="dialogref"
    v-model="dialogOpen"
    fullscreen
    :transition="
      !dialogOpen && !$device.isDesktop
        ? 'dialog-bottom-transition'
        : 'dialog-transition'
    "
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
              p/{{ post ? post.planet.name : '' }}
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

          <v-container>
            <v-row
              :style="
                $device.isDesktop ? 'padding-top: 36px' : 'padding-top: 44px'
              "
            >
              <v-col :class="$device.isDesktop ? '' : 'px-0'">
                <div
                  v-if="$device.isDesktop"
                  class="mb-3 pa-3"
                  :style="{
                    'border-radius': '10px',
                    'border-style': 'solid',
                    'border-width': '1px',
                    'border-color': $vuetify.theme.dark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)'
                  }"
                >
                  <Post is-post-view expanded-view :post="post" />
                </div>

                <div
                  v-else
                  class="mb-3 px-3 pb-3"
                  :style="{
                    'border-bottom-style': 'solid',
                    'border-bottom-width': '1px',
                    'border-bottom-color': $vuetify.theme.dark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)'
                  }"
                >
                  <Post is-post-view expanded-view :post="post" />
                </div>

                <v-row no-gutters>
                  <v-btn
                    v-if="$store.state.currentUser"
                    rounded
                    depressed
                    color="primary"
                    class="mb-3 white--text"
                    @click="openCommentDialog"
                  >
                    <v-icon class="mr-2">{{
                      $vuetify.icons.values.mdiPencil
                    }}</v-icon>
                    <span class="mr-2">New Comment</span>
                  </v-btn>

                  <v-btn
                    v-if="!$store.state.currentUser"
                    rounded
                    depressed
                    color="primary"
                    class="mb-3 white--text"
                    to="/login"
                    nuxt
                  >
                    <v-icon class="mr-2">{{
                      $vuetify.icons.values.mdiPencil
                    }}</v-icon>
                    Log in to comment
                  </v-btn>

                  <v-spacer />

                  <CommentSortMenu />
                </v-row>

                <DynamicScroller
                  v-if="postComments.length > 0"
                  page-mode
                  :items="threadedComments"
                  :min-item-size="54"
                >
                  <template v-slot="{ item, index, active }">
                    <DynamicScrollerItem
                      :item="item"
                      :active="active"
                      :index="index"
                      :size-dependencies="[item.textContent]"
                    >
                      <div class="pb-3">
                        <Comment
                          :post="post"
                          :post-view="postView"
                          :comment="item"
                        />
                      </div>
                    </DynamicScrollerItem>
                  </template>
                </DynamicScroller>

                <v-progress-linear
                  v-else-if="$apollo.queries.postComments.loading"
                  indeterminate
                />

                <v-row v-else justify="center" class="pt-4" no-gutters>
                  No one has commented yet. Will you be the first?
                </v-row>

                <div style="height: 600px" />
              </v-col>

              <v-col v-if="$device.isDesktop" cols="3">
                <PlanetInfoCard :planet="post.planet" />
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </div>

    <client-only>
      <v-dialog
        v-if="$store.state.currentUser"
        v-model="commentDialog"
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
              @click="closeCommentDialog"
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
              :disabled="isCommentEmpty"
              :loading="submitBtnLoading"
              @click="submitComment"
            >
              <v-icon class="mr-2">{{
                $vuetify.icons.values.mdiCheckCircleOutline
              }}</v-icon>
              Done
            </v-btn>
          </div>

          <div style="font-size: 1rem">
            <Editor
              v-model="commentHTML"
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
  </v-dialog>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import postCommentsGql from '../gql/postComments.graphql'
import submitCommentGql from '../gql/submitComment.graphql'
import recordPostViewGql from '../gql/recordPostView.graphql'
import Comment from '../components/comment/Comment'
import CommentSortMenu from '../components/comment/sort/CommentSortMenu'
import { urlName } from '@/util/urlName'
import { isEditorEmpty } from '@/util/isEditorEmpty'
import Post from '@/components/post/Post'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'

export default {
  name: 'PostDialog',
  components: {
    PlanetInfoCard,
    Post,
    Editor: () => import('@/components/editor/Editor'),
    CommentSortMenu,
    Comment,
    DynamicScroller,
    DynamicScrollerItem
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
      commentDialog: false,
      dialogOpen: this.value,
      addedEventListener: false
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
    },
    isCommentEmpty() {
      return isEditorEmpty(this.commentHTML)
    }
  },
  watch: {
    post: {
      deep: true,
      handler() {
        this.$nextTick(() => this.$refs.dialogref.$refs.dialog.scrollTo(0, 0))
      }
    },
    $route: {
      deep: true,
      handler() {
        if (!this.$route.query || !this.$route.query.replying) {
          this.commentDialog = false
        }
      }
    },
    async dialogOpen() {
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
    if (!this.addedEventListener) {
      window.addEventListener('popstate', this.handleHistoryChange)
      this.addedEventListener = true
    }

    if (this.$route.query && this.$route.query.replying) {
      const query = Object.assign({}, this.$route.query)
      delete query.replying
      this.$router.push({ path: this.$route.path, query })
    }
  },
  methods: {
    doNothing() {},
    goBack() {
      this.dialogOpen = false
      window.history.pushState({}, null, this.$route.path)
    },
    handleHistoryChange(e) {
      if (
        e.target.location.href.includes('/p/') &&
        e.target.location.href.includes('/comments/')
      )
        return
      this.dialogOpen = false
    },
    openCommentDialog() {
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
      this.commentDialog = true
    },
    closeCommentDialog() {
      if (!this.isCommentEmpty) {
        const confirmed = window.confirm(
          'Are you sure you want to discard this comment?'
        )
        if (!confirmed) return
      }
      this.commentDialog = false
      const query = Object.assign({}, this.$route.query)
      delete query.replying
      this.$router.push({ path: this.$route.path, query })
      this.commentHTML = null
    },
    async submitComment() {
      this.submitBtnLoading = true
      try {
        await this.$apollo.mutate({
          mutation: submitCommentGql,
          variables: {
            postId: this.postId,
            textContent: this.commentHTML
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
          }
        })
        this.commentHTML = null
        this.writingComment = false

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
        return !this.dialogOpen || !this.postId
      }
    }
  }
}
</script>

<style scoped></style>
