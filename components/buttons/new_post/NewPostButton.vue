<template>
  <v-menu
    v-if="$store.state.currentUser"
    offset-y
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        rounded
        depressed
        class="white--text"
        :color="$vuetify.theme.dark ? 'primary' : 'primary'"
        v-on="on"
      >
        <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPlusBox }}</v-icon>
        New Post
      </v-btn>
    </template>

    <NewPostButtonContent />
  </v-menu>

  <v-btn
    v-else
    rounded
    depressed
    class="white--text"
    :color="$vuetify.theme.dark ? 'primary' : 'primary'"
    nuxt
    to="/signup"
  >
    <v-icon class="mr-2">{{ $vuetify.icons.values.mdiPlusBox }}</v-icon>
    New Post
  </v-btn>
</template>

<script>
import NewPostButtonContent from './NewPostButtonContent'
export default {
  name: 'NewPostButton',
  components: { NewPostButtonContent }
}
</script>

<style scoped></style>
