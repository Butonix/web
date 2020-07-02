<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="px-2">
          <div class="overline">Topic</div>
          <div class="headline">
            <span>{{ topic.capitalizedName }}</span>
            <v-btn small class="ml-1" @click="toggleFollow">{{
              topic.isFollowing ? 'Unfollow' : 'Follow'
            }}</v-btn>
          </div>
        </div>
        <v-divider class="my-1" />
        <v-row class="mb-1 mx-0">
          <SortMenu v-model="sort" class="mr-1" />
          <TypeMenu v-model="type" />
        </v-row>

        <Post
          v-for="post in topicFeed.slice(0, topicFeed.length - 1)"
          :key="post.id"
          :source="post"
        />
        <Post
          v-for="post in topicFeed.slice(
            topicFeed.length - 1,
            topicFeed.length
          )"
          :key="post.id"
          v-intersect.quiet="showMore"
          :source="post"
        />

        <v-progress-linear
          v-show="$apollo.queries.topicFeed.loading"
          indeterminate
        />
      </v-col>
      <v-col v-if="$device.isDesktop" cols="2">
        <TopicsSidebar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SortMenu from '../../components/buttons/SortMenu'
import TopicsSidebar from '../../components/TopicsSidebar'
import followedTopicsGql from '../../gql/followedTopics.graphql'
import followTopicGql from '../../gql/followTopic.graphql'
import unfollowTopicGql from '../../gql/unfollowTopic.graphql'
import topicGql from '../../gql/topic.graphql'
import topicFeedGql from '../../gql/topicFeed.graphql'
import Post from '../../components/Post'
import TypeMenu from '../../components/buttons/TypeMenu'

export default {
  components: { TypeMenu, Post, TopicsSidebar, SortMenu },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const topicData = await client.query({
      query: topicGql,
      variables: {
        topicName: context.params.name
      },
      fetchPolicy: 'network-only'
    })

    if (!topicData.data.topic)
      context.error({ statusCode: 404, message: 'Topic not found' })

    return {
      topic: topicData.data.topic
    }
  },
  data() {
    return {
      topic: null,
      topicFeed: [],
      hasMore: true,
      type:
        this.$route.query.type &&
        ['all', 'text', 'link'].includes(this.$route.query.type)
          ? this.$route.query.type
          : 'all',
      sort: {
        sort:
          this.$route.query.sort &&
          ['new', 'top', 'hot'].includes(this.$route.query.sort)
            ? this.$route.query.sort
            : 'hot',
        time:
          this.$route.query.time &&
          ['hour', 'day', 'week', 'month', 'year', 'all'].includes(
            this.$route.query.time
          )
            ? this.$route.query.time
            : 'all'
      }
    }
  },
  computed: {
    topicName() {
      return this.$route.params.name
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
    async type(type) {
      await this.$router.push({
        path: `/topic/${this.topicName}`,
        query: { ...this.$route.query, type }
      })
      this.$store.commit('setHomeQuery', this.$route.query)
    },
    sort: {
      async handler(sort) {
        await this.$router.push({
          path: `/topic/${this.topicName}`,
          query: { ...this.$route.query, s: sort.sort, t: sort.time }
        })
        this.$store.commit('setHomeQuery', this.$route.query)
      },
      deep: true
    }
  },
  apollo: {
    topicFeed: {
      query: topicFeedGql,
      variables() {
        return {
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase(),
          type: this.type.toUpperCase(),
          topicName: this.topicName
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
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
      if (!this.hasMore) return
      this.page++
      this.$apollo.queries.topicFeed.fetchMore({
        query: topicFeedGql,
        variables: {
          page: this.page,
          sort: this.sort.sort.toUpperCase(),
          time: this.sort.time.toUpperCase(),
          type: this.type.toUpperCase(),
          topicName: this.topicName
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.topicFeed
          if (newPosts.length === 0) this.hasMore = false
          return {
            topicFeed: [...previousResult.topicFeed, ...newPosts]
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
