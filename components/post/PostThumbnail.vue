<template>
  <v-list-item-avatar
    v-if="post.type !== 'TEXT'"
    style="border-radius: 10px; align-self: start"
    height="60"
    width="80"
    class="my-0"
    :color="$vuetify.theme.dark ? '#35363A' : '#DEE1E6'"
  >
    <a
      :href="post.link"
      target="_blank"
      rel="noopener"
      aria-label="Thumbnail"
      style="height: 60px; width: 80px"
      @click.stop.prevent="$emit('thumbnailclick')"
    >
      <img
        v-if="post.thumbnailUrl"
        alt="Thumbnail"
        style="object-fit: cover"
        :src="post.thumbnailUrl"
      />
      <div
        v-else
        style="height: 60px; width: 80px; display: flex; justify-content: center; align-items: center"
      >
        <v-icon size="32" class="text--secondary">{{
          $vuetify.icons.values.mdiWeb
        }}</v-icon>
      </div>
    </a>
  </v-list-item-avatar>
</template>

<script>
export default {
  name: 'PostThumbnail',
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
