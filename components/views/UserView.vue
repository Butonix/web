<template>
  <v-row>
    <v-col>
      <div class="headline">
        @{{ user.username }}
        <v-btn v-if="!user.isCurrentUser" color="primary" depressed small
          >Follow</v-btn
        >
      </div>
      <div class="subtitle-1">
        Joined on {{ joinDate }} &middot;
        {{ user.endorsementCount }} endorsements &middot;
        {{ user.followerCount }} follower{{
          user.followerCount === 1 ? '' : 's'
        }}
      </div>

      <v-tabs v-model="currentTab" class="mb-2" background-color="transparent">
        <v-tab>All</v-tab>
        <v-tab
          >{{ user.postCount }} Post{{ user.postCount === 1 ? '' : 's' }}</v-tab
        >
        <v-tab
          >{{ user.commentCount }} Comment{{
            user.commentCount === 1 ? '' : 's'
          }}</v-tab
        >
      </v-tabs>

      <SortMenu
        :hot-enabled="false"
        :default-sort="{ sort: 'NEW', time: 'ALL' }"
        class="mb-1"
      />

      <v-tabs-items v-model="currentTab" style="background-color: transparent">
        <v-tab-item>
          <div v-for="item in postsAndComments" :key="item.id" class="mb-1">
            <Post v-if="item.__typename === 'Post'" :post="item" />
            <Comment
              v-else-if="item.__typename === 'Comment'"
              profile
              :comment="item"
            />
          </div>
        </v-tab-item>

        <v-tab-item>
          <Post
            v-for="post in userPosts"
            :key="post.id"
            :post="post"
            class="mb-1"
          />
        </v-tab-item>

        <v-tab-item>
          <Comment
            v-for="comment in userComments"
            :key="comment.id"
            profile
            :comment="comment"
            class="mb-1"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</template>

<script>
import { format } from 'date-fns'
import userGql from '../../gql/user.graphql'
import userPostsGql from '../../gql/userPosts.graphql'
import userCommentsGql from '../../gql/userComments.graphql'
import SortMenu from '../SortMenu'
import Comment from '../Comment'
import Post from '../Post'

export default {
  name: 'PostView',
  components: { SortMenu, Comment, Post },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const userData = await client.query({
      query: userGql,
      variables: { username: context.params.username },
      fetchPolicy: 'network-only'
    })

    const userPostsData = await client.query({
      query: userPostsGql,
      variables: { username: context.params.username },
      fetchPolicy: 'network-only'
    })

    const userCommentsData = await client.query({
      query: userCommentsGql,
      variables: { username: context.params.username },
      fetchPolicy: 'network-only'
    })

    return {
      user: userData.data.user,
      userPosts: userPostsData.data.userPosts,
      userComments: userCommentsData.data.userComments
    }
  },
  data() {
    return {
      currentTab: null,
      user: null,
      userPosts: [],
      userComments: []
    }
  },
  computed: {
    username() {
      return this.$route.params.username
    },
    joinDate() {
      if (!this.user) return undefined
      return format(new Date(this.user.createdAt), 'MM/dd/yyyy')
    },
    postsAndComments() {
      return this.userPosts
        .concat(this.userComments)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }
  },
  head() {
    return {
      title: this.user.username,
      meta: [
        {
          property: 'og:title',
          content: `${this.user.username}'s profile on Comet`
        },
        { property: 'og:site_name', content: 'getcomet.net' },
        {
          property: 'og:description',
          content: `${this.user.postCount} Posts and ${this.user.commentCount} Comments`
        }
      ]
    }
  }
}
</script>

<style scoped></style>
