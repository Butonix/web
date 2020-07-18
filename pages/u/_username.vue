<template>
  <v-row>
    <v-col v-if="$device.isDesktop" cols="3">
      <UserSummaryCard v-if="user" :user="user" />
    </v-col>
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <UserSummaryCard
        v-if="!$device.isDesktop && user"
        :user="user"
        class="mb-3"
      />

      <v-row no-gutters class="pb-3">
        <template v-if="$device.isDesktop">
          <v-btn
            small
            text
            rounded
            class="mr-1 font-weight-regular"
            :color="!$route.query || !$route.query.view ? 'primary' : ''"
            @click="chooseAll"
          >
            <v-icon size="20" class="mr-2">{{
              $vuetify.icons.values.mdiInfinity
            }}</v-icon>
            All
          </v-btn>

          <v-btn
            small
            text
            rounded
            class="mr-1 font-weight-regular"
            :color="
              $route.query && $route.query.view === 'posts' ? 'primary' : ''
            "
            @click="choosePosts"
          >
            <v-icon size="20" class="mr-2">{{
              $vuetify.icons.values.mdiPost
            }}</v-icon>
            Posts
          </v-btn>

          <v-btn
            small
            text
            rounded
            class="font-weight-regular"
            :color="
              $route.query && $route.query.view === 'comments' ? 'primary' : ''
            "
            @click="chooseComments"
          >
            <v-icon size="20" class="mr-2">{{
              $vuetify.icons.values.mdiCommentMultipleOutline
            }}</v-icon>
            Comments
          </v-btn>
        </template>

        <UserViewMenu v-else />

        <v-spacer />

        <TypeMenu
          v-if="
            $device.isDesktop && $route.query && $route.query.view === 'posts'
          "
        />

        <UserSortMenu />
      </v-row>

      <DynamicScroller page-mode :items="items" :min-item-size="54">
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :index="index"
            :size-dependencies="[item.title, item.textContent]"
            type-field="__typename"
          >
            <div class="pb-3">
              <Post
                v-if="item.__typename === 'Post'"
                :post="item"
                :index="index"
                :active="active"
              />
              <Comment
                v-else-if="item.__typename === 'Comment'"
                :comment="item"
                :index="index"
                :active="active"
                show-post-title
              />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </v-col>
  </v-row>
</template>

<script>
import { format } from 'date-fns'
import userGql from '../../gql/user.graphql'
import userPostsGql from '../../gql/userPosts.graphql'
import userCommentsGql from '../../gql/userComments.graphql'
import UserSummaryCard from '@/components/user/UserSummaryCard'
import Post from '@/components/post/Post'
import Comment from '@/components/comment/Comment'
import TypeMenu from '@/components/buttons/type/TypeMenu'
import UserSortMenu from '@/components/buttons/user_sort/UserSortMenu'
import UserViewMenu from '@/components/buttons/user_view/UserViewMenu'

export default {
  components: {
    UserViewMenu,
    UserSortMenu,
    TypeMenu,
    Comment,
    Post,
    UserSummaryCard
  },
  data() {
    return {
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
    items() {
      return this.userPosts
        .concat(this.userComments)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }
  },
  apollo: {
    user: {
      query: userGql,
      variables() {
        return {
          username: this.username
        }
      },
      skip() {
        return this.$route.name !== 'u-username'
      }
    },
    userPosts: {
      query: userPostsGql,
      variables() {
        return {
          username: this.username
        }
      },
      skip() {
        return this.$route.name !== 'u-username'
      }
    },
    userComments: {
      query: userCommentsGql,
      variables() {
        return {
          username: this.username
        }
      },
      skip() {
        return this.$route.name !== 'u-username'
      }
    }
  },
  methods: {
    chooseAll() {
      const query = Object.assign({}, this.$route.query)
      delete query.view
      this.$router.push({ path: this.$route.path, query })
    },
    choosePosts() {
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, view: 'posts' }
      })
    },
    chooseComments() {
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, view: 'comments' }
      })
    }
  },
  head() {
    return {
      title: this.user ? this.user.username : '',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.user ? this.user.username : ''}'s profile / Comet`
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'getcomet.net'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `${this.user ? this.user.postCount : ''} Posts and ${
            this.user ? this.user.commentCount : ''
          } Comments`
        }
      ]
    }
  }
}
</script>

<style scoped></style>
