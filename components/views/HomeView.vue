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

        <div
          v-if="
            !$apollo.queries.homeFeed.loading &&
              !$apollo.queries.globalStickies.loading &&
              homeFeed.length === 0 &&
              globalStickies.length === 0
          "
          style="text-align: center"
          class="title"
        >
          No posts <v-icon>{{ icons.frown }}</v-icon>
        </div>
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
import { mdiAccountOutline, mdiEmoticonFrown } from '@mdi/js'
import homeFeedGql from '../../gql/homeFeed.graphql'
import globalStickiesGql from '../../gql/globalStickies.graphql'
import TopicsSidebar from '../TopicsSidebar'
import Post from '../Post'
import currentUserGql from '../../gql/currentUser.graphql'
import InfoLinks from '../InfoLinks'

export default {
  name: 'HomeView',
  components: { InfoLinks, Post, TopicsSidebar },
  data() {
    return {
      discordHidden: process.client
        ? !!localStorage.getItem('discordHidden')
        : true,
      homeFeed: [],
      globalStickies: [],
      hasMore: true,
      currentUser: null,
      icons: {
        profile: mdiAccountOutline,
        frown: mdiEmoticonFrown
      }
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
