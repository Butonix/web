<template>
  <v-slide-group multiple show-arrows>
    <v-slide-item v-for="galaxy in galaxies" :key="galaxy.name">
      <v-chip
        class="mx-2"
        outlined
        nuxt
        :to="
          $route.query.galaxy === galaxy.name
            ? { query: {} }
            : { query: { galaxy: galaxy.name } }
        "
        :color="$route.query.galaxy === galaxy.name ? 'primary' : ''"
      >
        <v-avatar left>
          <v-icon>{{ $vuetify.icons.values[galaxy.icon] }}</v-icon>
        </v-avatar>
        {{ galaxy.fullName }}
      </v-chip>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'GalaxiesSlider',
  apollo: {
    galaxies: {
      query: gql`
        query {
          galaxies {
            fullName
            name
            icon
          }
        }
      `
    }
  },
  data() {
    return {
      galaxies: []
    }
  }
}
</script>

<style scoped></style>
