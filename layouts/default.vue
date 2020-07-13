<template>
  <v-app id="app">
    <BottomNavBar v-if="!$device.isDesktop" />

    <AppBar />

    <v-main>
      <nuxt keep-alive :keep-alive-props="{ include: ['Index', 'T'] }" />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import Snackbar from '../components/bars/Snackbar'
import AppBar from '../components/bars/AppBar'
import BottomNavBar from '../components/bars/BottomNavBar'

export default {
  name: 'Default',
  components: {
    BottomNavBar,
    AppBar,
    Snackbar
  },
  watch: {
    '$vuetify.theme.dark'() {
      document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
        ? '#202124'
        : '#F5F5F5'
    }
  },
  mounted() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const dark = localStorage.getItem('dark')

    if (dark) {
      this.$vuetify.theme.dark = dark === 'true'
    } else if (mq.matches) {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }

    mq.addEventListener('change', (e) => {
      if (!localStorage.getItem('dark')) {
        this.$vuetify.theme.dark = e.matches
      }
    })

    document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
      ? '#202124'
      : '#F5F5F5'
  },
  head() {
    return {
      meta: [
        {
          name: 'theme-color',
          content: this.$vuetify.theme.dark ? '#202124' : '#F5F5F5'
        }
      ]
    }
  }
}
</script>

<style scoped>
.bottomappbar >>> .v-toolbar__content {
  padding: 0;
  margin: 0;
}
</style>
