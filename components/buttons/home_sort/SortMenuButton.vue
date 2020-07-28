<template>
  <v-btn aria-label="Sort Posts" text small @click="click">
    <template
      v-if="
        !$route.path.includes('/top') &&
          !$route.path.includes('/new') &&
          !$route.path.includes('/mostcomments')
      "
    >
      <v-icon size="20" class="mr-2">{{
        $vuetify.icons.values.mdiFire
      }}</v-icon>
      <span>Hot</span>
    </template>

    <template v-else-if="$route.path.includes('/new')">
      <v-icon size="20" class="mr-2">{{
        $vuetify.icons.values.mdiClockTimeOneOutline
      }}</v-icon>
      <span>New</span>
    </template>

    <template v-else-if="$route.path.includes('/top')">
      <v-icon size="20" class="mr-2">{{
        $vuetify.icons.values.mdiFormatListNumbered
      }}</v-icon>
      <span
        >Top{{
          $route.params.time
            ? ` (${$route.params.time
                .substring(0, 1)
                .toUpperCase()}${$route.params.time
                .substring(1)
                .toLowerCase()})`
            : ' (Day)'
        }}</span
      >
    </template>

    <template v-else-if="$route.path.includes('/mostcomments')">
      <v-icon size="20" class="mr-2">{{
        $vuetify.icons.values.mdiCommentMultipleOutline
      }}</v-icon>
      <span>Comments</span>
    </template>

    <span v-if="$route.query.types">*</span>
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
