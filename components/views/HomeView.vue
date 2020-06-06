<template>
  <v-row>
    <v-col class="pt-0">
      <v-row class="mx-0 mb-2" align="center">
        <v-btn text small nuxt to="/" class="mr-1">All</v-btn>
        <v-btn text small nuxt to="/following" class="mr-1"
          >Following Only</v-btn
        >
        <v-divider vertical class="mr-1" />
        <SortMenu v-model="sort" />
      </v-row>
      <Post v-for="post in homeFeed" :key="post.id" :post="post" class="mb-1" />
    </v-col>
    <v-col v-if="$device.isDesktop" cols="2">
      <TopicsSidebar />
    </v-col>
  </v-row>
</template>

<script>
import homeFeedGql from '../../gql/homeFeed.graphql'
import TopicsSidebar from '../TopicsSidebar'
import SortMenu from '../SortMenu'
import Post from '../Post'

export default {
  name: 'HomeView',
  components: { Post, SortMenu, TopicsSidebar },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const homeFeedData = await client.query({
      query: homeFeedGql
    })

    return {
      homeFeed: homeFeedData.data.homeFeed
    }
  },
  data() {
    return {
      homeFeed: [],
      sort: {
        sort: 'TOP',
        time: 'DAY'
      }
    }
  },
  head: {
    title: 'Home'
  }
}
</script>
