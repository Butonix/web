<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field
          v-model="searchText"
          :style="$device.isDesktop ? 'max-width: 35%' : ''"
          filled
          label="Search"
        />
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
        />
        <Post
          v-for="post in searchPosts.slice(
            searchPosts.length - 1,
            searchPosts.length
          )"
          :key="post.id"
          v-intersect.quiet="showMore"
          :post="post"
        />

        <v-progress-linear
          v-show="$apollo.queries.searchPosts.loading"
          indeterminate
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import searchPostsGql from '../../gql/searchPosts.graphql'
import Post from '../Post'
import SortMenu from '../buttons/SortMenu'

export default {
  name: 'SearchView',
  components: { SortMenu, Post },
  data() {
    return {
      searchPosts: [],
      searchText: this.$route.query.q,
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
    searchText() {
      if (this.$route.query.q === this.searchText) return
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, q: this.searchText }
      })
    },
    $route: {
      handler() {
        this.searchText = this.$route.query.q
      },
      deep: true
    },
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
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase()
        }
      },
      skip() {
        return !this.$route.query.q
      },
      debounce: 300,
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
    showMore() {
      if (!this.hasMore) return
      this.page++
      this.$apollo.queries.searchPosts.fetchMore({
        query: searchPostsGql,
        variables: {
          search: this.$route.query.q,
          page: this.page,
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase()
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.searchPosts
          if (newPosts.length === 0) this.hasMore = false
          return {
            searchPosts: [...previousResult.searchPosts, ...newPosts]
          }
        }
      })
    }
  }
}
</script>

<style scoped></style>
