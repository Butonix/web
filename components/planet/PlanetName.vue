<template>
  <nuxt-link
    :to="
      $device.isDesktop
        ? `/p/${planet.name}`
        : { path: this.$route.path, query: this.$route.query }
    "
    class="text--secondary"
  >
    <v-avatar size="20">
      <img
        v-if="planet.avatarImageUrl"
        alt="Profile picture"
        :src="planet.avatarImageUrl"
      />
      <v-icon v-else class="text--secondary" size="20">{{
        $vuetify.icons.values.mdiEarth
      }}</v-icon>
    </v-avatar>
    <span class="ml-1" style="font-size: 0.86rem">p/{{ planet.name }}</span>
  </nuxt-link>
</template>

<script>
export default {
  name: 'PlanetName',
  props: {
    planet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
