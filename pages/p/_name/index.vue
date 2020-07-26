<template>
  <v-row v-if="planet">
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
        <v-card flat :outlined="!$vuetify.theme.dark">
          <v-img
            v-if="planet.cardImageUrl"
            alt="Planet cover image"
            :src="planet.cardImageUrl"
            height="250"
          />
          <v-list-item>
            <v-list-item-avatar>
              <v-img
                v-if="planet.avatarImageUrl"
                :src="planet.avatarImageUrl"
              />
              <v-icon v-else>{{ $vuetify.icons.values.mdiEarth }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                style="font-size: 1.43rem; font-weight: 500"
                class="mb-0"
                >{{ planet.fullName }}
                <span class="text--secondary ml-2" style="font-size: 0.93rem"
                  >p/{{ planet.name }}</span
                ></v-list-item-title
              >
              <v-list-item-subtitle class="mt-1" style="font-size: 1rem">{{
                planet.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-chip outlined>
              <v-icon left>{{
                $vuetify.icons.values.mdiAccountMultipleOutline
              }}</v-icon>
              {{ planet.userCount }} User{{ planet.userCount === 1 ? '' : 's' }}
            </v-chip>

            <v-spacer />

            <v-chip
              close
              :close-icon="planet.joined ? '' : $vuetify.icons.values.mdiPlus"
              color="primary"
              @click="toggleJoin"
              @click:close="toggleJoin"
              >{{ planet.joined ? 'Joined' : 'Join' }}</v-chip
            >
          </v-card-actions>

          <v-card-actions class="pt-0">
            <v-chip
              outlined
              small
              class="mr-2"
              nuxt
              :to="`/g/${planet.galaxy.name}`"
            >
              <v-icon small class="mr-2">{{
                $vuetify.icons.values[planet.galaxy.icon]
              }}</v-icon>
              {{ planet.galaxy.fullName }}
            </v-chip>
          </v-card-actions>
        </v-card>

        <v-card class="mt-3" flat :outlined="!$vuetify.theme.dark">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 1.143rem; font-weight: 500"
                class="mb-0"
                >p/boniver Rules</v-list-item-title
              >
              <v-list-item-subtitle class="mt-2" style="font-size: 1rem">
                <ol>
                  <li>Don't be a dick</li>
                </ol>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>

        <v-card class="mt-3" flat :outlined="!$vuetify.theme.dark">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                style="font-size: 1.143rem; font-weight: 500"
                class="mb-0"
                >Moderators</v-list-item-title
              >
              <div class="mt-2">
                <v-list-item
                  v-for="mod in planet.moderators"
                  :key="mod.id"
                  class="px-0"
                >
                  <v-list-item-avatar size="28" class="mr-2">
                    <v-img :src="mod.profilePicUrl" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 1.143rem">
                      {{ mod.username }}
                      <v-chip
                        v-if="mod.tag"
                        dark
                        small
                        :color="mod.tagColor"
                        class="ml-1"
                        style="border-radius: 12px !important;"
                      >
                        {{ mod.tag }}
                      </v-chip>
                      <v-chip
                        v-if="mod.id === planet.creatorId"
                        dark
                        small
                        color="teal"
                        class="ml-1"
                        style="border-radius: 12px !important;"
                      >
                        Creator
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
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
import joinPlanetGql from '../../../gql/joinPlanet.graphql'
import leavePlanetGql from '../../../gql/leavePlanet.graphql'
import joinedPlanetsGql from '../../../gql/joinedPlanets.graphql'
import planetGql from '../../../gql/planet.graphql'
import feedGql from '../../../gql/feed.graphql'
import Post from '../../../components/post/Post'
import TypeMenu from '@/components/buttons/type/TypeMenu'
import SortMenu from '@/components/buttons/home_sort/SortMenu'

export default {
  name: 'T',
  components: {
    SortMenu,
    TypeMenu,
    Post,
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      planet: null,
      feed: [],
      hasMore: true,
      page: 0
    }
  },
  computed: {
    planetName() {
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
    planetName() {
      this.page = 0
    },
    $route: {
      deep: true,
      handler() {
        if (this.$route.name === 'p-name') {
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
    planet: {
      query: planetGql,
      variables() {
        return {
          planetName: this.planetName
        }
      },
      skip() {
        return this.$route.name !== 'p-name'
      }
    },
    feed: {
      query: feedGql,
      variables() {
        return {
          planetName: this.planetName,
          ...this.vars
        }
      },
      skip() {
        return this.$route.name !== 'p-name'
      }
    }
  },
  created() {
    if (this.$route.name === 'p-name') {
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
    toggleJoin() {
      if (this.planet.joined) this.leavePlanet()
      else this.joinPlanet()
    },
    joinPlanet() {
      if (!this.$store.state.currentUser) {
        this.$router.push('/signup')
        return
      }
      this.planet.joined = true
      this.planet.userCount++
      this.$apollo.mutate({
        mutation: joinPlanetGql,
        variables: {
          planetName: this.planetName
        },
        refetchQueries: [{ query: joinedPlanetsGql }]
      })
    },
    leavePlanet() {
      this.planet.joined = false
      this.planet.userCount--
      this.$apollo.mutate({
        mutation: leavePlanetGql,
        variables: {
          planetName: this.planetName
        },
        refetchQueries: [{ query: joinedPlanetsGql }]
      })
    },
    showMore() {
      if (
        this.$apollo.queries.feed.loading ||
        !this.hasMore ||
        this.$route.name !== 'p-name'
      )
        return
      this.page++
      this.$apollo.queries.feed.fetchMore({
        query: feedGql,
        variables: {
          page: this.page,
          planetName: this.planetName,
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
      title: this.planet ? this.planet.fullName : '',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.planet ? this.planet.fullName : ''
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'Comet'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `View all posts in p/${this.planetName}`
        }
      ]
    }
  }
}
</script>

<style scoped></style>
