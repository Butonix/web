<template>
  <v-app id="app">
    <AppBar />

    <NavDrawer v-if="$device.isDesktop" />

    <client-only
      v-if="
        $device.isDesktop &&
          ([
            'signup',
            'login',
            'planets-create',
            'planets-explore',
            'galaxies-explore'
          ].includes($route.name) ||
            $route.name.startsWith('settings') ||
            $route.name.startsWith('submit'))
      "
    >
      <ParticlesContainer />
    </client-only>

    <v-main>
      <HomePageGalaxyBar
        v-show="
          $route.name === 'sort-time' ||
            $route.name === 'universe-sort-time' ||
            $route.name === 'g-galaxyname-sort-time'
        "
      />
      <nuxt />
      <Snackbar />
    </v-main>

    <BottomNavBar v-if="!$device.isDesktop" />
  </v-app>
</template>

<script>
import Snackbar from '@/components/bars/Snackbar'
import AppBar from '@/components/bars/AppBar'
import BottomNavBar from '@/components/bars/BottomNavBar'
import NavDrawer from '@/components/bars/NavDrawer'
import HomePageGalaxyBar from '@/components/bars/HomePageGalaxyBar'

export default {
  name: 'Default',
  components: {
    HomePageGalaxyBar,
    NavDrawer,
    BottomNavBar,
    AppBar,
    Snackbar,
    ParticlesContainer: () => import('@/components/ParticlesContainer')
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
