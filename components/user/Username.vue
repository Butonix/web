<template>
  <nuxt-link
    :to="
      $device.isDesktop
        ? `/u/${user.username}`
        : { path: this.$route.path, query: this.$route.query }
    "
    class="text--secondary"
  >
    <v-avatar size="20">
      <img alt="Profile picture" :src="user.profilePicUrl" />
    </v-avatar>
    <span
      class="ml-1"
      style="font-size: 0.86rem"
      :class="op && user.username !== 'Comet' ? 'font-weight-bold' : ''"
    >
      {{ user.username }}
    </span>
    <v-icon
      v-if="op && user.username !== 'Comet'"
      size="16"
      style="padding-bottom: 3px"
      color="primary"
      title="Original Poster"
      >{{ $vuetify.icons.values.mdiMicrophoneVariant }}</v-icon
    >
    <v-chip
      v-if="user.tag"
      dark
      x-small
      label
      :color="user.tagColor"
      class="ml-1 px-2"
      >{{ user.tag }}</v-chip
    >
  </nuxt-link>
</template>

<script>
export default {
  name: 'Username',
  props: {
    user: {
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
