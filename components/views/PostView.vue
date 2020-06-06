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

      <div
        v-if="
          threadedComments.length === 0 && (!post || post.commentCount !== 0)
        "
      >
        <v-row class="ma-0">
          <div class="title mr-6">Loading Comments...</div>
          <v-progress-circular size="24" indeterminate />
        </v-row>
      </div>

      <div v-else>
        <div class="mb-1">
          <span class="title"
            >{{ postComments.length }} Comment{{
              postComments.length === 1 ? '' : 's'
            }}</span
          >
        </div>

        <Comment
          v-for="comment in threadedComments"
          :key="comment.id"
          :comment="comment"
          :post="post"
          :post-view="postView"
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

export default {
  name: 'PostView',
  components: { Comment, TextEditor, Post },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const postData = await client.query({
      query: postGql,
      variables: { postId: context.params.postId },
      fetchPolicy: 'network-only'
    })

    const postCommentsData = await client.query({
      query: postCommentsGql,
      variables: { postId: context.params.postId },
      fetchPolicy: 'network-only'
    })
    return {
      post: postData.data.post,
      postComments: postCommentsData.data.postComments
    }
  },
  data: () => ({
    postComments: [],
    postView: null,
    post: null,
    commentWriteText: '',
    loading: false
  }),
  computed: {
    postId() {
      return this.$route.params.postId
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
    }
  },
  async mounted() {
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
      this.loading = true
      await this.$apollo.mutate({
        mutation: submitCommentGql,
        variables: {
          postId: this.postId,
          textContent: this.commentWriteText
        },
        update: (store, { data: { submitComment } }) => {
          const data = store.readQuery({
            query: postCommentsGql,
            variables: { postId: this.postId }
          })
          data.postComments.unshift(submitComment)
          store.writeQuery({
            query: postCommentsGql,
            variables: { postId: this.postId },
            data
          })
        }
      })
      await this.$apollo.mutate({
        mutation: recordPostViewGql,
        variables: {
          postId: this.postId
        }
      })
      this.loading = false
      this.commentWriteText = ''
    }
  },
  head() {
    return {
      title: this.post.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.post.title} / Comet`
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: `Comet · ${this.post.commentCount} Comment${
            this.post.commentCount === 1 ? '' : 's'
          }`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            this.post.type === 'TEXT'
              ? this.post.textContent
                ? `${this.post.textContent.substring(0, 50)}${
                    this.post.textContent.length >= 50 ? '...' : ''
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
