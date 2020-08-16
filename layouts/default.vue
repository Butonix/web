<template>
  <v-app id="app">
    <AppBar />

    <NavDrawer v-if="$device.isDesktop" />

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
import layoutMixin from '@/mixins/layoutMixin'

export default {
  name: 'Default',
  components: {
    HomePageGalaxyBar,
    NavDrawer,
    BottomNavBar,
    AppBar,
    Snackbar
  },
  mixins: [layoutMixin]
}
</script>

<style scoped></style>
