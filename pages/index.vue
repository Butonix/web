<template>
  <v-container fluid>
    <v-row>
      <v-col v-if="$device.isDesktop" cols="2">
        <div class="sticky">
          <v-card
            outlined
            style="background-color: transparent; border-width: 1px; border-radius: 10px"
          >
            <v-card-title>Not logged in</v-card-title>
          </v-card>

          <client-only>
            <div v-if="!discordHidden" class="mt-4">
              <iframe
                title="Discord widget"
                :src="
                  `https://discordapp.com/widget?id=653652395959648314${
                    $vuetify.theme.dark ? '&theme=dark' : '&theme=light'
                  }${currentUser ? `&username=${currentUser.username}` : ''}`
                "
                class="frame"
                allowtransparency="true"
                frameborder="0"
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

            <div v-else style="text-align: right" class="mt-2">
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
      <v-col>
        <DynamicScroller page-mode :items="homeFeed" :min-item-size="54">
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[
                item.title,
                item.textContent,
                item.link,
                item.thumbnailUrl
              ]"
            >
              <ItemComponent :source="item" :index="index" />
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>

        <v-progress-linear
          v-show="$apollo.queries.homeFeed.loading"
          indeterminate
        />
      </v-col>
      <v-col v-if="$device.isDesktop" cols="2">
        <div class="sticky">
          <TopicsSidebar />
          <InfoLinks class="mt-2" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import VirtualList from 'vue-virtual-scroll-list'
import TopicsSidebar from '../components/TopicsSidebar'
import InfoLinks from '../components/InfoLinks'
import homeFeedGql from '../gql/homeFeed.graphql'
import globalStickiesGql from '../gql/globalStickies.graphql'
import currentUserGql from '../gql/currentUser.graphql'
import ItemComponent from '../components/ItemComponent'
import Post from '../components/Post'

const vars = (query) => {
  return {
    sort: query.sort ? query.sort.toUpperCase() : 'HOT',
    time: query.time ? query.time.toUpperCase() : 'ALL',
    filter: query.feed ? query.feed.toUpperCase() : 'ALL',
    types: query.types ? query.types.split('-').map((t) => t.toUpperCase()) : []
  }
}

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    ItemComponent,
    InfoLinks,
    TopicsSidebar
    // 'virtual-list': VirtualList
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
      postComponent: Post,
      itemComponent: ItemComponent
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
    listHeight() {
      if (!process.client) return 0
      return window.innerHeight - 64 - 56
    },
    items() {
      return Array.from(Array(1000).keys()).map((number) => ({ number }))
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
  activated() {
    window.addEventListener('scroll', this.handleScroll)
  },
  deactivated() {
    window.addEventListener('scroll', this.handleScroll)
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
