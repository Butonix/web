<template>
  <v-row>
    <v-col
      v-for="planet in allPlanets"
      :key="planet.name"
      :cols="$device.isDesktop ? 4 : 12"
    >
      <PlanetInfoCard :planet="planet" />
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'
import PlanetInfoCard from '@/components/planet/PlanetInfoCard'

export default {
  components: { PlanetInfoCard },
  data() {
    return {
      allPlanets: []
    }
  },
  apollo: {
    allPlanets: {
      query: gql`
        query {
          allPlanets {
            avatarImageUrl
            name
            description
            customName
            joined
            userCount
            themeColor
            cardImageUrl
            createdAt
            galaxy {
              fullName
              icon
            }
          }
        }
      `
    }
  }
}
</script>

<style scoped></style>
