<template>
  <v-row>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <UserSideCard />
      </div>
    </v-col>
    <v-col>
      <v-card
        v-if="topic"
        :flat="$vuetify.theme.dark"
        :outlined="!$vuetify.theme.dark"
        class="mb-3"
      >
        <v-row no-gutters class="px-4 py-2">
          <div>
            <div class="overline text--secondary">TOPIC</div>
            <div style="font-size: 1.43rem">{{ topic.capitalizedName }}</div>
          </div>

          <v-spacer />

          <div style="text-align: end">
            <div>
              <v-btn
                text
                rounded
                small
                :color="
                  topic.isFollowing
                    ? $vuetify.theme.dark
                      ? 'red lighten-2'
                      : 'primary'
                    : ''
                "
                :disabled="topic.isHidden"
                @click="toggleFollow"
              >
                <v-icon size="20" class="mr-2">{{
                  topic.isFollowing
                    ? $vuetify.icons.values.mdiNewspaper
                    : $vuetify.icons.values.mdiNewspaperPlus
                }}</v-icon>
                {{
                  topic.isFollowing ? 'Added to My Topics' : 'Add to My Topics'
                }}
              </v-btn>
            </div>

            <div class="mt-1">
              <v-btn
                text
                rounded
                small
                :color="
                  topic.isHidden
                    ? $vuetify.theme.dark
                      ? 'red lighten-2'
                      : 'primary'
                    : ''
                "
                :disabled="topic.isFollowing"
                @click="toggleHide"
              >
                <v-icon size="20" class="mr-2">{{
                  topic.isHidden
                    ? $vuetify.icons.values.mdiEye
                    : $vuetify.icons.values.mdiEyeOff
                }}</v-icon>
                {{ topic.isHidden ? 'Hiding Topic' : 'Hide Topic' }}
              </v-btn>
            </div>
          </div>
        </v-row>

        <v-row align="center" justify="start" no-gutters class="px-4 pb-2">
          <v-chip
            small
            outlined
            :title="`${topic.followerCount} Added to My Topics`"
          >
            <v-icon small left>{{
              $vuetify.icons.values.mdiAccountMultiple
            }}</v-icon>
            {{ topic.followerCount }}
          </v-chip>

          <v-chip
            small
            outlined
            class="ml-2"
            :title="
              `${topic.postCount} Post${topic.postCount === 1 ? '' : 's'}`
            "
          >
            <v-icon small left>{{ $vuetify.icons.values.mdiPost }}</v-icon>
            {{ topic.postCount }}
          </v-chip>
        </v-row>
      </v-card>

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
              <Post :post="item" :index="index" :active="active" />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <v-progress-linear v-show="$apollo.queries.feed.loading" indeterminate />
    </v-col>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <TopicsSidebar />
        <InfoLinks class="mt-2" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import TopicsSidebar from '../../components/topic/TopicsSidebar'
import followedTopicsGql from '../../gql/followedTopics.graphql'
import followTopicGql from '../../gql/followTopic.graphql'
import unfollowTopicGql from '../../gql/unfollowTopic.graphql'
import topicGql from '../../gql/topic.graphql'
import feedGql from '../../gql/feed.graphql'
import UserSideCard from '../../components/user/UserSideCard'
import Post from '../../components/post/Post'
import InfoLinks from '../../components/InfoLinks'
import TypeMenu from '~/components/buttons/type/TypeMenu'
import SortMenu from '~/components/buttons/home_sort/SortMenu'
import hideTopicGql from '~/gql/hideTopic'
import unhideTopicGql from '~/gql/unhideTopic'

export default {
  name: 'T',
  components: {
    SortMenu,
    TypeMenu,
    InfoLinks,
    Post,
    UserSideCard,
    TopicsSidebar
  },
  data() {
    return {
      topic: null,
      feed: [],
      hasMore: true
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
    },
    page: {
      get() {
        return this.$store.state.topicFeedPage[this.topicName]
      },
      set(val) {
        this.$store.commit('setTopicFeedPage', {
          topicName: this.topicName,
          page: val
        })
      }
    }
  },
  watch: {
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
            this.$store.commit('setTopicFeedPage', 0)
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
    window.addEventListener('scroll', this.handleScroll)
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
