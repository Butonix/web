<template>
  <v-card flat :outlined="!$vuetify.theme.dark">
    <v-card-title class="pb-0">
      Popular Planets
      <v-icon class="ml-2">{{ $vuetify.icons.values.mdiTrendingUp }}</v-icon>
    </v-card-title>
    <v-list>
      <PlanetListItem
        v-for="planet in popularPlanets"
        :key="planet.name"
        :planet="planet"
      />
    </v-list>

    <v-card-actions>
      <v-btn
        depressed
        class="flex-grow-1"
        nuxt
        to="/planets/explore"
        :style="$vuetify.theme.dark ? '' : 'background-color: #DEE1E6'"
        >Explore more Planets
        <v-icon size="20" class="ml-2">{{
          $vuetify.icons.values.mdiTelescope
        }}</v-icon></v-btn
      >
    </v-card-actions>

    <v-card-actions class="pt-0">
      <v-btn
        depressed
        class="flex-grow-1"
        nuxt
        to="/planets/create"
        :style="$vuetify.theme.dark ? '' : 'background-color: #DEE1E6'"
      >
        Create a Planet
        <v-icon size="20" class="ml-2">{{
          $vuetify.icons.values.mdiEarthPlus
        }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import popularPlanetsGql from '../../gql/popularPlanets.graphql'
import PlanetListItem from '@/components/planet/PlanetListItem'

export default {
  name: 'PopularPlanetsCard',
  components: { PlanetListItem },
  data() {
    return {
      popularPlanets: []
    }
  },
  apollo: {
    popularPlanets: {
      query: popularPlanetsGql
    }
  }
}
</script>

<style scoped></style>
