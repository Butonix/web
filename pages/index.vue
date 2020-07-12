<template>
  <v-container class="pt-0">
    <v-row>
      <v-col v-if="$device.isDesktop" cols="3">
        <div class="sticky">
          <UserSideCard />
        </div>
      </v-col>
      <v-col>
        <v-row no-gutters class="pb-3">
          <TypeMenu v-if="false" />

          <template v-else>
            <v-btn
              small
              text
              rounded
              class="mr-1 font-weight-regular"
              :color="!$route.query || !$route.query.feed ? 'primary' : ''"
              @click="chooseAll"
            >
              <v-icon size="20" class="mr-2">{{
                $vuetify.icons.values.mdiInfinity
              }}</v-icon>
              All
            </v-btn>

            <v-btn
              small
              text
              rounded
              class="font-weight-regular"
              :color="
                $route.query && $route.query.feed === 'mytopics'
                  ? 'primary'
                  : ''
              "
              @click="chooseMyTopics"
            >
              <v-icon size="20" class="mr-2">{{
                $vuetify.icons.values.mdiNewspaper
              }}</v-icon>
              My Topics
            </v-btn>
          </template>

          <v-spacer />
          <HomeSortMenu />
        </v-row>

        <DynamicScroller
          page-mode
          :items="globalStickies.concat(homeFeed)"
          :min-item-size="20"
        >
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
import TopicsSidebar from '../components/topic/TopicsSidebar'
import InfoLinks from '../components/InfoLinks'
import homeFeedGql from '../gql/homeFeed.graphql'
import globalStickiesGql from '../gql/globalStickies.graphql'
import Post from '../components/post/Post'
import UserSideCard from '../components/user/UserSideCard'
import TypeMenu from '../components/buttons/home_type/HomeTypeMenu'
import HomeSortMenu from '../components/buttons/home_sort/HomeSortMenu'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    HomeSortMenu,
    TypeMenu,
    UserSideCard,
    Post,
    InfoLinks,
    TopicsSidebar
  },
  data() {
    return {
      homeFeed: [],
      globalStickies: [],
      hasMore: true
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
            this.homeFeed = []
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
        return this.$route.name !== 'index'
      }
    },
    globalStickies: {
      query: globalStickiesGql,
      skip() {
        return this.$route.name !== 'index'
      }
    }
  },
  methods: {
    chooseAll() {
      const query = Object.assign({}, this.$route.query)
      delete query.feed
      this.$router.push({ path: this.$route.path, query })
    },
    chooseMyTopics() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must login to view My Topics'
        })
        return
      }

      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, feed: 'mytopics' }
      })
    },
    handleScroll(e) {
      const totalPageHeight = document.body.scrollHeight
      const scrollPoint = window.scrollY + window.innerHeight
      if (scrollPoint >= totalPageHeight - 200) {
        this.showMore()
      }
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
.friendlyframe >>> iframe {
  width: 100%;
  height: 400px;
}

.frame {
  width: 100%;
  height: 400px;
}
</style>
