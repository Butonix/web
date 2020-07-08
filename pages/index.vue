<template>
  <v-container>
    <v-row>
      <v-col v-if="$device.isDesktop" cols="3">
        <div class="sticky">
          <UserSideCard />
        </div>
      </v-col>
      <v-col>
        <DynamicScroller
          page-mode
          :items="globalStickies.concat(homeFeed)"
          :min-item-size="54"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :index="index"
              :size-dependencies="[item.title, item.textContent]"
            >
              <ItemComponent :source="item" :index="index" :active="active" />
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>

        <v-progress-linear
          v-show="$apollo.queries.homeFeed.loading"
          indeterminate
        />
      </v-col>
      <v-col v-if="$device.isDesktop" cols="3">
        <div class="sticky">
          <TopicsSidebar />
          <InfoLinks class="mt-2" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TopicsSidebar from '../components/TopicsSidebar'
import InfoLinks from '../components/InfoLinks'
import homeFeedGql from '../gql/homeFeed.graphql'
import globalStickiesGql from '../gql/globalStickies.graphql'
import ItemComponent from '../components/ItemComponent'
import Post from '../components/Post'
import UserSideCard from '../components/UserSideCard'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    UserSideCard,
    ItemComponent,
    InfoLinks,
    TopicsSidebar
  },
  data() {
    return {
      discordHidden: process.client
        ? !!localStorage.getItem('discordHidden')
        : true,
      homeFeed: [],
      globalStickies: [],
      hasMore: true,
      postComponent: Post,
      itemComponent: ItemComponent
    }
  },
  computed: {
    vars() {
      return {
        sort: this.$store.state.homeQuery.sort
          ? this.$store.state.homeQuery.sort.toUpperCase()
          : 'HOT',
        time: this.$store.state.homeQuery.time
          ? this.$store.state.homeQuery.time.toUpperCase()
          : 'ALL',
        filter: this.$store.state.homeQuery.feed
          ? this.$store.state.homeQuery.feed.toUpperCase()
          : 'ALL',
        types: this.$store.state.homeQuery.types
          ? this.$store.state.homeQuery.types
              .split('-')
              .map((t) => t.toUpperCase())
          : []
      }
    },
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
    $route: {
      deep: true,
      handler() {
        if (this.$route.path === '/') {
          const oldQuery = this.$store.state.homeQuery
          if (
            oldQuery.sort !== this.$route.query.sort ||
            oldQuery.time !== this.$route.query.time ||
            oldQuery.feed !== this.$route.query.feed ||
            oldQuery.types !== this.$route.query.types
          ) {
            this.$store.commit('setHomeQuery', this.$route.query)
            this.$store.commit('setHomeFeedPage', 0)
            if (process.client) {
              window.scrollTo(0, 0)
            }
          }
        }
      }
    }
  },
  created() {
    if (this.$route.path === '/') {
      this.$store.commit('setHomeQuery', this.$route.query)
    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll)
  },
  deactivated() {
    window.addEventListener('scroll', this.handleScroll)
  },
  apollo: {
    homeFeed: {
      query: homeFeedGql,
      variables() {
        return {
          ...this.vars
        }
      },
      skip() {
        return this.$route.path !== '/'
      },
      fetchPolicy: 'cache-first'
    },
    globalStickies: {
      query: globalStickiesGql,
      fetchPolicy: 'cache-first'
    }
  },
  methods: {
    handleScroll(e) {
      const totalPageHeight = document.body.scrollHeight
      const scrollPoint = window.scrollY + window.innerHeight
      if (scrollPoint >= totalPageHeight) {
        this.showMore()
      }
    },
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
    showMore() {
      if (
        this.$apollo.queries.homeFeed.loading ||
        !this.hasMore ||
        this.$route.path !== '/'
      )
        return
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
  top: 88px;
}
.friendlyframe >>> iframe {
  width: 100%;
  height: 400px;
}

.frame {
  width: 100%;
  height: 400px;
}
</style>
