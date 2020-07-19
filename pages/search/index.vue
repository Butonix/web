<template>
  <v-row justify="center">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <v-text-field
        v-if="!$device.isDesktop"
        v-model="searchText"
        solo
        flat
        label="Search"
        :append-icon="$vuetify.icons.values.mdiMagnify"
        autofocus
        hide-details
        class="mb-3"
        @keydown.enter="changeSearch"
      />

      <div
        v-if="!$route.query || !$route.query.q"
        style="text-align: center"
        class="text-h6"
      >
        No search entered.
      </div>

      <div v-else class="text-h6 pb-3">Searching for: {{ $route.query.q }}</div>

      <DynamicScroller page-mode :items="searchPosts" :min-item-size="54">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :index="index"
            :size-dependencies="[item.title, item.textContent]"
          >
            <div class="pb-3">
              <Post :post="item" :index="index" :active="active" />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <v-progress-linear
        v-show="$apollo.queries.searchPosts.loading"
        indeterminate
      />
    </v-col>
  </v-row>
</template>

<script>
import searchPostsGql from '../../gql/searchPosts.graphql'
import Post from '@/components/post/Post'

export default {
  components: { Post },
  data() {
    return {
      searchPosts: [],
      searchText: this.$route.query.q,
      hasMore: true,
      page: 0
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.query && this.$route.query.q !== this.searchText) {
          this.searchText = this.$route.query.q
        }
      },
      deep: true
    }
  },
  apollo: {
    searchPosts: {
      query: searchPostsGql,
      variables() {
        return {
          search:
            this.$route.query && this.$route.query.q ? this.$route.query.q : ''
        }
      },
      skip() {
        return this.$route.name !== 'search'
      }
    }
  },
  methods: {
    changeSearch() {
      if (this.searchText) {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, q: this.searchText }
        })
      } else {
        this.searchPosts = []
        const query = Object.assign({}, this.$route.query)
        delete query.q
        this.$router.push({ path: this.$route.path, query })
      }
    },
    showMore() {
      if (!this.hasMore) return
      this.page++
      this.$apollo.queries.searchPosts.fetchMore({
        query: searchPostsGql,
        variables: {
          search: this.$route.query.q,
          page: this.page
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
