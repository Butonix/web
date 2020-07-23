<template>
  <v-row>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <UserSideCard />
      </div>
    </v-col>
    <v-col>
      <v-row no-gutters class="pb-3">
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
        <v-card flat>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>{{ $vuetify.icons.values.mdiMusic }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Music</v-list-item-title>
              <v-list-item-subtitle
                >General Discussion of Music</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import followedTopicsGql from '../../gql/followedTopics.graphql'
import followTopicGql from '../../gql/followTopic.graphql'
import unfollowTopicGql from '../../gql/unfollowTopic.graphql'
import topicGql from '../../gql/topic.graphql'
import feedGql from '../../gql/feed.graphql'
import UserSideCard from '../../components/user/UserSideCard'
import Post from '../../components/post/Post'
import TypeMenu from '~/components/buttons/type/TypeMenu'
import SortMenu from '~/components/buttons/home_sort/SortMenu'
import hideTopicGql from '~/gql/hideTopic'
import unhideTopicGql from '~/gql/unhideTopic'

export default {
  name: 'T',
  components: {
    SortMenu,
    TypeMenu,
    Post,
    UserSideCard,
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      topic: null,
      feed: [],
      hasMore: true,
      page: 0
    }
  },
  computed: {
    topicName() {
      return this.$route.params.name
    },
    vars() {
      return {
        sort: this.$store.state.topicQuery.sort
          ? this.$store.state.topicQuery.sort.toUpperCase()
          : 'HOT',
        time: this.$store.state.topicQuery.time
          ? this.$store.state.topicQuery.time.toUpperCase()
          : 'ALL',
        types: this.$store.state.topicQuery.types
          ? this.$store.state.topicQuery.types
              .split('-')
              .map((t) => t.toUpperCase())
          : []
      }
    }
  },
  watch: {
    topicName() {
      this.page = 0
    },
    $route: {
      deep: true,
      handler() {
        if (this.$route.name === 't-name') {
          const oldQuery = this.$store.state.topicQuery
          if (
            oldQuery.sort !== this.$route.query.sort ||
            oldQuery.time !== this.$route.query.time ||
            oldQuery.types !== this.$route.query.types
          ) {
            this.feed = []
            this.$store.commit('setTopicQuery', this.$route.query)
            this.page = 0
            if (process.client) {
              window.scrollTo(0, 0)
            }
          }
        }
      }
    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll)
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  apollo: {
    topic: {
      query: topicGql,
      variables() {
        return {
          topicName: this.topicName
        }
      },
      skip() {
        return this.$route.name !== 't-name'
      }
    },
    feed: {
      query: feedGql,
      variables() {
        return {
          topicName: this.topicName,
          ...this.vars
        }
      },
      skip() {
        return this.$route.name !== 't-name'
      }
    }
  },
  created() {
    if (this.$route.name === 't-name') {
      this.$store.commit('setTopicQuery', this.$route.query)
    }
  },
  methods: {
    async toggleHidden() {
      await this.$apollo.provider.defaultClient.cache.writeQuery({
        query: feedGql,
        variables: {
          ...this.vars
        },
        data: { feed: this.feed.filter((p) => !p.isHidden) }
      })
    },
    async toggleBlock() {
      await this.$apollo.provider.defaultClient.cache.writeQuery({
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
      if (scrollPoint >= totalPageHeight - 200) {
        this.showMore()
      }
    },
    toggleHide() {
      if (this.topic.isHidden) this.unhideTopic()
      else this.hideTopic()
    },
    hideTopic() {
      this.$apollo.mutate({
        mutation: hideTopicGql,
        variables: {
          topicName: this.topic.name
        },
        update: () => {
          this.topic.isHidden = true
        }
      })
    },
    unhideTopic() {
      this.$apollo.mutate({
        mutation: unhideTopicGql,
        variables: {
          topicName: this.topic.name
        },
        update: () => (this.topic.isHidden = false)
      })
    },
    toggleFollow() {
      if (this.topic.isFollowing) this.unfollowTopic()
      else this.followTopic()
    },
    followTopic() {
      this.$apollo.mutate({
        mutation: followTopicGql,
        variables: {
          topicName: this.topicName
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => (this.topic.isFollowing = true)
      })
    },
    unfollowTopic() {
      this.$apollo.mutate({
        mutation: unfollowTopicGql,
        variables: {
          topicName: this.topicName
        },
        refetchQueries: [{ query: followedTopicsGql }],
        update: () => (this.topic.isFollowing = false)
      })
    },
    showMore() {
      if (
        this.$apollo.queries.feed.loading ||
        !this.hasMore ||
        this.$route.name !== 't-name'
      )
        return
      this.page++
      this.$apollo.queries.feed.fetchMore({
        query: feedGql,
        variables: {
          page: this.page,
          topicName: this.topicName,
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
    return {
      title: this.topic ? this.topic.capitalizedName : '',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Topic: ${this.topicName}`
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'Comet'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `View all posts in the ${this.topicName} topic`
        }
      ]
    }
  }
}
</script>

<style scoped></style>
