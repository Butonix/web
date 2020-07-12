<template>
  <v-container v-if="topic" class="pt-0">
    <v-row>
      <v-col v-if="$device.isDesktop" cols="3">
        <div class="sticky">
          <UserSideCard />
          <v-card flat class="mt-3">
            <v-list-item>
              <v-list-item-content class="pt-1">
                <div class="overline text--secondary">TOPIC</div>
                <v-list-item-title style="font-size: 1.43rem">{{
                  topic.capitalizedName
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-row align="center" justify="start" no-gutters class="px-4 pb-2">
              <v-chip small outlined>
                <v-icon small left>{{
                  $vuetify.icons.values.mdiAccountMultiple
                }}</v-icon>
                {{ topic.followerCount }}
              </v-chip>

              <v-chip small outlined class="ml-2">
                <v-icon small left>{{ $vuetify.icons.values.mdiPost }}</v-icon>
                {{ topic.postCount }}
              </v-chip>
            </v-row>
          </v-card>
        </div>
      </v-col>
      <v-col>
        <DynamicScroller page-mode :items="topicFeed" :min-item-size="54">
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

        <v-progress-linear
          v-show="$apollo.queries.topicFeed.loading"
          indeterminate
        />
      </v-col>
      <v-col v-if="$device.isDesktop" cols="3">
        <div class="sticky">
          <TopicsSidebar />
          <InfoLinks class="mt-2" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TopicsSidebar from '../../components/topic/TopicsSidebar'
import followedTopicsGql from '../../gql/followedTopics.graphql'
import followTopicGql from '../../gql/followTopic.graphql'
import unfollowTopicGql from '../../gql/unfollowTopic.graphql'
import topicGql from '../../gql/topic.graphql'
import topicFeedGql from '../../gql/topicFeed.graphql'
import UserSideCard from '../../components/user/UserSideCard'
import Post from '../../components/post/Post'
import InfoLinks from '../../components/InfoLinks'

export default {
  name: 'T',
  components: { InfoLinks, Post, UserSideCard, TopicsSidebar },
  data() {
    return {
      topic: null,
      topicFeed: [],
      hasMore: true
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
    topicFeed: {
      query: topicFeedGql,
      variables() {
        return {
          topicName: this.topicName
        }
      },
      skip() {
        return this.$route.name !== 't-name'
      }
    }
  },
  methods: {
    handleScroll(e) {
      const totalPageHeight = document.body.scrollHeight
      const scrollPoint = window.scrollY + window.innerHeight
      if (scrollPoint >= totalPageHeight - 200) {
        this.showMore()
      }
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
        this.$apollo.queries.topicFeed.loading ||
        !this.hasMore ||
        this.$route.name !== 't-name'
      )
        return
      this.page++
      this.$apollo.queries.topicFeed.fetchMore({
        query: topicFeedGql,
        variables: {
          page: this.page,
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
