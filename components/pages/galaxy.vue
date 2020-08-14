<template>
  <div>
    <GalaxyCard v-if="!$device.isDesktop" hide-buttons :galaxy="galaxy" tile />
    <v-container>
      <GalaxyCard v-if="$device.isDesktop" hide-buttons :galaxy="galaxy" />
      <v-fade-transition hide-on-leave>
        <v-row v-show="$route.query.view !== 'planets'" justify="center">
          <v-col :class="$device.isDesktop ? '' : 'px-0'">
            <GalaxyBar :galaxy="galaxy" />

            <PostsScroller
              v-model="dialog"
              :loading="$apollo.queries.feed.loading"
              :items="feed"
              :selected-post="selectedPost"
              @togglehidden="toggleHidden"
              @toggleblock="toggleBlock"
            />
          </v-col>
          <v-col v-if="$device.isDesktop" cols="3" class="pl-0">
            <div class="sticky">
              <GalaxyInfoCard :galaxy="galaxy" />
              <InfoLinks class="mt-3" />
            </div>
          </v-col>
        </v-row>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <div v-show="$route.query.view === 'planets'">
          <v-btn text class="text--secondary mt-3" nuxt :to="{ query: {} }">
            <v-icon class="mr-2">{{
              $vuetify.icons.values.mdiChevronLeft
            }}</v-icon>
            Back to posts
          </v-btn>
          <v-row>
            <v-col
              v-for="planet in allPlanets"
              :key="planet.name"
              :cols="$device.isDesktop ? 4 : 12"
            >
              <PlanetInfoCard :planet="planet" />
            </v-col>
          </v-row>
        </div>
      </v-fade-transition>
    </v-container>
  </div>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import GalaxyInfoCard from '@/components/GalaxyInfoCard'
import galaxyGql from '@/gql/galaxy.graphql'
import { postHead } from '@/util/postHead'
import InfoLinks from '@/components/InfoLinks'
import GalaxyCard from '@/components/GalaxyCard'
import allPlanetsGql from '@/gql/allPlanets.graphql'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import GalaxyBar from '@/components/bars/GalaxyBar'

export default {
  name: 'Galaxy',
  scrollToTop: false,
  components: {
    GalaxyBar,
    PlanetInfoCard,
    GalaxyCard,
    InfoLinks,
    GalaxyInfoCard,
    PostsScroller
  },
  mixins: [postDialogMixin],
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({
      query: galaxyGql,
      variables: { galaxyName: context.params.galaxyname }
    })
    return {
      galaxy: data.galaxy
    }
  },
  data() {
    return {
      galaxy: null,
      allPlanets: []
    }
  },
  apollo: {
    allPlanets: {
      query: allPlanetsGql,
      variables() {
        return {
          galaxyName: this.$route.params.galaxyname
        }
      }
    }
  },
  head() {
    if (this.selectedPost && this.dialog) return postHead(this.selectedPost)
    else if (!this.galaxy) return { title: 'Galaxy' }
    else return { title: this.galaxy.fullName }
  }
}
</script>

<style scoped></style>
