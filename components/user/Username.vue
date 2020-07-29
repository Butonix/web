<template>
  <nuxt-link
    :to="
      $device.isDesktop
        ? `/u/${userData.username}`
        : { path: this.$route.path, query: this.$route.query }
    "
    class="text--secondary"
  >
    <v-avatar size="20" color="#65C9FF">
      <img alt="Profile picture" :src="userData.profilePicUrl" />
    </v-avatar>
    <span
      class="ml-1"
      style="font-size: 0.86rem"
      :class="op && userData.username !== 'Comet' ? 'font-weight-bold' : ''"
    >
      {{ userData.username }}
    </span>
    <v-icon
      v-if="op && userData.username !== 'Comet'"
      size="16"
      style="padding-bottom: 3px"
      color="primary"
      >{{ $vuetify.icons.values.mdiMicrophoneVariant }}</v-icon
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
