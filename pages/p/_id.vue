<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <UserSideCard />
      </v-col>
      <v-col xl="7" lg="8" cols="9">
        <div class="pb-3">
          <v-skeleton-loader
            v-if="!post"
            transition="fade-transition"
            type="list-item-avatar-three-line"
            height="134"
          />
          <ItemComponent v-else :post="post" is-post-view />
        </div>

        <v-row v-if="!writingComment" no-gutters>
          <v-btn
            v-if="$store.state.currentUser"
            rounded
            depressed
            color="primary"
            class="betterbutton mb-3"
            @click="writingComment = true"
          >
            <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPencil }}</v-icon>
            New Comment
          </v-btn>

          <v-btn
            v-else
            rounded
            depressed
            color="primary"
            class="betterbutton mb-3"
            to="/login"
            nuxt
          >
            <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPencil }}</v-icon>
            Login to Comment
          </v-btn>

          <v-spacer />

          <CommentSortMenu />
        </v-row>

        <CommentEditor
          v-else
          v-model="commentHTML"
          class="mb-3"
          :loading="submitBtnLoading"
          @submitted="submitComment"
          @cancelled="writingComment = false"
        />

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
                <CommentDesktop :post-view="postView" :comment="item" />
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>

        <v-progress-linear
          v-else-if="$apollo.queries.postComments.loading"
          indeterminate
        />

        <v-row v-else justify="center" no-gutters>
          No one has commented yet. Will you be the first?
        </v-row>

        <div style="height: 500px" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import postGql from '../../gql/post.graphql'
import postCommentsGql from '../../gql/postComments.graphql'
import ItemComponent from '../../components/post/PostDesktop'
import submitCommentGql from '../../gql/submitComment.graphql'
import recordPostViewGql from '../../gql/recordPostView.graphql'
import UserSideCard from '../../components/user/UserSideCard'
import CommentDesktop from '../../components/comment/CommentDesktop'
import CommentEditor from '../../components/editor/CommentEditor'
import CommentSortMenu from '../../components/buttons/comment_sort/CommentSortMenu'

export default {
  components: {
    CommentSortMenu,
    CommentEditor,
    CommentDesktop,
    UserSideCard,
    ItemComponent
  },
  data() {
    return {
      post: null,
      postComments: [],
      postView: null,
      submitCommentErr: '',
      writingComment: false,
      commentHTML: null,
      submitBtnLoading: false
    }
  },
  computed: {
    postId() {
      return this.$route.params.id
    },
    urlName() {
      if (!this.post) return ''
      return this.post.title
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/\W/g, '')
        .split('_')
        .slice(0, 9)
        .join('_')
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
  async activated() {
    const { data } = await this.$apollo.mutate({
      mutation: recordPostViewGql,
      variables: {
        postId: this.postId
      }
    })
    this.postView = data.recordPostView
  },
  methods: {
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
        this.submitCommentErr = e.message.split('GraphQL error: ')[1]
      }
      this.submitBtnLoading = false
    }
  },
  apollo: {
    post: {
      query: postGql,
      variables() {
        return {
          postId: this.postId
        }
      },
      skip() {
        return this.$route.name !== 'p-id-title'
      }
    },
    postComments: {
      query: postCommentsGql,
      variables() {
        return {
          postId: this.postId
        }
      },
      skip() {
        return this.$route.name !== 'p-id-title'
      }
    }
  },
  head() {
    if (!this.post) return { title: 'Post' }
    else
      return {
        title: this.post.title,
        link: [
          {
            rel: 'canonical',
            href: `https://www.getcomet.net/p/${this.post.id}/${this.urlName}`
          }
        ],
        meta: [
          {
            hid: 'og:title',
            property: 'og:title',
            content: `${this.post.title}`
          },
          {
            hid: 'og:site_name',
            property: 'og:site_name',
            content: `Comet - ${this.post.commentCount} Comment${
              this.post.commentCount === 1 ? '' : 's'
            } / ${this.post.endorsementCount} Endorsement${
              this.post.endorsementCount === 1 ? '' : 's'
            }`
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content:
              this.post.type === 'TEXT'
                ? this.post.textContent
                  ? `${this.post.textContent.substring(0, 100)}${
                      this.post.textContent.length >= 100 ? '...' : ''
                    }`
                  : this.post.title
                : this.post.link
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: this.post.thumbnailUrl ? this.post.thumbnailUrl : ''
          }
        ]
      }
  }
}
</script>

<style scoped></style>
