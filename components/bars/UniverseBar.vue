<template>
  <SortingBar>
    <v-btn
      v-if="$store.state.currentUser"
      tile
      text
      height="46"
      class="px-3"
      style="border-right-style: solid; border-right-width: 1px; margin-bottom: 2px"
      :style="{
        'border-right-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)'
      }"
    >
      <v-icon class="mr-2">{{ $vuetify.icons.values.mdiInfinity }}</v-icon>
      Universe ({{ allPlanets.length }} Planets)</v-btn
    >
    <v-btn
      v-else
      color="primary"
      tile
      depressed
      height="46"
      class="px-3"
      style="border-right-style: solid; border-right-width: 1px; margin-bottom: 2px"
      :style="{
        'border-right-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)'
      }"
    >
      <v-icon class="mr-2" size="20">{{
        $vuetify.icons.values.mdiAccountOutline
      }}</v-icon>
      Sign up to customize My Planets
    </v-btn>

    <v-btn
      tile
      text
      height="46"
      class="px-3"
      style="border-right-style: solid; border-right-width: 1px; margin-bottom: 2px"
      :style="{
        'border-right-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)'
      }"
      nuxt
      to="/planets/explore"
    >
      <v-icon class="mr-2" size="20">{{
        $vuetify.icons.values.mdiTelescope
      }}</v-icon>
      Explore Planets</v-btn
    >
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
