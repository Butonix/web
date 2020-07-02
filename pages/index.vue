<template>
  <v-container fluid>
    <v-row>
      <v-col class="pt-0">
        <DynamicScroller
          :items="homeFeed"
          :min-item-size="80"
          :page-mode="true"
          :buffer="1000"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              v-intersect.quiet="showMore(index)"
              :item="item"
              :active="active"
              :size-dependencies="[item.title]"
              :index="index"
            >
              <div class="pb-3">
                <Post :key="item.id" :source="item" />
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </v-col>
      <v-col v-if="$device.isDesktop" cols="2" class="pt-0">
        <client-only>
          <div v-if="!discordHidden">
            <vue-friendly-iframe
              class="friendlyframe"
              :src="
                `https://discordapp.com/widget?id=653652395959648314${
                  $vuetify.theme.dark ? '&theme=dark' : '&theme=light'
                }${currentUser ? `&username=${currentUser.username}` : ''}`
              "
            />
            <div style="text-align: right" class="mb-4">
              <span
                class="text--secondary hoverable"
                style="font-size: .625rem"
                @click="hideDiscordWidget"
              >
                Hide Discord widget
              </span>
            </div>
          </div>
        </client-only>

        <div class="sticky">
          <TopicsSidebar />
          <InfoLinks class="mt-2" />
          <client-only>
            <div v-if="discordHidden" style="text-align: right">
              <span
                class="text--secondary hoverable"
                style="font-size: .625rem"
                @click="showDiscordWidget"
              >
                Show Discord widget
              </span>
            </div>
          </client-only>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TopicsSidebar from '../components/TopicsSidebar'
import Post from '../components/Post'
import InfoLinks from '../components/InfoLinks'
import homeFeedGql from '../gql/homeFeed.graphql'
// import globalStickiesGql from '../gql/globalStickies.graphql'
import currentUserGql from '../gql/currentUser.graphql'

export default {
  scrollToTop: false,
  components: { Post, InfoLinks, TopicsSidebar },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const homeFeedData = await client.query({
      query: homeFeedGql,
      fetchPolicy: 'cache-first'
    })

    return {
      homeFeed: homeFeedData.data.homeFeed
    }
  },
  data() {
    return {
      discordHidden: process.client
        ? !!localStorage.getItem('discordHidden')
        : true,
      homeFeed: [],
      globalStickies: [],
      hasMore: true,
      currentUser: null,
      postComponent: Post
    }
  },
  computed: {
    windowHeight() {
      if (process.client) return window.innerHeight
      else return 1920
    },
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
        types: this.$route.query.types
          ? this.$route.query.types.split('-').map((t) => t.toUpperCase())
          : []
      }
    }
  },
  watch: {
    $route: {
      deep: true,
      handler() {
        this.$store.commit('setHomeQuery', this.$route.query)
        this.$vuetify.goTo(0)
      }
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
    /* homeFeed: {
      query: homeFeedGql,
      variables() {
        return {
          ...this.vars
        }
      },
      fetchPolicy: 'cache-first'
    },
    globalStickies: {
      query: globalStickiesGql,
      fetchPolicy: 'cache-and-network'
    } */
  },
  methods: {
    hideDiscordWidget() {
      if (!process.client) return
      localStorage.setItem('discordHidden', 'true')
      this.discordHidden = true
    },
    showDiscordWidget() {
      if (!process.client) return
      localStorage.removeItem('discordHidden')
      this.discordHidden = false
    },
    showMore(index) {
      if (index !== this.homeFeed.length - 1) return
      if (this.$apollo.queries.homeFeed.loading) return
      console.log('showMore')
      console.log(index)
      if (this.$apollo.queries.homeFeed.loading) return
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

<style scoped>
.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 76px;
}
.friendlyframe >>> iframe {
  width: 100%;
  height: 400px;
}
</style>
