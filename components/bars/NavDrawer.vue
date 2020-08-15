<template>
  <v-navigation-drawer
    v-model="nav"
    v-bar
    app
    clipped
    :color="$vuetify.theme.dark ? '#202124' : '#F8F9FA'"
    mobile-breakpoint="1281"
    style="z-index: 100; position: fixed !important"
    width="250"
  >
    <NavDrawerContents class="mt-2" />
  </v-navigation-drawer>
</template>

<script>
import NavDrawerContents from '@/components/bars/NavDrawerContents'

export default {
  name: 'NavDrawer',
  components: { NavDrawerContents },
  computed: {
    nav: {
      get() {
        return this.$store.state.nav
      },
      set(val) {
        this.$store.commit('setNav', val)
      }
    }
  }
}
</script>

<style scoped></style>
