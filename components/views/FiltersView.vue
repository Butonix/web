<template>
  <v-row v-if="currentUser">
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab>Blocked Users</v-tab>
        <v-tab>Hidden Topics</v-tab>
        <v-tab>Hidden Posts</v-tab>
      </v-tabs>

      <v-tabs-items
        v-model="tab"
        class="mt-2"
        style="background-color: transparent"
      >
        <v-tab-item>
          <v-list v-if="blockedUsers.length > 0">
            <v-list-item v-for="user in blockedUsers" :key="user.id">
              <v-list-item-content>
                <v-list-item-title>@{{ user.username }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn text @click="toggleBlock(user)">{{
                  user.isBlocking ? 'Unblock' : 'Block'
                }}</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Not blocking any users.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <v-list v-if="hiddenTopics.length > 0">
            <v-list-item v-for="topic in hiddenTopics" :key="topic.name">
              <v-list-item-content>
                <v-list-item-title>{{
                  topic.capitalizedName
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn text @click="toggleHide(topic)">{{
                  topic.isHidden ? 'Unhide' : 'Hide'
                }}</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Not hiding any topics.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <div v-if="hiddenPosts.length > 0">
            <Post
              v-for="post in hiddenPosts"
              :key="post.id"
              class="mb-1"
              :post="post"
            />
          </div>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Not hiding any posts.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col>
      <div class="headline">Must log in to access this page</div>
    </v-col>
  </v-row>
</template>

<script>
import blockedUserGql from '../../gql/blockedUsers.graphql'
import blockUserGql from '../../gql/blockUser.graphql'
import unblockUserGql from '../../gql/unblockUser.graphql'
import hiddenTopicsGql from '../../gql/hiddenTopics.graphql'
import hideTopicGql from '../../gql/hideTopic.graphql'
import unhideTopicGql from '../../gql/unhideTopic.graphql'
import currentUserGql from '../../gql/currentUser.graphql'
import hiddenPostsGql from '../../gql/hiddenPosts.graphql'
import Post from '../Post'

export default {
  name: 'FiltersView',
  components: { Post },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const hiddenTopicsData = await client.query({
      query: hiddenTopicsGql,
      fetchPolicy: 'network-only'
    })

    const blockedUsersData = await client.query({
      query: blockedUserGql,
      fetchPolicy: 'network-only'
    })

    const hiddenPostsData = await client.query({
      query: hiddenPostsGql,
      fetchPolicy: 'network-only'
    })

    return {
      hiddenTopics: hiddenTopicsData.data.hiddenTopics,
      blockedUsers: blockedUsersData.data.blockedUsers,
      hiddenPosts: hiddenPostsData.data.hiddenPosts
    }
  },
  data() {
    return {
      tab: null,
      hiddenTopics: [],
      blockedUsers: [],
      hiddenPosts: [],
      currentUser: null
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  methods: {
    toggleHide(topic) {
      if (topic.isHidden) this.unhideTopic(topic)
      else this.hideTopic(topic)
    },
    hideTopic(topic) {
      this.$apollo.mutate({
        mutation: hideTopicGql,
        variables: {
          topicName: topic.name
        },
        update: () => {
          topic.isHidden = true
        }
      })
    },
    unhideTopic(topic) {
      this.$apollo.mutate({
        mutation: unhideTopicGql,
        variables: {
          topicName: topic.name
        },
        update: () => (topic.isHidden = false)
      })
    },
    toggleBlock(user) {
      if (user.isBlocking) this.unblockUser(user)
      else this.blockUser(user)
    },
    blockUser(user) {
      this.$apollo.mutate({
        mutation: blockUserGql,
        variables: {
          blockedId: user.id
        },
        update: () => {
          user.isBlocking = true
        }
      })
    },
    unblockUser(user) {
      this.$apollo.mutate({
        mutation: unblockUserGql,
        variables: {
          blockedId: user.id
        },
        update: () => (user.isBlocking = false)
      })
    }
  }
}
</script>

<style scoped></style>
