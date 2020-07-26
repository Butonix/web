<template>
  <nuxt-link
    :to="
      $device.isDesktop
        ? `/u/${userData.username}`
        : { path: this.$route.path, query: this.$route.query }
    "
    class="text--secondary"
  >
    <v-avatar size="20">
      <img alt="Profile picture" :src="userData.profilePicUrl" />
    </v-avatar>
    <span class="ml-1 caption">
      {{ userData.username }}
    </span>
    <v-chip
      v-if="op && userData.username !== 'Comet'"
      dark
      x-small
      label
      color="indigo"
      class="ml-1 px-1"
      >OP</v-chip
    >
    <v-chip
      v-if="userData.tag"
      dark
      x-small
      label
      :color="userData.tagColor"
      class="ml-1 px-2"
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
    },
    op: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
