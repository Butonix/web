<template>
  <SortingBar>
    <v-btn
      v-if="$store.state.currentUser"
      depressed
      color="primary"
      rounded
      height="34"
      class="px-3"
      style="margin-bottom: 2px"
    >
      <v-icon class="mr-2">{{ $vuetify.icons.values.mdiInfinity }}</v-icon>
      Universe ({{ allPlanets.length }} Planets)</v-btn
    >
    <SignUpButton v-else />

    <ExplorePlanetsButton v-if="$device.isDesktop" />
  </SortingBar>
</template>

<script>
import SortingBar from '@/components/bars/SortingBar'
import allPlanetsGql from '@/gql/allPlanets'
import SignUpButton from '@/components/bars/SignUpButton'
import ExplorePlanetsButton from '@/components/bars/ExplorePlanetsButton'

export default {
  name: 'UniverseBar',
  components: { ExplorePlanetsButton, SignUpButton, SortingBar },
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
