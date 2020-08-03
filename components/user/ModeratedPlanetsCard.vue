<template>
  <v-card flat :outlined="!$vuetify.theme.dark">
    <v-card-title class="pb-0">
      Planets moderated by {{ user.username }}
      <v-icon class="ml-2">{{ $vuetify.icons.values.mdiShield }}</v-icon>
    </v-card-title>
    <v-list>
      <PlanetListItem
        v-for="planet in user.moderatedPlanets"
        :key="planet.name"
        :planet="planet"
        hide-post-count
      />
    </v-list>
  </v-card>
</template>

<script>
import PlanetListItem from '@/components/PlanetListItem'

export default {
  name: 'ModeratedPlanetsCard',
  components: { PlanetListItem },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
