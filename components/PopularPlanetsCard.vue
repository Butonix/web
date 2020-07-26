<template>
  <v-card flat :outlined="!$vuetify.theme.dark">
    <v-card-title class="pb-0">
      Popular Planets
      <v-icon class="ml-2">{{ $vuetify.icons.values.mdiTrendingUp }}</v-icon>
    </v-card-title>
    <v-list>
      <v-list-item nuxt to="/p/Music">
        <v-list-item-avatar color="primary" size="32">
          <v-icon size="24">{{ $vuetify.icons.values.mdiMusic }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            Music
            <span
              class="ml-1 text--secondary"
              style="font-size: 0.93rem; font-weight: 500"
              >p/Music</span
            >
          </v-list-item-title>
          <v-list-item-subtitle style="font-weight: 500">
            22 posts today
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-btn
        depressed
        class="flex-grow-1"
        :color="$vuetify.theme.dark ? '#202124' : '#DEE1E6'"
        nuxt
        to="/planets/explore"
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
        :color="$vuetify.theme.dark ? '#202124' : '#DEE1E6'"
        nuxt
        :to="$store.state.currentUser ? '/planets/create' : '/signup'"
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
import popularPlanetsGql from '../gql/popularPlanets.graphql'

export default {
  name: 'PopularPlanetsCard',
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
