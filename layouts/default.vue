<template>
  <v-app>
    <NavDrawer v-model="drawer" />

    <v-app-bar app color="primary" clipped-left flat dense>
      <v-app-bar-nav-icon v-if="!$device.isDesktop" @click="drawer = !drawer">
        <v-icon>{{ icons.menu }}</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="headline font-weight-medium">
        <nuxt-link to="/" class="hoverable white--text">Comet</nuxt-link>
        <span v-if="$device.isDesktop" class="caption ml-1 white--text">
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

      <template v-if="$device.isDesktop">
        <v-btn v-if="currentUser" text dark nuxt to="/new" class="mr-6">
          <span class="mr-2">New Post</span>
          <v-icon>{{ icons.plus }}</v-icon>
        </v-btn>

        <v-btn
          v-else
          text
          dark
          class="mr-6"
          @click="$store.dispatch('showLoginDialogCompose')"
        >
          <span class="mr-2">New Post</span>
          <v-icon>{{ icons.plus }}</v-icon>
        </v-btn>

        <div style="width: 20%">
          <v-text-field
            solo-inverted
            dark
            flat
            dense
            hide-details
            label="Search"
            :append-icon="icons.magnify"
            @click:append="$router.push('/search')"
          />
        </div>
      </template>

      <div v-else>
        <v-btn icon dark>
          <v-icon>{{ icons.magnify }}</v-icon>
        </v-btn>

        <v-btn v-if="currentUser" icon dark nuxt to="/new">
          <v-icon>{{ icons.plus }}</v-icon>
        </v-btn>

        <v-btn
          v-else
          icon
          dark
          @click="$store.dispatch('showLoginDialogCompose')"
        >
          <v-icon>{{ icons.plus }}</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
      <Snackbar />
    </v-content>
    <!--<v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import { mdiPlus, mdiMagnify, mdiMenu } from '@mdi/js'
import NavDrawer from '../components/NavDrawer'
import currentUserGql from '../gql/currentUser.graphql'
import Snackbar from '../components/Snackbar'

export default {
  name: 'Default',
  components: { Snackbar, NavDrawer },
  data() {
    return {
      currentUser: null,
      drawer: false,
      icons: {
        plus: mdiPlus,
        magnify: mdiMagnify,
        menu: mdiMenu
      }
    }
  },
  apollo: {
    currentUser: {
      query: currentUserGql
    }
  },
  mounted() {
    const dark = localStorage.getItem('dark')
    this.$vuetify.theme.dark = dark ? dark === 'true' : true
    this.drawer = this.$device.isDesktop
  }
}
</script>
