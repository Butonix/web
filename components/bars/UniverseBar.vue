<template>
  <SortingBar>
    <v-btn v-if="$store.state.currentUser" tile text height="48">
      <v-icon class="mr-2">{{ $vuetify.icons.values.mdiInfinity }}</v-icon>
      Universe ({{ allPlanets.length }} Planets)</v-btn
    >
    <v-btn v-else depressed color="primary">
      <v-icon class="mr-2">{{
        $vuetify.icons.values.mdiAccountOutline
      }}</v-icon>
      Sign up to customize My Planets
    </v-btn>
  </SortingBar>
</template>

<script>
import SortingBar from '@/components/bars/SortingBar'
import allPlanetsGql from '@/gql/allPlanets'

export default {
  name: 'UniverseBar',
  components: { SortingBar },
  data() {
    return {
      allPlanets: []
    }
  },
  apollo: {
    allPlanets: {
      query: allPlanetsGql
    }
  }
}
</script>

<style scoped></style>
