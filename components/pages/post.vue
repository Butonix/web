<template>
  <div>
    <PostDialog
      v-model="dialog"
      :post="post"
      standalone
      :comments="postComments"
    />
  </div>
</template>

<script>
import PostDialog from '@/components/pages/PostDialog'
import postGql from '@/gql/post'
import postCommentsGql from '@/gql/postComments'
import { postHead } from '@/util/postHead'

export default {
  name: 'PostStandalone',
  components: { PostDialog },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const postQuery = await client.query({
      query: postGql,
      variables: { postId: context.params.id },
      fetchPolicy: 'network-only'
    })
    const postCommentsQuery = await client.query({
      query: postCommentsGql,
      variables: { postId: context.params.id },
      fetchPolicy: 'network-only'
    })
    return {
      post: postQuery.data.post,
      postComments: postCommentsQuery.data.postComments
    }
  },
  data() {
    return {
      dialog: true,
      post: null,
      postComments: []
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.$router.push({
          name: 'p-planetname-sort-time',
          params: { planetname: this.$route.params.planetname }
        })
      }
    }
  },
  head() {
    return postHead(this.post)
  }
}
</script>

<style scoped></style>
