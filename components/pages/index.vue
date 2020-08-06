<template>
  <div>
    <client-only>
      <Particles />
    </client-only>

    <v-container class="pt-0">
      <v-row justify="center">
        <v-col :class="$device.isDesktop ? '' : 'pa-0'">
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
            <PopularPlanetsCard />
            <ModeratedPlanetsCard
              v-if="
                $store.state.currentUser &&
                  $store.state.currentUser.moderatedPlanets.length > 0
              "
              :user="$store.state.currentUser"
              class="mt-3"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import PopularPlanetsCard from '@/components/PopularPlanetsCard'
import ModeratedPlanetsCard from '@/components/user/ModeratedPlanetsCard'
import Particles from '@/components/Particles'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    Particles,
    ModeratedPlanetsCard,
    PopularPlanetsCard,
    PostsScroller
  },
  mixins: [postDialogMixin]
  /* asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = client.query({
      query: planetGql,
      variables: { planetName: context.params.planetname }
    })
    return {
      planet: data.planet
    }
  },
  data() {
    return {
      planet: null
    }
  },
  apollo: {
    planet: {
      query: planetGql,
      variables() {
        return {
          planetName: this.$route.params.planetname
        }
      }
    }
  } */
}
</script>

<style scoped></style>
