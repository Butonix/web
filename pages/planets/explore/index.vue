<template>
  <v-container>
    <v-row>
      <v-col
        v-for="planet in allPlanets"
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

export default {
  components: { PlanetInfoCard },
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
  }
}
</script>

<style scoped></style>
