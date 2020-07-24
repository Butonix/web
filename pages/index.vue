<template>
  <v-row>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <UserSideCard />
        <Tip class="mt-2" />
      </div>
    </v-col>
    <v-col>
      <v-row no-gutters class="pb-3">
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
            $route.query && $route.query.feed === 'mytopics' ? 'primary' : ''
          "
          @click="chooseMyTopics"
        >
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiNewspaper
          }}</v-icon>
          My Topics
        </v-btn>

        <v-spacer />

        <TypeMenu v-if="$device.isDesktop" />

        <SortMenu />
      </v-row>

      <DynamicScroller page-mode :items="feed" :min-item-size="54">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :index="index"
            :size-dependencies="[item.title, item.textContent]"
          >
            <div class="pb-3">
              <Post
                :post="item"
                :index="index"
                :active="active"
                @togglehidden="toggleHidden"
                @toggleblock="toggleBlock"
              />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <v-progress-linear v-show="$apollo.queries.feed.loading" indeterminate />
    </v-col>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <InfoLinks class="mt-2" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import InfoLinks from '../components/InfoLinks'
import feedGql from '../gql/feed.graphql'
import Post from '../components/post/Post'
import UserSideCard from '../components/user/UserSideCard'
import TypeMenu from '../components/buttons/type/TypeMenu'
import SortMenu from '../components/buttons/home_sort/SortMenu'
import Tip from '@/components/Tip'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    Tip,
    SortMenu,
    TypeMenu,
    UserSideCard,
    Post,
    InfoLinks,
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      feed: [],
      hasMore: true,
      page: 0
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
            this.feed = []
            this.$store.commit('setHomeQuery', this.$route.query)
            this.page = 0
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
    window.removeEventListener('scroll', this.handleScroll)
  },
  apollo: {
    feed: {
      query: feedGql,
      variables() {
        return {
          ...this.vars
        }
      },
      skip() {
        return this.$route.name !== 'index'
      }
    }
  },
  methods: {
    toggleHidden() {
      this.$apollo.provider.defaultClient.cache.writeQuery({
        query: feedGql,
        variables: {
          ...this.vars
        },
        data: { feed: this.feed.filter((p) => !p.isHidden) }
      })
    },
    toggleBlock() {
      this.$apollo.provider.defaultClient.cache.writeQuery({
        query: feedGql,
        variables: {
          ...this.vars
        },
        data: { feed: this.feed.filter((p) => !p.author.isBlocking) }
      })
    },
    chooseAll() {
      const query = Object.assign({}, this.$route.query)
      delete query.feed
      this.$router.push({ path: this.$route.path, query })
    },
    chooseMyTopics() {
      if (!this.$store.state.currentUser) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Must log in to view My Topics'
        })
        return
      }

      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, feed: 'mytopics' }
      })
    },
    handleScroll(e) {
      if (!process.client) return
      const totalPageHeight = document.body.scrollHeight
      const scrollPoint = window.scrollY + window.innerHeight
      if (scrollPoint >= totalPageHeight - 200) {
        this.showMore()
      }
    },
    showMore() {
      if (
        this.$apollo.queries.feed.loading ||
        !this.hasMore ||
        this.$route.path !== '/'
      )
        return
      this.page++
      this.$apollo.queries.feed.fetchMore({
        query: feedGql,
        variables: {
          page: this.page,
          ...this.vars
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.feed
          if (newPosts.length === 0) this.hasMore = false
          return {
            feed: [...previousResult.feed, ...newPosts]
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
