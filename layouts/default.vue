<template>
  <v-app id="app">
    <AppBar />

    <NavDrawer v-if="$device.isDesktop" />

    <v-main>
      <client-only
        v-if="
          $device.isDesktop &&
            ([
              'signup',
              'login',
              'planets-create',
              'p-planetname-edit'
            ].includes($route.name) ||
              $route.name.startsWith('settings') ||
              $route.name.startsWith('submit'))
        "
      >
        <Particles />
      </client-only>
      <nuxt />
      <Snackbar />
    </v-main>

    <BottomNavBar v-if="!$device.isDesktop" />
  </v-app>
</template>

<script>
import Snackbar from '../components/bars/Snackbar'
import AppBar from '../components/bars/AppBar'
import BottomNavBar from '../components/bars/BottomNavBar'
import NavDrawer from '@/components/bars/NavDrawer'

export default {
  name: 'Default',
  components: {
    NavDrawer,
    BottomNavBar,
    AppBar,
    Snackbar,
    Particles: () => import('@/components/Particles')
  },
  watch: {
    '$vuetify.theme.dark'() {
      if (!process.client) return
      document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
        ? '#202124'
        : '#F1F3F4'
      document.querySelector('body').style.backgroundColor = this.$vuetify.theme
        .dark
        ? '#202124'
        : '#F1F3F4'
    }
  },
  beforeCreate() {
    // const mq = window.matchMedia('(prefers-color-scheme: dark)')

    if (process.client) {
      const dark = localStorage.getItem('dark')
      if (dark) {
        this.$vuetify.theme.dark = dark === 'true'
      } else {
        this.$vuetify.theme.dark = true
      }
    }

    /* mq.addEventListener('change', (e) => {
      if (!localStorage.getItem('dark')) {
        this.$vuetify.theme.dark = e.matches
      }
    }) */
  },
  beforeMount() {
    document.documentElement.style.backgroundColor = this.$vuetify.theme.dark
      ? '#202124'
      : '#F1F3F4'
    document.querySelector('body').style.backgroundColor = this.$vuetify.theme
      .dark
      ? '#202124'
      : '#F1F3F4'
  },
  head() {
    return {
      meta: [
        {
          name: 'theme-color',
          content: this.$vuetify.theme.dark ? '#202124' : '#F1F3F4'
        }
      ]
    }
  }
}
</script>

<style scoped></style>
