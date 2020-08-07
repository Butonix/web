<template>
  <div>
    <div style="position: relative">
      <div
        :style="
          planet.bannerImageUrl
            ? `height: 208px; background-image: url(${planet.bannerImageUrl}); background-size: cover; background-position: center; background-repeat: no-repeat`
            : 'height: 80px; background-color: var(--v-primary-base)'
        "
        style="display: flex"
        :class="isMod ? 'editbanner' : ''"
        @click="openBannerInput"
      >
        <v-file-input
          v-if="isMod"
          ref="bannerinput"
          v-model="bannerFile"
          type="file"
          style="display: none"
        />
        <v-icon
          size="52"
          class="editbannericon"
          dark
          style="margin: auto auto"
          >{{ $vuetify.icons.values.mdiPencil }}</v-icon
        >
      </div>
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
        <v-avatar
          height="72"
          width="72"
          color="primary"
          style="position: relative"
          :class="isMod ? 'editplanetavatar' : ''"
          @click="openAvatarInput"
        >
          <v-file-input
            v-if="isMod"
            ref="avatarinput"
            v-model="avatarFile"
            type="file"
            style="display: none"
          />
          <v-icon
            size="50"
            style="position: absolute; z-index: 10"
            class="editplaneticon"
            dark
            >{{ $vuetify.icons.values.mdiPencil }}</v-icon
          >
          <v-img v-if="planet.avatarImageUrl" :src="planet.avatarImageUrl" />
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
            <PlanetInfoCard
              :planet="planet"
              show-edit-btn
              @doneediting="refetchPlanet"
            />
            <PlanetModsCard :planet="planet" class="mt-3" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import postDialogMixin from '@/mixins/postDialogMixin'
import PostsScroller from '@/components/post/PostsScroller'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import planetGql from '@/gql/planet.graphql'
import PlanetJoinButton from '@/components/planet/PlanetJoinButton'
import PlanetModsCard from '@/components/planet/PlanetModsCard'

export default {
  name: 'Planet',
  scrollToTop: false,
  components: {
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
      planet: null,
      bannerFile: null,
      avatarFile: null
    }
  },
  computed: {
    isMod() {
      return (
        this.$store.state.currentUser &&
        !!this.$store.state.currentUser.moderatedPlanets.find(
          (p) =>
            p.name.toLowerCase() === this.$route.params.planetname.toLowerCase()
        )
      )
    }
  },
  watch: {
    async avatarFile(val) {
      if (!val) return
      if (val.size > 4 * 1024 * 1024) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Too big - avatar file must be less than 4MB'
        })
        this.avatarFile = null
        return
      }
      await this.$apollo.mutate({
        mutation: gql`
          mutation($planetName: ID!, $file: Upload!) {
            uploadPlanetAvatarImage(planetName: $planetName, file: $file)
          }
        `,
        variables: {
          planetName: this.$route.params.planetname,
          file: this.avatarFile
        }
      })
      this.refetchPlanet()
    },
    async bannerFile(val) {
      if (!val) return
      if (val.size > 4 * 1024 * 1024) {
        this.$store.dispatch('displaySnackbar', {
          message: 'Too big - banner file must be less than 4MB'
        })
        this.bannerFile = null
        return
      }
      await this.$apollo.mutate({
        mutation: gql`
          mutation($planetName: ID!, $file: Upload!) {
            uploadPlanetBannerImage(planetName: $planetName, file: $file)
          }
        `,
        variables: {
          planetName: this.$route.params.planetname,
          file: this.bannerFile
        }
      })
      this.refetchPlanet()
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
  },
  methods: {
    openAvatarInput() {
      if (!this.isMod) return
      this.$refs.avatarinput.$refs.input.click()
    },
    openBannerInput() {
      if (!this.isMod) return
      this.$refs.bannerinput.$refs.input.click()
    },
    async refetchPlanet() {
      this.planet = (
        await this.$apollo.query({
          query: planetGql,
          variables: {
            planetName: this.$route.params.planetname
          },
          fetchPolicy: 'network-only'
        })
      ).data.planet
    }
  }
}
</script>

<style scoped>
.editplanetavatar:hover {
  opacity: 0.75;
  cursor: pointer;
}

.editplanetavatar:hover .editplaneticon {
  display: initial;
}

.editplaneticon {
  display: none;
}

.editbanner:hover {
  opacity: 0.75;
  cursor: pointer;
}

.editbanner:hover .editbannericon {
  display: initial;
}

.editbannericon {
  display: none;
}
</style>
