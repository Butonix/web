<template>
  <span class="text--secondary caption">
    <v-avatar size="20">
      <v-img
        v-if="post.planet.avatarImageUrl"
        :src="post.planet.avatarImageUrl"
      />
      <v-icon v-else class="text--secondary">{{
        $vuetify.icons.values.mdiEarth
      }}</v-icon>
    </v-avatar>

    <span class="ml-1">p/{{ post.planet.name }}</span>
  </span>
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
