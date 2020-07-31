<template>
  <v-row justify="center">
    <v-col :class="$device.isDesktop ? '' : 'pa-0'">
      <template v-if="!$device.isDesktop">
        <IndexSidebar />
      </template>

      <SortBar :class="$device.isDesktop ? 'mb-3 ml-9' : ''" />

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
              style="display: flex; flex-direction: row; align-items: center"
            >
              <div
                v-if="$device.isDesktop"
                class="text--secondary pr-2"
                style="min-width: 36px; text-align: right"
              >
                {{ index + 1 }}
              </div>
              <div
                :style="{
                  'border-style': 'solid',
                  'border-bottom-style':
                    index === feed.length - 1 ? 'solid' : 'none',
                  'border-top-style':
                    index === 0 && !$device.isDesktop ? 'none' : 'solid',
                  'border-left-style': $device.isDesktop ? 'solid' : 'none',
                  'border-right-style': $device.isDesktop ? 'solid' : 'none',
                  'border-width': '1px',
                  'border-color': $vuetify.theme.dark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.12)',
                  'border-top-left-radius':
                    $device.isDesktop && index === 0 ? '10px' : '0',
                  'border-top-right-radius':
                    $device.isDesktop && index === 0 ? '10px' : '0',
                  'border-bottom-left-radius':
                    $device.isDesktop && index === feed.length - 1
                      ? '10px'
                      : '0',
                  'border-bottom-right-radius':
                    $device.isDesktop && index === feed.length - 1
                      ? '10px'
                      : '0'
                }"
                class="pa-3 flex-grow-1"
              >
                <Post
                  :post="item"
                  :index="index"
                  :active="active"
                  @togglehidden="toggleHidden"
                  @toggleblock="toggleBlock"
                />
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div class="pt-3" :class="$device.isDesktop ? 'ml-9' : 'px-3'">
        <v-progress-linear
          v-show="$apollo.queries.feed.loading"
          indeterminate
        />

        <div
          v-show="!$apollo.queries.feed.loading && feed.length === 0"
          style="display: flex; flex-direction: column; align-items: center; text-align: center"
          class="text--secondary"
        >
          <v-icon class="text--secondary" size="36">{{
            $vuetify.icons.values.mdiEmoticonFrown
          }}</v-icon>
          <span class="mt-2" style="font-size: 1.5rem"
            >We searched far and wide, but there's nothing here.</span
          >
          <nuxt-link to="/" class="mt-2 primary--text"
            >Return to My Planets</nuxt-link
          >
        </div>
      </div>
    </v-col>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <IndexSidebar />

        <InfoLinks class="mt-2" />
      </div>
    </v-col>

    <PostDialog v-model="dialog" :post="selectedPost" />
  </v-row>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import InfoLinks from '@/components/InfoLinks'
import feedGql from '@/gql/feed.graphql'
import Post from '@/components/post/Post'
import PostDialog from '@/components/PostDialog'
import SortBar from '@/components/bars/SortBar'
import { postHead } from '@/util/postHead'
import IndexSidebar from '@/components/IndexSidebar'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    IndexSidebar,
    SortBar,
    PostDialog,
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
      selectedPost: null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'p-planetname-comments-id-title') {
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
        sort: this.$route.params.sort
          ? this.$route.params.sort.toUpperCase()
          : 'HOT',
        time: this.$route.params.time
          ? this.$route.params.time.toUpperCase()
          : 'ALL',
        filter: this.$route.name.startsWith('sort-time') ? 'MYPLANETS' : 'ALL',
        types:
          this.$route.query && this.$route.query.types
            ? this.$route.query.types.split('-').map((t) => t.toUpperCase())
            : [],
        planetName: this.$route.params.planetname,
        galaxyName: this.$route.params.galaxyname,
        username: this.$route.params.username,
        search: this.$route.query.q
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
  head() {
    if (!this.dialog) {
      return {
        title: this.$route.name.includes('universe') ? 'Universe' : 'My Planets'
      }
    }
    if (this.selectedPost) {
      return postHead(this.selectedPost)
    } else {
      return {
        title: this.$route.name.includes('universe') ? 'Universe' : 'My Planets'
      }
    }
  }
}
</script>

<style scoped>
>>> .v-list-item--link:before {
  opacity: 0 !important;
}
</style>
