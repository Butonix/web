<template>
  <v-container>
    <v-row>
      <GalaxiesSlider />
      <v-col
        v-for="planet in allPlanets"
        v-show="
          $route.query.galaxy
            ? planet.galaxy.name === $route.query.galaxy
            : true
        "
        :key="planet.name"
        :cols="$device.isDesktop ? 4 : 12"
      >
        <PlanetInfoCard :planet="planet" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import allPlanetsGql from '@/gql/allPlanets.graphql'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'
import GalaxiesSlider from '@/components/GalaxiesSlider'

export default {
  components: { GalaxiesSlider, PlanetInfoCard },
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({
      query: allPlanetsGql
    })
    return {
      allPlanets: data.allPlanets
    }
  },
  data() {
    return {
      allPlanets: []
    }
  },
  head: {
    title: 'Explore Planets'
  }
}
</script>

<style scoped></style>
