<template>
  <v-app>
    <NavDrawer :open.sync="$breakpoint.mdAndUp ? true : drawer" />

    <v-app-bar app color="primary" clipped-left flat dense>
      <v-app-bar-nav-icon
        v-if="!$breakpoint.mdAndUp"
        @click="drawer = !drawer"
      />

      <v-toolbar-title class="headline font-weight-medium">
        <nuxt-link to="/" class="hoverable white--text">Comet</nuxt-link>
        <span v-if="$breakpoint.mdAndUp" class="caption ml-1">
          <a
            href="https://github.com/"
            target="_blank"
            class="hoverable white--text"
          >
            development v0.0.1</a
          >
          &middot;
          <a
            href="https://github.com/"
            target="_blank"
            class="hoverable white--text"
            >send feedback</a
          >
        </span>
      </v-toolbar-title>

      <v-spacer />

      <template v-if="$breakpoint.mdAndUp">
        <div style="width: 20%">
          <v-text-field
            solo-inverted
            dark
            flat
            dense
            hide-details
            label="Search"
            append-icon="mdi-magnify"
            class="mr-6"
            @click:append="$router.push('/search')"
          />
        </div>

        <v-btn v-if="isAuthenticated" text dark to="/compose">
          <span class="mr-2">New Post</span>
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <v-btn v-else text dark>
          <span class="mr-2">New Post</span>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <div v-else>
        <v-btn icon dark>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn v-if="isAuthenticated" icon dark to="/compose">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
    <!--<v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import NavDrawer from '../components/NavDrawer'

export default {
  components: { NavDrawer },
  data() {
    return {
      isAuthenticated: false,
      drawer: false
    }
  },
  mounted() {
    this.isAuthenticated = !!this.$apolloHelpers.getToken()
    this.$vuetify.theme.dark = localStorage.getItem('dark') === 'true'
    console.log(this.$breakpoint)
  }
}
</script>
