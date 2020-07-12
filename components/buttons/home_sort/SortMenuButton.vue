<template>
  <v-btn
    aria-label="Sort Posts"
    size="20"
    small
    outlined
    rounded
    class="font-weight-regular"
    style="border-width: 1px"
    :style="
      $vuetify.theme.dark
        ? 'border-color: rgba(255, 255, 255, 0.12);'
        : 'border-color: rgba(0, 0, 0, 0.12);'
    "
    @click="click"
  >
    <v-icon
      v-if="$route.query.sort === 'hot' || !$route.query.sort"
      size="20"
      class="mr-2"
      >{{ $vuetify.icons.values.mdiFire }}</v-icon
    >
    <v-icon v-else-if="$route.query.sort === 'top'" size="20" class="mr-2">{{
      $vuetify.icons.values.mdiFormatListNumbered
    }}</v-icon>
    <v-icon v-else-if="$route.query.sort === 'new'" size="20" class="mr-2">{{
      $vuetify.icons.values.mdiClockTimeOneOutline
    }}</v-icon>
    <v-icon
      v-else-if="$route.query.sort === 'comments'"
      size="20"
      class="mr-2"
      >{{ $vuetify.icons.values.mdiCommentMultipleOutline }}</v-icon
    >

    <span v-if="$route.query.sort === 'hot' || !$route.query.sort">Hot</span>
    <span v-else-if="$route.query.sort === 'top'"
      >Top{{
        $route.query.time
          ? ` (${$route.query.time
              .substring(0, 1)
              .toUpperCase()}${$route.query.time.substring(1).toLowerCase()})`
          : ' (All)'
      }}</span
    >
    <span v-else-if="$route.query.sort === 'new'">New</span>
    <span v-else-if="$route.query.sort === 'comments'">Comments</span>
  </v-btn>
</template>

<script>
export default {
  name: 'SortMenuButton',
  methods: {
    click(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped></style>
