<template>
  <nuxt-link
    :to="
      $device.isDesktop
        ? `/p/${post.planet.name}`
        : { path: this.$route.path, query: this.$route.query }
    "
    class="text--secondary"
  >
    <v-avatar size="20">
      <img
        v-if="post.planet.avatarImageUrl"
        alt="Profile picture"
        :src="post.planet.avatarImageUrl"
      />
      <v-icon v-else class="text--secondary" size="20">{{
        $vuetify.icons.values.mdiEarth
      }}</v-icon>
    </v-avatar>
    <span class="ml-1 caption"> p/{{ post.planet.name }} </span>
  </nuxt-link>
</template>

<script>
export default {
  name: 'PostPlanet',
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
