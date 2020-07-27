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
          :buffer="3000"
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
                class="pa-3"
              >
                <Post
                  :post="item"
                  :index="index"
                  :active="active"
                  :expanded-view="$route.query.view === 'expanded'"
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
        <template v-if="$route.name === 'u-username'">
          <UserSummaryCard v-if="user" :user="user" />
        </template>

        <template v-else-if="$route.name === 'p-name'">
          <div v-if="planet">
            <PlanetInfoCard class="mb-3" :planet="planet" />
            <PlanetRulesCard class="mb-3" :planet="planet" />
            <PlanetModsCard :planet="planet" />
          </div>
        </template>

        <template v-else>
          <v-card
            v-if="!$store.state.currentUser"
            flat
            :outlined="!$vuetify.theme.dark"
            class="mb-3"
          >
            <v-card-title>Customize your Planets</v-card-title>
            <v-card-subtitle
              >Sign up on Comet to join Planets and create your personalized
              feed.</v-card-subtitle
            >
            <v-card-actions>
              <v-spacer />
              <v-btn depressed text class="mr-2">Log In</v-btn>
              <v-btn depressed color="primary">Sign Up</v-btn>
            </v-card-actions>
          </v-card>

          <PopularPlanetsCard />
        </template>

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
import userGql from '../gql/user.graphql'
import planetGql from '../gql/planet.graphql'
import Post from '../components/post/Post'
import PopularPlanetsCard from '@/components/PopularPlanetsCard'
import PostDialog from '@/components/PostDialog'
import SortBar from '@/components/bars/SortBar'
import SortMenu from '@/components/buttons/home_sort/SortMenu'
import UserSummaryCard from '@/components/user/UserSummaryCard'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import PlanetRulesCard from '@/components/planet/PlanetRulesCard'
import PlanetModsCard from '@/components/planet/PlanetModsCard'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    PlanetModsCard,
    PlanetRulesCard,
    PlanetInfoCard,
    UserSummaryCard,
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
      dialog: false,
      selectedPost: null,
      user: null,
      planet: null
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
      let sort = 'HOT'
      if (this.$route.name.includes('new')) sort = 'NEW'
      else if (this.$route.name.includes('top-time')) sort = 'TOP'

      let time = 'ALL'
      if (this.$route.name.includes('top-time'))
        time = this.$route.params.time.toUpperCase()

      return {
        sort,
        time,
        filter: this.$route.name === 'index' ? 'MYPLANETS' : 'ALL',
        types:
          this.$route.query && this.$route.query.types
            ? this.$route.query.types.split('-').map((t) => t.toUpperCase())
            : [],
        username: this.$route.params.username,
        planetName: this.$route.params.name
      }
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) this.hideDialog()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
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
      fetchPolicy: 'network-only'
    },
    user: {
      query: userGql,
      variables() {
        return {
          username: this.$route.params.username
        }
      },
      skip() {
        return !this.$route.params.username
      }
    },
    planet: {
      query: planetGql,
      variables() {
        return {
          planetName: this.$route.params.name
        }
      },
      skip() {
        return !this.$route.params.name
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
    handleScroll(e) {
      if (!process.client) return
      const totalPageHeight = document.body.scrollHeight
      const scrollPoint = window.scrollY + window.innerHeight
      if (scrollPoint >= totalPageHeight - 3000) {
        this.showMore()
      }
    },
    showMore() {
      if (this.$apollo.queries.feed.loading || !this.hasMore) return
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
