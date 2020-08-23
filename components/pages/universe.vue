<template>
  <div>
    <v-container class="pt-0">
      <v-row justify="center">
        <v-col :class="$device.isDesktop ? '' : 'px-0'">
          <UniverseBar />

          <PostsScroller
            v-model="dialog"
            :loading="loadingMore"
            :items="feed"
            :selected-post="selectedPost"
            @togglehidden="toggleHidden"
            @toggleblock="toggleBlock"
            @infinite="showMore"
          />
        </v-col>
        <v-col v-if="$device.isDesktop" cols="3" class="pl-0">
          <div class="sticky">
            <PopularPlanetsCard :popular-planets="popularPlanets" />
            <InfoLinks class="mt-3" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import PopularPlanetsCard from '@/components/planet/PopularPlanetsCard'
import { postHead } from '@/util/postHead'
import InfoLinks from '@/components/InfoLinks'
import UniverseBar from '@/components/bars/UniverseBar'
import popularPlanetsGql from '@/gql/popularPlanets'
import feedGql from '@/gql/feed'
import { feedVars } from '@/util/feedVars'

export default {
  name: 'Universe',
  scrollToTop: false,
  components: {
    UniverseBar,
    InfoLinks,
    PopularPlanetsCard,
    PostsScroller
  },
  mixins: [postDialogMixin],
  async asyncData({ app, params, query, route }) {
    const client = app.apolloProvider.defaultClient
    const popularPlanetsQuery = await client.query({
      query: popularPlanetsGql
    })
    const feedQuery = await client.query({
      query: feedGql,
      variables: feedVars(params, query, route),
      fetchPolicy: 'network-only'
    })
    return {
      popularPlanets: popularPlanetsQuery.data.popularPlanets,
      feed: feedQuery.data.feed
    }
  },
  data() {
    return {
      popularPlanets: []
    }
  },
  head() {
    if (this.selectedPost && this.dialog) return postHead(this.selectedPost)
    else
      return {
        title: 'Universe'
      }
  }
}
</script>

<style scoped></style>
