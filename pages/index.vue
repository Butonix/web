<template>
  <v-container fluid>
    <v-row>
      <v-col class="pt-0">
        <!--<DynamicScroller
          :items="globalStickies.concat(homeFeed)"
          :min-item-size="92"
          :page-mode="true"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              v-intersect.quiet="showMore(index)"
              :item="item"
              :active="active"
              :size-dependencies="[item.title, item.topics]"
              :index="index"
            >
              <div class="pb-3">
                <Post :key="item.id" :source="item" />
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>-->

        <!--<list-scroller
          :item-component="postComponent"
          :items-data="homeFeed"
          :item-height="80"
          @bottom="showMore"
        />-->

        <virtual-list
          :data-key="'id'"
          :data-sources="homeFeed"
          :data-component="postComponent"
          :estimate-size="92"
          page-mode
          role="list"
          @tobottom="showMore"
        >
          <div slot="footer">
            <v-progress-linear
              v-show="$apollo.queries.homeFeed.loading"
              indeterminate
            />
          </div>
        </virtual-list>
      </v-col>
      <v-col v-if="$device.isDesktop" cols="2" class="pt-0">
        <client-only>
          <div v-if="!discordHidden">
            <iframe
              :src="
                `https://discordapp.com/widget?id=653652395959648314${
                  $vuetify.theme.dark ? '&theme=dark' : '&theme=light'
                }${currentUser ? `&username=${currentUser.username}` : ''}`
              "
              class="frame"
              allowtransparency="true"
              frameborder="0"
            />
            <!--<vue-friendly-iframe
              class="friendlyframe"
              :src="
                `https://discordapp.com/widget?id=653652395959648314${
                  $vuetify.theme.dark ? '&theme=dark' : '&theme=light'
                }${currentUser ? `&username=${currentUser.username}` : ''}`
              "
            />-->
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
import VirtualList from 'vue-virtual-scroll-list'
import TopicsSidebar from '../components/TopicsSidebar'
import Post from '../components/Post'
import InfoLinks from '../components/InfoLinks'
import homeFeedGql from '../gql/homeFeed.graphql'
import globalStickiesGql from '../gql/globalStickies.graphql'
import currentUserGql from '../gql/currentUser.graphql'

const vars = (query) => {
  return {
    sort: query.sort ? query.sort.toUpperCase() : 'HOT',
    time: query.time ? query.time.toUpperCase() : 'ALL',
    filter: query.feed ? query.feed.toUpperCase() : 'ALL',
    types: query.types ? query.types.split('-').map((t) => t.toUpperCase()) : []
  }
}

export default {
  scrollToTop: false,
  components: { InfoLinks, TopicsSidebar, 'virtual-list': VirtualList },
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
        this.$store.commit('setHomeQuery', this.$route.query)
        this.$vuetify.goTo(0)
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
          ...vars(this.$route.query)
        }
      },
      fetchPolicy: 'cache-first'
    },
    globalStickies: {
      query: globalStickiesGql,
      fetchPolicy: 'cache-first'
    }
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
    showMore() {
      if (this.$apollo.queries.homeFeed.loading) return
      if (!this.hasMore) return
      this.page++
      this.$apollo.queries.homeFeed.fetchMore({
        query: homeFeedGql,
        variables: {
          page: this.page,
          ...vars(this.$route.query)
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

.frame {
  width: 100%;
  height: 400px;
}
</style>
