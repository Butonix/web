<template>
  <v-btn
    rounded
    depressed
    color="primary"
    nuxt
    :to="
      $store.state.currentUser
        ? `/submit/text${
            $route.params.planetname
              ? `?planet=${$route.params.planetname}`
              : ''
          }`
        : '/signup'
    "
    height="34"
  >
    <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPlusBox }}</v-icon>
    New Post
  </v-btn>
</template>

<script>
export default {
  name: 'NewPostButton'
}
</script>

<style scoped></style>
