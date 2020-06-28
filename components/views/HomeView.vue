<template>
  <v-container fluid>
    <v-row>
      <v-col class="pt-0">
        <div v-if="filter === 'all'">
          <Post
            v-for="post in globalStickies"
            :key="post.id"
            :post="post"
            sticky
          />
        </div>

        <Post
          v-for="post in homeFeed.slice(0, homeFeed.length - 1)"
          :key="post.id"
          :post="post"
        />
        <Post
          v-for="post in homeFeed.slice(homeFeed.length - 1, homeFeed.length)"
          :key="post.id"
          v-intersect.quiet="showMore"
          :post="post"
        />

        <v-progress-linear
          v-show="$apollo.queries.homeFeed.loading"
          indeterminate
        />
      </v-col>
      <v-col v-if="$device.isDesktop" cols="2">
        <TopicsSidebar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import homeFeedGql from '../../gql/homeFeed.graphql'
import globalStickiesGql from '../../gql/globalStickies.graphql'
import TopicsSidebar from '../TopicsSidebar'
import Post from '../Post'
import currentUserGql from '../../gql/currentUser.graphql'

export default {
  name: 'HomeView',
  components: { Post, TopicsSidebar },
  data() {
    return {
      homeFeed: [],
      globalStickies: [],
      hasMore: true,
      currentUser: null,
      sort: {
        sort:
          this.$route.query.s &&
          ['new', 'top', 'hot'].includes(this.$route.query.s)
            ? this.$route.query.s
            : 'hot',
        time:
          this.$route.query.t &&
          ['hour', 'day', 'week', 'month', 'year', 'all'].includes(
            this.$route.query.t
          )
            ? this.$route.query.t
            : 'all'
      },
      filter:
        this.$route.query.f &&
        ['all', 'following'].includes(this.$route.query.f)
          ? this.$route.query.f
          : 'all',
      type:
        this.$route.query.type &&
        ['all', 'text', 'link'].includes(this.$route.query.type)
          ? this.$route.query.type
          : 'all'
    }
  },
  computed: {
    page: {
      get() {
        return this.$store.state.homeFeedPage
      },
      set(val) {
        this.$store.commit('setHomeFeedPage', val)
      }
    }
  },
  watch: {
    async type(type) {
      await this.$router.push({
        path: '/',
        query: { ...this.$route.query, type }
      })
      this.$store.commit('setHomeQuery', this.$route.query)
    },
    async filter(filter) {
      await this.$router.push({
        path: '/',
        query: { ...this.$route.query, f: filter }
      })
      this.$store.commit('setHomeQuery', this.$route.query)
    },
    sort: {
      async handler(sort) {
        await this.$router.push({
          path: '/',
          query: { ...this.$route.query, s: sort.sort, t: sort.time }
        })
        this.$store.commit('setHomeQuery', this.$route.query)
      },
      deep: true
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    },
    homeFeed: {
      query: homeFeedGql,
      variables() {
        return {
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase(),
          filter: this.currentUser ? this.filter.toUpperCase() : 'ALL',
          type: this.type.toUpperCase()
        }
      },
      fetchPolicy: 'cache-and-network'
    },
    globalStickies: {
      query: globalStickiesGql,
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
    showMore() {
      if (!this.hasMore) return
      this.page++
      this.$apollo.queries.homeFeed.fetchMore({
        query: homeFeedGql,
        variables: {
          page: this.page,
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase(),
          filter: this.filter.toUpperCase(),
          type: this.type.toUpperCase()
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.homeFeed
          if (newPosts.length === 0) this.hasMore = false
          return {
            homeFeed: [...previousResult.homeFeed, ...newPosts]
          }
        }
      })
    }
  },
  head: {
    title: 'Home'
  }
}
</script>
