<template>
  <PostDialog v-model="dialog" :post-id="$route.params.id" />
</template>

<script>
import PostDialog from '@/components/PostDialog'
import postGql from '@/gql/post'

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
            content:
              this.post.type === 'IMAGE'
                ? this.post.link
                : this.post.thumbnailUrl
                ? this.post.thumbnailUrl
                : ''
          }
        ]
      }
  }
}
</script>

<style scoped></style>
