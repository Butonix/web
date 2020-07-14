<template>
  <v-menu offset-y transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="$route.name.startsWith('new')"
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
</template>

<script>
import NewPostButtonContent from './NewPostButtonContent'
export default {
  name: 'NewPostButton',
  components: { NewPostButtonContent }
}
</script>

<style scoped></style>
