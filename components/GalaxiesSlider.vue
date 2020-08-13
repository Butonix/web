<template>
  <v-slide-group multiple show-arrows>
    <v-slide-item>
      <v-chip
        :ripple="false"
        class="mx-2 elevation-0"
        active-class="active"
        nuxt
        :to="{ query: {} }"
        :color="$vuetify.theme.dark ? '#35363A' : '#F8F9FA'"
        :style="{
          'border-width': '1px',
          'border-color': 'rgba(0, 0, 0, 0.12)',
          'border-style': $vuetify.theme.dark ? 'none' : 'solid'
        }"
      >
        <v-avatar left>
          <v-icon>{{ $vuetify.icons.values.mdiInfinity }}</v-icon>
        </v-avatar>
        All
      </v-chip>
    </v-slide-item>
    <v-slide-item v-for="galaxy in galaxies" :key="galaxy.name">
      <v-chip
        :ripple="false"
        class="mx-2 elevation-0"
        active-class="active"
        nuxt
        :to="
          $route.query.galaxy === galaxy.name
            ? { query: {} }
            : { query: { galaxy: galaxy.name } }
        "
        :color="
          $route.query.galaxy === galaxy.name
            ? 'primary'
            : $vuetify.theme.dark
            ? '#35363A'
            : '#F8F9FA'
        "
        :style="{
          'border-width': '1px',
          'border-color': 'rgba(0, 0, 0, 0.12)',
          'border-style': $vuetify.theme.dark ? 'none' : 'solid'
        }"
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

<style scoped>
.active {
  opacity: 1 !important;
}
.v-chip--active::before {
  opacity: 0 !important;
}
</style>
