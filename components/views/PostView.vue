<template>
  <v-row>
    <v-col>
      <Post :post="post" :expand="true" />

      <div :style="$device.isDesktop ? 'width: 40%' : 'width: 100%'">
        <TextEditor
          v-model="commentWriteText"
          :label="'Write your comment'"
          class="mt-2"
          :rows="3"
          :err="submitCommentErr"
          :show-details="submitCommentErr.length > 0"
        />
        <v-row>
          <v-spacer />
          <v-btn
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

      <div v-if="threadedComments.length === 0 && post.commentCount !== 0">
        <v-row class="ma-0">
          <div class="title mr-6">Loading Comments...</div>
          <v-progress-circular size="24" indeterminate />
        </v-row>
      </div>

      <div v-else>
        <v-row class="mb-1 mx-0 mt-0" align="center">
          <span class="title mr-2"
            >{{ postComments.length }} Comment{{
              postComments.length === 1 ? '' : 's'
            }}</span
          >
          <SortMenu
            v-model="sort"
            :hot-enabled="false"
            :times-enabled="false"
          />
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
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Post from '../Post.vue'
import submitCommentGql from '../../gql/submitComment.graphql'
import postGql from '../../gql/post.graphql'
import postCommentsGql from '../../gql/postComments.graphql'
import recordPostViewGql from '../../gql/recordPostView.graphql'
import TextEditor from '../TextEditor'
import Comment from '../Comment'
import SortMenu from '../SortMenu'

export default {
  name: 'PostView',
  components: { SortMenu, Comment, TextEditor, Post },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const postData = await client.query({
      query: postGql,
      variables: { postId: context.params.postId },
      fetchPolicy: 'network-only'
    })

    if (!postData.data.post)
      context.error({ statusCode: 404, message: 'Post not found' })

    return {
      post: postData.data.post
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
      return this.$route.params.postId
    },
    urlName() {
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
  apollo: {
    postComments: {
      query: postCommentsGql,
      variables() {
        return {
          postId: this.postId,
          sort: this.sort.sort.toUpperCase()
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },
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
    return {
      title: this.post.title,
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
