<template>
  <div>
    <PostDialog v-model="dialog" :post="post" standalone />
  </div>
</template>

<script>
import PostDialog from '@/components/PostDialog'
import postGql from '@/gql/post'
import { postHead } from '@/util/postHead'

export default {
  name: 'PostStandalone',
  components: { PostDialog },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({
      query: postGql,
      variables: { postId: context.params.id }
    })
    return {
      post: data.post
    }
  },
  data() {
    return {
      dialog: true,
      post: null
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
