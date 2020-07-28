<template>
  <v-navigation-drawer
    app
    clipped
    :color="$vuetify.theme.dark ? 'transparent' : '#F1F3F4'"
    :mini="mini"
    class="disable-scrollbars"
  >
    <NavDrawerContents class="mt-2" />
  </v-navigation-drawer>
</template>

<script>
import NavDrawerContents from '@/components/bars/NavDrawerContents'

export default {
  name: 'NavDrawer',
  components: { NavDrawerContents },
  data() {
    return {
      mini: false
    }
  }
}
</script>

<style scoped></style>
