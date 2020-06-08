<template>
  <v-row>
    <v-col>
      <v-row class="mx-0 mb-2" align="center">
        <div class="title mr-2">
          Search: {{ $route.query.q ? $route.query.q : '' }}
        </div>

        <SortMenu
          v-model="sort"
          :hot-enabled="false"
          :new-enabled="false"
          relevance-enabled
        />
      </v-row>

      <Post
        v-for="post in searchPosts.slice(0, searchPosts.length - 1)"
        :key="post.id"
        :post="post"
        class="mb-1"
      />
      <Post
        v-for="post in searchPosts.slice(
          searchPosts.length - 1,
          searchPosts.length
        )"
        :key="post.id"
        v-intersect.quiet="showMore"
        :post="post"
        class="mb-1"
      />

      <v-progress-linear
        v-show="$apollo.queries.searchPosts.loading"
        indeterminate
      />
    </v-col>
  </v-row>
</template>

<script>
import searchPostsGql from '../../gql/searchPosts.graphql'
import Post from '../Post'
import homeFeedGql from '../../gql/homeFeed.graphql'
import SortMenu from '../SortMenu'

export default {
  name: 'SearchView',
  components: { SortMenu, Post },
  data() {
    return {
      searchPosts: [],
      hasMore: true,
      sort: {
        sort:
          this.$route.query.sort &&
          ['top', 'relevance'].includes(this.$route.query.sort)
            ? this.$route.query.sort
            : 'relevance',
        time:
          this.$route.query.time &&
          ['hour', 'day', 'week', 'month', 'year', 'all'].includes(
            this.$route.query.time
          )
            ? this.$route.query.time
            : 'all'
      }
    }
  },
  computed: {
    page: {
      get() {
        return this.$store.state.searchPage
      },
      set(val) {
        this.$store.commit('setSearchPage', val)
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
        if (this.$route.query.q) query.q = this.$route.query.q
        this.$router.push({
          path: '/search',
          query
        })
      },
      deep: true
    }
  },
  apollo: {
    searchPosts: {
      query: searchPostsGql,
      variables() {
        return {
          search: this.$route.query.q,
          page: this.page,
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase()
        }
      },
      skip() {
        return !this.$route.query.q
      }
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
          time: this.sort.time.toUpperCase()
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
  }
}
</script>

<style scoped></style>
