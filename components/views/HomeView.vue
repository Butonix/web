<template>
  <v-row>
    <v-col class="pt-0">
      <v-row class="mx-0 mb-2" align="center">
        <v-btn
          text
          small
          class="mr-1"
          :class="filter === 'all' ? '' : 'text--secondary'"
          :outlined="filter === 'all'"
          @click="filterAll"
          >All</v-btn
        >
        <v-btn
          v-if="currentUser"
          text
          small
          class="mr-1"
          :class="filter === 'following' ? '' : 'text--secondary'"
          :outlined="filter === 'following'"
          @click="filterFollowing"
          >Following Only</v-btn
        >
        <v-divider vertical class="mr-1" />
        <SortMenu v-model="sort" />
      </v-row>

      <div v-if="filter === 'all'">
        <Post
          v-for="post in globalStickies"
          :key="post.id"
          :post="post"
          sticky
          class="mb-1"
        />
      </div>

      <Post
        v-for="post in homeFeed.slice(0, homeFeed.length - 1)"
        :key="post.id"
        :post="post"
        class="mb-1"
      />
      <Post
        v-for="post in homeFeed.slice(homeFeed.length - 1, homeFeed.length)"
        :key="post.id"
        v-intersect.quiet="showMore"
        :post="post"
        class="mb-1"
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
</template>

<script>
import homeFeedGql from '../../gql/homeFeed.graphql'
import globalStickiesGql from '../../gql/globalStickies.graphql'
import TopicsSidebar from '../TopicsSidebar'
import SortMenu from '../SortMenu'
import Post from '../Post'
import currentUserGql from '../../gql/currentUser.graphql'

export default {
  name: 'HomeView',
  components: { Post, SortMenu, TopicsSidebar },
  data() {
    return {
      homeFeed: [],
      globalStickies: [],
      hasMore: true,
      currentUser: null,
      sort: {
        sort:
          this.$route.query.sort &&
          ['new', 'top', 'hot'].includes(this.$route.query.sort)
            ? this.$route.query.sort
            : 'hot',
        time:
          this.$route.query.time &&
          ['hour', 'day', 'week', 'month', 'year', 'all'].includes(
            this.$route.query.time
          )
            ? this.$route.query.time
            : 'all'
      },
      filter:
        this.$route.query.filter &&
        ['all', 'following'].includes(this.$route.query.filter)
          ? this.$route.query.filter
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
    sort: {
      handler(val) {
        let query
        if (val.sort === 'top')
          query = {
            sort: val.sort,
            time: val.time
          }
        else query = { sort: val.sort }
        const filter = this.$route.query.filter
        if (filter) query.filter = filter
        this.$router.push({
          path: '/',
          query
        })
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
          filter: this.currentUser ? this.filter.toUpperCase() : 'ALL'
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
    filterFollowing() {
      this.filter = 'following'
      const query = { ...this.$route.query, filter: this.filter }
      this.$router.push({ path: '/', query })
    },
    filterAll() {
      this.filter = 'all'
      const query = Object.assign({}, this.$route.query)
      delete query.filter
      this.$router.push({ path: '/', query })
    },
    showMore() {
      if (!this.hasMore) return
      this.page++
      this.$apollo.queries.homeFeed.fetchMore({
        query: homeFeedGql,
        variables: {
          page: this.page,
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase(),
          filter: this.filter.toUpperCase()
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
