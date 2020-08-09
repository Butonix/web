<template>
  <v-container class="pt-0">
    <v-row justify="center">
      <v-col :class="$device.isDesktop ? '' : 'pa-0'">
        <div
          v-if="$store.state.currentUser"
          style="font-size: 1rem; text-align: center"
          class="pb-3 text--secondary"
          :class="$device.isDesktop ? '' : 'pt-3'"
        >
          Only showing posts from Planet's you've joined - switch to
          <nuxt-link to="/universe" class="primary--text">Universe</nuxt-link>
          to see posts from all Planets
        </div>
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
          <InfoLinks class="mt-3" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import PopularPlanetsCard from '@/components/planet/PopularPlanetsCard'
import ModeratedPlanetsCard from '@/components/user/ModeratedPlanetsCard'
import { postHead } from '@/util/postHead'
import InfoLinks from '@/components/InfoLinks'

export default {
  name: 'Index',
  scrollToTop: false,
  components: {
    InfoLinks,
    ModeratedPlanetsCard,
    PopularPlanetsCard,
    PostsScroller
  },
  mixins: [postDialogMixin],
  head() {
    if (this.selectedPost && this.dialog) return postHead(this.selectedPost)
    else
      return {
        title: 'My Planets'
      }
  }
}
</script>

<style scoped></style>
