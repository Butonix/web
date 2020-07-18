<template>
  <v-bottom-sheet v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn text rounded small v-on="on">
        <template v-if="!$route.query || !$route.query.view">
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiInfinity
          }}</v-icon>
          All
        </template>

        <template v-else-if="$route.query && $route.query.view === 'posts'">
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiPost
          }}</v-icon>
          Posts
        </template>

        <template v-else-if="$route.query && $route.query.view === 'comments'">
          <v-icon size="20" class="mr-2">{{
            $vuetify.icons.values.mdiCommentMultipleOutline
          }}</v-icon>
          Comments
        </template>
      </v-btn>
    </template>

    <v-list>
      <v-list-item @click="chooseAll">
        <v-list-item-icon>
          <v-icon>{{ $vuetify.icons.values.mdiInfinity }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="
              !$route.query || !$route.query.view ? 'font-weight-bold' : ''
            "
            >All</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="choosePosts">
        <v-list-item-icon>
          <v-icon>{{ $vuetify.icons.values.mdiPost }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="
              $route.query && $route.query.view === 'posts'
                ? 'font-weight-bold'
                : ''
            "
            >Posts</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="chooseComments">
        <v-list-item-icon>
          <v-icon>{{ $vuetify.icons.values.mdiCommentMultipleOutline }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :class="
              $route.query && $route.query.view === 'comments'
                ? 'font-weight-bold'
                : ''
            "
            >Comments</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: 'UserViewMenu',
  data() {
    return {
      menu: false
    }
  },
  methods: {
    chooseAll() {
      this.menu = false
      const query = Object.assign({}, this.$route.query)
      delete query.view
      this.$router.push({ path: this.$route.path, query })
    },
    choosePosts() {
      this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, view: 'posts' }
      })
    },
    chooseComments() {
      this.menu = false
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, view: 'comments' }
      })
    }
  }
}
</script>

<style scoped></style>
