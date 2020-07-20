<template>
  <v-app id="app">
    <AppBar />

    <v-main>
      <v-container class="pt-0">
        <nuxt keep-alive :keep-alive-props="{ include: ['Index', 'T'] }" />
      </v-container>
      <Snackbar />
    </v-main>

    <BottomNavBar v-if="!$device.isDesktop" />
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
      if (!process.client) return
      document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
        ? '#202124'
        : '#F5F5F5'
    }
  },
  mounted() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const dark = localStorage.getItem('dark')

    if (dark) {
      setTimeout(() => (this.$vuetify.theme.dark = dark === 'true'), 0)
    } else if (mq.matches) {
      setTimeout(() => (this.$vuetify.theme.dark = true), 0)
    } else {
      setTimeout(() => (this.$vuetify.theme.dark = false), 0)
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

<style scoped></style>
