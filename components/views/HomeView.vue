<template>
  <v-container fluid>
    <v-row>
      <!--<v-col v-if="$device.isDesktop" cols="2" class="pt-0">
        <v-card outlined style="background-color: transparent">
          <v-list-item>
            <v-list-item-avatar color="grey darken-3">
              <v-icon small>{{ icons.profile }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ currentUser.username }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>-->
      <v-col class="pt-0">
        <div v-if="!$route.query.feed">
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
      <v-col v-if="$device.isDesktop" cols="2" class="pt-0">
        <TopicsSidebar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiAccountOutline } from '@mdi/js'
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
      icons: {
        profile: mdiAccountOutline
      }
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
    },
    vars() {
      return {
        sort: this.$route.query.sort
          ? this.$route.query.sort.toUpperCase()
          : 'HOT',
        time: this.$route.query.time
          ? this.$route.query.time.toUpperCase()
          : 'ALL',
        filter: this.$route.query.feed
          ? this.$route.query.feed.toUpperCase()
          : 'ALL',
        types: this.$route.query.types ? this.$route.query.types.split('-') : []
      }
    }
  },
  watch: {
    watch: {
      $route: {
        deep: true,
        handler() {
          this.$store.commit('setHomeQuery', this.$route.query)
        }
      }
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
          ...this.vars
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
          ...this.vars
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
