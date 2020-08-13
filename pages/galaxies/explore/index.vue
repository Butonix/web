<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="galaxy in galaxies"
        :key="galaxy.name"
        :cols="$device.isDesktop ? 4 : 12"
      >
        <GalaxyCard
          :galaxy="galaxy"
          @refetch="$apollo.queries.galaxies.refetch()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import galaxiesGql from '@/gql/galaxies.graphql'
import GalaxyCard from '@/components/GalaxyCard'

export default {
  components: { GalaxyCard },
  data() {
    return {
      galaxies: []
    }
  },
  apollo: {
    galaxies: {
      query: galaxiesGql
    }
  }
}
</script>

<style scoped></style>
