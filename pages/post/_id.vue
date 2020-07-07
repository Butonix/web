<template>
  <div v-if="!$device.isDesktop">
    <Post
      v-if="post"
      :source="post"
      :expand="true"
      :is-post-view="true"
      class="mb-4"
    />
    <v-divider class="mb-4 mt-0" />
    <v-row class="my-0 mx-4">
      <v-btn
        aria-label="New Comment"
        color="#424346"
        class="flex-grow-1 betterbutton"
        :style="
          $vuetify.theme.dark
            ? 'border-color: rgba(255, 255, 255, 0.12);'
            : 'border-color: rgba(0, 0, 0, 0.12);'
        "
        rounded
        depressed
        style="justify-content: start"
      >
        <v-icon class="mr-2">{{
          $vuetify.icons.values.mdiCommentOutline
        }}</v-icon>
        <span class="mr-4">New comment</span>
      </v-btn>
    </v-row>
    <v-divider class="mb-0 mt-4" />
    <div
      v-if="postComments.length === 0"
      class="mt-4 text--secondary"
      style="text-align: center"
    >
      No comments yet. Will you be the first?
    </div>
    <Comment
      v-for="comment in threadedComments"
      v-else
      :key="comment.id"
      :comment="comment"
      :post="post"
      :post-view="postView"
      :sort="sort"
    />
  </div>

  <v-container v-else fluid>
    <v-row>
      <v-col class="py-0">
        <Post v-if="post" :source="post" :expand="true" :is-post-view="true" />
        <div :style="$device.isDesktop ? 'width: 40%' : 'width: 100%'">
          <TextEditor
            v-model="commentWriteText"
            :label="'Write your comment'"
            class="mt-2"
            :rows="$device.isDesktop ? 3 : 1"
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
              :disabled="!commentWriteText"
              @click="submitComment"
              >Submit Comment</v-btn
            >
          </v-row>
        </div>

        <v-row class="mb-1 mx-0 mt-0" align="center">
          <span class="title mr-2"
            >{{ postComments.length }} Comment{{
              postComments.length === 1 ? '' : 's'
            }}</span
          >
        </v-row>

        <Comment
          v-for="comment in threadedComments"
          :key="comment.id"
          :comment="comment"
          :post="post"
          :post-view="postView"
          :sort="sort"
          class="mb-1"
        />

        <div v-if="threadedComments.length > 0" style="height: 500px" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Post from '../../components/Post.vue'
import submitCommentGql from '../../gql/submitComment.graphql'
import postGql from '../../gql/post.graphql'
import postCommentsGql from '../../gql/postComments.graphql'
import recordPostViewGql from '../../gql/recordPostView.graphql'
import TextEditor from '../../components/TextEditor'
import Comment from '../../components/Comment'

export default {
  validate({ params }) {
    return params.id !== undefined
  },
  components: { Comment, TextEditor, Post },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const postData = await client.query({
      query: postGql,
      variables: { postId: context.params.id },
      fetchPolicy: 'network-only'
    })
    if (!postData.data.post)
      context.error({ statusCode: 404, message: 'Post not found' })

    const postCommentsData = await client.query({
      query: postCommentsGql,
      variables: { postId: context.params.id },
      fetchPolicy: 'network-only'
    })

    return {
      post: postData.data.post,
      postComments: postCommentsData.data.postComments
    }
  },
  data() {
    return {
      postComments: [],
      postView: null,
      post: null,
      commentWriteText: '',
      loading: false,
      submitCommentErr: '',
      sort: {
        sort:
          this.$route.query.sort &&
          ['new', 'top'].includes(this.$route.query.sort)
            ? this.$route.query.sort
            : 'top'
      }
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
    post() {
      if (!this.post) return
      this.$store.commit('setCurrentPostTitle', this.post.title)
      this.$store.commit('setCurrentPostComments', this.post.commentCount)
    },
    postComments() {
      if (this.post) {
        this.post.commentCount = this.postComments.length
      }
    },
    sort: {
      handler(val) {
        const query = {
          sort: val.sort
        }
        this.$router.push({
          path: `/post/${this.postId}/${this.urlName}`,
          query
        })
      },
      deep: true
    }
  },
  async mounted() {
    if (
      this.$route.query.sort &&
      !['new', 'top'].includes(this.$route.query.sort)
    ) {
      this.$router.push({
        path: `/post/${this.postId}/${this.urlName}`
      })
    }

    const { data } = await this.$apollo.mutate({
      mutation: recordPostViewGql,
      variables: {
        postId: this.postId
      }
    })
    this.postView = data.recordPostView
  },
  /* apollo: {
    postComments: {
      query: postCommentsGql,
      variables() {
        return {
          postId: this.postId,
          sort: this.$route.query.sort
            ? this.$route.query.sort.toUpperCase()
            : 'TOP'
        }
      },
      fetchPolicy: 'cache-and-network',
      skip() {
        return !this.postId
      }
    },
    post: {
      query: postGql,
      variables() {
        return { postId: this.postId }
      },
      fetchPolicy: 'cache-and-network',
      skip() {
        return !this.postId
      }
    }
  }, */
  methods: {
    async submitComment() {
      this.loading = true
      try {
        await this.$apollo.mutate({
          mutation: submitCommentGql,
          variables: {
            postId: this.postId,
            textContent: this.commentWriteText
          },
          update: (store, { data: { submitComment } }) => {
            const data = store.readQuery({
              query: postCommentsGql,
              variables: {
                postId: this.postId,
                sort: this.sort.sort.toUpperCase()
              }
            })
            data.postComments.unshift(submitComment)
            store.writeQuery({
              query: postCommentsGql,
              variables: {
                postId: this.postId,
                sort: this.sort.sort.toUpperCase()
              },
              data
            })
          }
        })
        this.commentWriteText = ''

        await this.$apollo.mutate({
          mutation: recordPostViewGql,
          variables: {
            postId: this.postId
          }
        })
      } catch (e) {
        this.submitCommentErr = e.message.split('GraphQL error: ')[1]
      }
      this.loading = false
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
            href: `https://www.getcomet.net/post/${this.post.id}/${this.urlName}`
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
