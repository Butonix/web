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

export default {
  name: 'Search',
  scrollToTop: false,
  components: {
    PostsScroller
  },
  mixins: [postDialogMixin]
  /* asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = client.query({
      query: planetGql,
      variables: { planetName: context.params.planetname }
    })
    return {
      planet: data.planet
    }
  },
  data() {
    return {
      planet: null
    }
  },
  apollo: {
    planet: {
      query: planetGql,
      variables() {
        return {
          planetName: this.$route.params.planetname
        }
      }
    }
  } */
}
</script>

<style scoped></style>
