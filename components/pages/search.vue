<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col :class="$device.isDesktop ? '' : 'pa-0'">
          <PostsScroller
            v-model="dialog"
            :loading="$apollo.queries.feed.loading"
            :items="feed"
            :selected-post="selectedPost"
            @togglehidden="toggleHidden"
            @toggleblock="toggleBlock"
          />
        </v-col>
        <!--<v-col v-if="$device.isDesktop" cols="3">
          <div class="sticky">

          </div>
        </v-col>-->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import { postHead } from '@/util/postHead'

export default {
  name: 'Search',
  scrollToTop: false,
  components: {
    PostsScroller
  },
  mixins: [postDialogMixin],
  head() {
    if (this.selectedPost && this.dialog) return postHead(this.selectedPost)
    else
      return {
        title: `"${this.$route.query.q}"`
      }
  }
}
</script>

<style scoped></style>
