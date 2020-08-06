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
        <v-col v-if="$device.isDesktop" cols="3">
          <div class="sticky">
            <GalaxyInfoCard :galaxy="galaxy" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import GalaxyInfoCard from '@/components/GalaxyInfoCard'
import galaxyGql from '@/gql/galaxy.graphql'

export default {
  name: 'Galaxy',
  scrollToTop: false,
  components: {
    GalaxyInfoCard,
    PostsScroller
  },
  mixins: [postDialogMixin],
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({
      query: galaxyGql,
      variables: { galaxyName: context.params.galaxyname }
    })
    return {
      galaxy: data.galaxy
    }
  },
  data() {
    return {
      galaxy: null
    }
  }
}
</script>

<style scoped></style>
