<template>
  <v-container class="pt-0">
    <v-row justify="center">
      <v-col :class="$device.isDesktop ? '' : 'px-0'">
        <MyPlanetsBar />

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
import MyPlanetsBar from '@/components/bars/MyPlanetsBar'

export default {
  middleware({ store, redirect }) {
    // If the user is not authenticated
    if (!store.state.currentUser) {
      return redirect('/universe')
    }
  },
  name: 'Index',
  scrollToTop: false,
  components: {
    MyPlanetsBar,
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
