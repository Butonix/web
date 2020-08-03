<template>
  <div v-if="$route.name.startsWith('u-username') && user">
    <UserSummaryCard :user="user" :tile="!$device.isDesktop" allow-edit />
    <ModeratedPlanetsCard :user="user" class="mt-3" />
  </div>

  <div v-else-if="$route.name.startsWith('g-galaxyname') && galaxy">
    <GalaxyInfoCard :galaxy="galaxy" :tile="!$device.isDesktop" />
  </div>

  <div v-else-if="$route.name.startsWith('p-planetname') && planet">
    <PlanetInfoCard :planet="planet" show-edit-btn :tile="!$device.isDesktop" />
    <PlanetModsCard
      v-if="$device.isDesktop"
      class="mt-3"
      :planet="planet"
      :tile="!$device.isDesktop"
    />
  </div>

  <div v-else-if="$device.isDesktop">
    <v-card
      v-if="!$store.state.currentUser"
      flat
      :outlined="!$vuetify.theme.dark"
      class="mb-3"
    >
      <v-card-title>Customize your Planets</v-card-title>
      <v-card-subtitle style="font-size: 1rem"
        >Sign up on Comet to join Planets and create your personalized
        feed.</v-card-subtitle
      >
      <v-card-actions>
        <v-spacer />
        <v-btn depressed text class="mr-2" nuxt to="/login">Log In</v-btn>
        <v-btn depressed color="primary" class="white--text" nuxt to="/signup"
          >Sign Up</v-btn
        >
      </v-card-actions>
    </v-card>

    <PopularPlanetsCard />

    <ModeratedPlanetsCard
      v-if="$store.state.currentUser"
      :user="$store.state.currentUser"
      class="mt-3"
    />
  </div>
</template>

<script>
import PopularPlanetsCard from '@/components/PopularPlanetsCard'
import PlanetModsCard from '@/components/planet/PlanetModsCard'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import GalaxyInfoCard from '@/components/GalaxyInfoCard'
import UserSummaryCard from '@/components/user/UserSummaryCard'
import userGql from '@/gql/user'
import planetGql from '@/gql/planet'
import galaxyGql from '@/gql/galaxy'
import ModeratedPlanetsCard from '@/components/user/ModeratedPlanetsCard'

export default {
  name: 'IndexSidebar',
  components: {
    ModeratedPlanetsCard,
    UserSummaryCard,
    GalaxyInfoCard,
    PlanetInfoCard,
    PlanetModsCard,
    PopularPlanetsCard
  },
  data() {
    return {
      user: null,
      planet: null,
      galaxy: null
    }
  },
  watch: {
    planet: {
      deep: true,
      handler() {
        this.updateThemeColor()
      }
    }
  },
  mounted() {
    this.updateThemeColor()
  },
  methods: {
    updateThemeColor() {
      if (!this.planet || (this.planet && !this.planet.themeColor)) {
        this.$nextTick(() => {
          this.$vuetify.theme.themes.dark.primary = '#EF5350'
          this.$vuetify.theme.themes.light.primary = '#EF5350'
        })
      } else {
        this.$nextTick(() => {
          this.$vuetify.theme.themes.dark.primary = this.planet.themeColor
          this.$vuetify.theme.themes.light.primary = this.planet.themeColor
        })
      }
    }
  },
  apollo: {
    user: {
      query: userGql,
      variables() {
        return {
          username: this.$route.params.username
        }
      },
      skip() {
        return !this.$route.params.username
      }
    },
    planet: {
      query: planetGql,
      variables() {
        return {
          planetName: this.$route.params.planetname
        }
      },
      skip() {
        return !this.$route.params.planetname
      }
    },
    galaxy: {
      query: galaxyGql,
      variables() {
        return {
          galaxyName: this.$route.params.galaxyname
        }
      },
      skip() {
        return !this.$route.params.galaxyname
      }
    }
  }
}
</script>

<style scoped></style>
