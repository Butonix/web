<template>
  <v-row>
    <v-col v-if="$device.isDesktop" cols="3">
      <div class="sticky">
        <UserSummaryCard v-if="user" :user="user" allow-edit />
      </div>
    </v-col>
    <v-col :cols="$device.isDesktop ? 6 : 12">
      <UserSummaryCard
        v-if="!$device.isDesktop && user"
        :user="user"
        allow-edit
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
                @togglehidden="toggleHidden"
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

      <v-progress-linear
        v-show="
          $apollo.queries.feed.loading || $apollo.queries.userComments.loading
        "
        indeterminate
      />
    </v-col>
  </v-row>
</template>

<script>
import { format } from 'date-fns'
import userGql from '../../gql/user.graphql'
import feedGql from '../../gql/feed.graphql'
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
      feed: [],
      userComments: [],
      hasMore: true,
      page: 0
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
      if (!this.$route.query || !this.$route.query.view) {
        const arr = this.feed.concat(this.userComments)
        if (this.$route.query && this.$route.query.sort === 'top') {
          return arr.sort((a, b) => b.endorsementCount - a.endorsementCount)
        } else {
          return arr.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        }
      } else if (this.$route.query && this.$route.query.view === 'posts') {
        return this.feed
      } else if (this.$route.query && this.$route.query.view === 'comments') {
        return this.userComments
      } else return []
    },
    postVars() {
      return {
        sort: this.$store.state.userQuery.sort
          ? this.$store.state.userQuery.sort.toUpperCase()
          : 'NEW',
        time: this.$store.state.userQuery.time
          ? this.$store.state.userQuery.time.toUpperCase()
          : 'ALL',
        types: this.$store.state.userQuery.types
          ? this.$store.state.userQuery.types
              .split('-')
              .map((t) => t.toUpperCase())
          : []
      }
    },
    commentVars() {
      return {
        sort: this.$store.state.userQuery.sort
          ? this.$store.state.userQuery.sort.toUpperCase()
          : 'NEW',
        time: this.$store.state.userQuery.time
          ? this.$store.state.userQuery.time.toUpperCase()
          : 'ALL'
      }
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
    feed: {
      query: feedGql,
      variables() {
        return {
          username: this.username,
          ...this.postVars
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
          username: this.username,
          ...this.commentVars
        }
      },
      skip() {
        return this.$route.name !== 'u-username'
      }
    }
  },
  watch: {
    username() {
      this.page = 0
    },
    $route: {
      deep: true,
      handler() {
        if (this.$route.name === 'u-username') {
          const oldQuery = this.$store.state.userQuery
          if (
            oldQuery.sort !== this.$route.query.sort ||
            oldQuery.time !== this.$route.query.time ||
            oldQuery.types !== this.$route.query.types
          ) {
            this.feed = []
            this.userComments = []
            this.$store.commit('setUserQuery', this.$route.query)
            this.page = 0
            if (process.client) {
              window.scrollTo(0, 0)
            }
          }
        }
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
    if (this.$route.name === 'u-username') {
      this.$store.commit('setUserQuery', this.$route.query)
    }
  },
  methods: {
    async toggleHidden() {
      await this.$apollo.provider.defaultClient.cache.writeQuery({
        query: feedGql,
        variables: {
          username: this.username,
          ...this.postVars
        },
        data: { feed: this.feed.filter((p) => !p.isHidden) }
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
    showMore() {
      if (
        this.$apollo.queries.feed.loading ||
        this.$apollo.queries.userComments.loading ||
        !this.hasMore ||
        this.$route.name !== 'u-username'
      )
        return
      this.page++
      this.$apollo.queries.feed.fetchMore({
        query: feedGql,
        variables: {
          page: this.page,
          username: this.username,
          ...this.postVars
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.feed
          if (newPosts.length === 0) this.hasMore = false
          return {
            feed: [...previousResult.feed, ...newPosts]
          }
        }
      })

      this.$apollo.queries.userComments.fetchMore({
        query: userCommentsGql,
        variables: {
          page: this.page,
          username: this.username,
          ...this.commentVars
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.userComments
          if (newPosts.length === 0) this.hasMore = false
          return {
            userComments: [...previousResult.userComments, ...newPosts]
          }
        }
      })
    },
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
