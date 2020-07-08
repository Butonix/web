<template>
  <v-app>
    <BottomNavBar />

    <DesktopAppBar v-if="$device.isDesktop" />
    <MobileAppBar v-else />

    <v-main>
      <nuxt keep-alive />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import Snackbar from '../components/Snackbar'
import DesktopAppBar from '../components/DesktopAppBar'
import MobileAppBar from '../components/MobileAppBar'
import BottomNavBar from '../components/BottomNavBar'

export default {
  name: 'Default',
  components: {
    BottomNavBar,
    MobileAppBar,
    DesktopAppBar,
    Snackbar
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
  }
}
</script>

<style scoped>
.bottomappbar >>> .v-toolbar__content {
  padding: 0;
  margin: 0;
}
</style>
