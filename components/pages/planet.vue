<template>
  <div>
    <client-only>
      <Particles />
    </client-only>

    <div style="position: relative">
      <div
        :style="
          planet.bannerImageUrl
            ? `height: 208px; background-image: url(${planet.bannerImageUrl}); background-size: cover; background-position: center; background-repeat: no-repeat`
            : 'height: 80px; background-color: var(--v-primary-base)'
        "
      />
      <div
        style="height: 78px; display: flex; flex-direction: row; align-items: center"
        :style="
          $vuetify.theme.dark
            ? 'background-color: #35363A'
            : 'background-color: #F8F9FA; border-bottom: 1px solid rgba(0, 0, 0, 0.12)'
        "
      >
        <div style="padding-left: 120px; margin-bottom: 2px">
          <v-row no-gutters align="center" class="text--primary">
            <span style="font-size: 2rem; font-weight: 500">
              {{ planet.customName ? planet.customName : planet.name }}
            </span>
            <PlanetJoinButton :planet="planet" class="ml-2" />
          </v-row>
          <div
            style="font-size: 1rem; font-weight: 400"
            class="text--secondary"
          >
            p/{{ planet.name }}
          </div>
        </div>
      </div>
      <div
        style="position: absolute; left: 24px; bottom: 12px; border: 4px solid white; border-radius: 50%; background-size: cover"
      >
        <v-avatar height="72" width="72" color="primary">
          <v-img v-if="planet.avatarImageUrl" :src="planet.avatarImgUrl" />
          <v-icon v-else color="white">{{
            $vuetify.icons.values.mdiEarth
          }}</v-icon>
        </v-avatar>
      </div>
    </div>

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
            <PlanetInfoCard :planet="planet" show-edit-btn />
            <PlanetModsCard :planet="planet" class="mt-3" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import planetGql from '@/gql/planet.graphql'
import PlanetJoinButton from '@/components/planet/PlanetJoinButton'
import PlanetModsCard from '@/components/planet/PlanetModsCard'
import Particles from '@/components/Particles'

export default {
  name: 'Planet',
  scrollToTop: false,
  components: {
    Particles,
    PlanetModsCard,
    PlanetJoinButton,
    PlanetInfoCard,
    PostsScroller
  },
  mixins: [postDialogMixin],
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({
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
  mounted() {
    this.$nextTick(() => {
      this.$vuetify.theme.themes.dark.primary = this.planet.themeColor
        ? this.planet.themeColor
        : '#EF5350'
      this.$vuetify.theme.themes.light.primary = this.planet.themeColor
        ? this.planet.themeColor
        : '#EF5350'
    })
  }
}
</script>

<style scoped></style>
