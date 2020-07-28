<template>
  <PostDialog v-model="dialog" :post="post" />
</template>

<script>
import PostDialog from '@/components/PostDialog'
import postGql from '@/gql/post'
import { postHead } from '@/util/postHead'

export default {
  components: { PostDialog },
  data() {
    return {
      dialog: true,
      post: null
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.$router.push('/')
      }
    }
  },
  apollo: {
    post: {
      query: postGql,
      variables() {
        return {
          postId: this.$route.params.id
        }
      }
    }
  },
  head() {
    return postHead(this.post)
  }
}
</script>

<style scoped></style>
