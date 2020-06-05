<template>
  <v-container v-if="topic">
    <v-row>
      <v-col>
        <div class="px-2">
          <div class="overline">Topic</div>
          <div class="headline">
            <span>{{ topic.capitalizedName }}</span>
            <!--<span class="body-2 ml-2"
              >{{ topic.followerCount }} Follower{{ topic.followerCount === 1 ? '' : 's' }}</span
            >-->
            <v-btn small class="ml-1" @click="toggleFollow">{{
              topic.isFollowing ? 'Unfollow' : 'Follow'
            }}</v-btn>
          </div>
        </div>
        <v-divider class="my-1" />
        <SortMenu v-model="sort" />
      </v-col>
      <v-col v-if="$device.isDesktop" cols="2">
        <TopicsSidebar />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SortMenu from '../SortMenu'
import TopicsSidebar from '../TopicsSidebar'
import followedTopicsGql from '../../gql/followedTopics.graphql'
import followTopicGql from '../../gql/followTopic.graphql'
import unfollowTopicGql from '../../gql/unfollowTopic.graphql'
import topicGql from '../../gql/topic.graphql'

export default {
  name: 'TopicView',
  components: { TopicsSidebar, SortMenu },
  data() {
    return {
      topic: null,
      sort: {
        sort: 'TOP',
        time: 'DAY'
      }
    }
  },
  computed: {
    topicName() {
      return this.$route.params.topicName
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
    }
  },
  head() {
    return {
      title: this.topic ? this.topic.capitalizedName : ''
    }
  },
  apollo: {
    topic: {
      query: topicGql,
      variables() {
        return {
          topicName: this.topicName
        }
      }
    }
  }
}
</script>

<style scoped></style>
