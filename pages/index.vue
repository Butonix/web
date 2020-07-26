<template>
  <v-row justify="center">
    <v-col :class="$device.isDesktop ? '' : 'px-0'">
      <div class="mb-3">
        <SortBar v-if="$device.isDesktop" />

        <v-row v-else no-gutters class="px-3">
          <v-spacer />
          <SortMenu />
        </v-row>
      </div>

      <div
        :style="{
          'border-style': $device.isDesktop ? 'solid' : 'none',
          'border-width': '1px',
          'border-color': $vuetify.theme.dark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.12)',
          'border-top-left-radius': $device.isDesktop ? '10px' : '0',
          'border-top-right-radius': $device.isDesktop ? '10px' : '0',
          'border-bottom-style': 'none',
          'border-top-style': 'solid'
        }"
      >
        <DynamicScroller
          page-mode
          :items="feed"
          :min-item-size="54"
          :buffer="500"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :index="index"
              :size-dependencies="[item.title, item.textContent]"
            >
              <div
                :style="{
                  'border-bottom-style': 'solid',
                  'border-bottom-width': '1px',
                  'border-bottom-color': $vuetify.theme.dark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.12)'
                }"
              >
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
      </div>

      <div class="pt-3">
        <v-progress-linear
          v-show="$apollo.queries.feed.loading"
          indeterminate
        />
      </div>
    </v-col>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <div class="pb-3">
          <PopularPlanetsCard />
        </div>
        <InfoLinks class="mt-2" />
      </div>
    </v-col>

    <PostDialog v-model="dialog" :post="selectedPost" />
  </v-row>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import InfoLinks from '../components/InfoLinks'
import feedGql from '../gql/feed.graphql'
import Post from '../components/post/Post'
import PopularPlanetsCard from '@/components/PopularPlanetsCard'
import PostDialog from '@/components/PostDialog'
import SortBar from '@/components/bars/SortBar'
import SortMenu from '@/components/buttons/home_sort/SortMenu'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    SortMenu,
    SortBar,
    PostDialog,
    PopularPlanetsCard,
    Post,
    InfoLinks,
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      feed: [],
      hasMore: true,
      page: 0,
      query: {},
      dialog: false,
      selectedPost: null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'p-name-comments-id-title') {
      if (!this.dialog) {
        this.displayDialog(to)
      } else if (this.$device.isDesktop) {
        window.history.back()
        this.hideDialog()
      }
    } else {
      next()
    }
  },
  computed: {
    vars() {
      return {
        sort:
          this.query && this.query.sort ? this.query.sort.toUpperCase() : 'HOT',
        time: this.query && this.query.t ? this.query.t.toUpperCase() : 'ALL',
        filter: this.$route.name === 'universe' ? 'ALL' : 'MYPLANETS',
        types:
          this.query && this.query.types
            ? this.query.types.split('-').map((t) => t.toUpperCase())
            : []
      }
    }
  },
  watch: {
    '$route.query': {
      deep: true,
      handler() {
        if (this.$route.name === 'index' || this.$route.name === 'universe') {
          this.query = this.$route.query
        }
      }
    },
    dialog() {
      if (!this.dialog) this.hideDialog()
    }
  },
  activated() {
    this.query = this.$route.query
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
        return this.$route.name !== 'index' && this.$route.name !== 'universe'
      }
    }
  },
  methods: {
    displayDialog(route) {
      window.history.pushState({}, null, route.path)
      this.dialog = true
      this.selectedPost = this.feed.find((p) => p.id === route.params.id)
    },
    hideDialog() {
      this.dialog = false
    },
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
>>> .v-list-item--link:before {
  opacity: 0 !important;
}
</style>
