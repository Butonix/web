<template>
  <nuxt-link
    :to="
      $device.isDesktop
        ? `/u/${userData.username}`
        : { path: this.$route.path, query: this.$route.query }
    "
    class="text--primary"
  >
    <v-avatar size="28">
      <img alt="Profile picture" :src="userData.profilePicUrl" />
    </v-avatar>
    <span class="ml-1">
      {{ userData.username }}
    </span>
    <v-chip
      v-if="userData.tag"
      dark
      x-small
      label
      :color="userData.tagColor"
      class="ml-1"
      >{{ userData.tag }}</v-chip
    >
  </nuxt-link>
</template>

<script>
export default {
  name: 'Username',
  props: {
    userData: {
      type: Object,
      required: true
    },
    link: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped></style>
