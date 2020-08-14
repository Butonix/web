<template>
  <div>
    <div
      style="font-size: 0.86rem; display: flex"
      class="text--secondary px-4 pt-2 pb-2"
    >
      <span class="mr-auto">Explore</span>
    </div>
    <v-list class="py-0">
      <v-list-item dense to="/planets/explore">
        <v-list-item-avatar size="24">
          <v-icon size="20">{{ $vuetify.icons.values.mdiEarth }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title style="font-size: 1rem"
            >Explore Planets</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item dense to="/galaxies/explore">
        <v-list-item-avatar size="24">
          <v-icon size="20">{{ $vuetify.icons.values.mdiTelescope }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title style="font-size: 1rem"
            >Explore Galaxies</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <div v-if="recentPlanets.length > 0">
      <div style="font-size: 0.86rem" class="text--secondary px-4 pt-4 pb-2">
        Recent
      </div>

      <v-list class="py-0">
        <PlanetListItem
          v-for="planet in recentPlanets"
          :key="planet.name"
          :planet="planet"
        />
      </v-list>
    </div>

    <div v-if="joinedPlanets.length > 0">
      <div style="font-size: 0.86rem" class="text--secondary px-4 pt-4 pb-2">
        My Planets
      </div>

      <!--<v-text-field
        solo
        flat
        dense
        label="Filter"
        hide-details
        class="mx-2 mb-2"
        style="height: 34px"
      />-->

      <v-list class="py-0">
        <PlanetListItem
          v-for="planet in joinedPlanets"
          :key="planet.name"
          :planet="planet"
        />
      </v-list>
    </div>

    <div v-if="$device.isDesktop" style="height: 96px" />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import joinedPlanetsGql from '@/gql/joinedPlanets'
import PlanetListItem from '@/components/planet/PlanetListItem'

export default {
  name: 'NavDrawerContents',
  components: { PlanetListItem },
  data() {
    return {
      joinedPlanets: [],
      galaxies: [],
      recentPlanets: [],
      recentPlanetNames: []
    }
  },
  watch: {
    '$route.path'() {
      this.updateRecentPlanets()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updateRecentPlanets()
    })
  },
  methods: {
    updateRecentPlanets() {
      const item = localStorage.getItem('recentPlanets')
      if (!item) return
      this.recentPlanetNames = JSON.parse(item)
    }
  },
  apollo: {
    joinedPlanets: {
      query: joinedPlanetsGql
    },
    recentPlanets: {
      query: gql`
        query($planetNames: [ID!]!) {
          recentPlanets(planetNames: $planetNames) {
            avatarImageUrl
            customName
            name
            description
            postCount
          }
        }
      `,
      variables() {
        return {
          planetNames: this.recentPlanetNames
        }
      }
    }
  }
}
</script>

<style scoped>
.linkactive {
  color: var(--v-primary-base) !important;
}

.linkactive:before {
  opacity: 0 !important;
}

.planetactive:before {
  opacity: 0.06 !important;
}

>>> .v-input__control {
  min-height: 34px !important;
  height: 34px !important;
}

>>> .v-label {
  font-size: 1rem;
}
</style>
