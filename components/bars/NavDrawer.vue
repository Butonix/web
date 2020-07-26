<template>
  <v-navigation-drawer
    app
    clipped
    :color="$vuetify.theme.dark ? 'transparent' : '#F1F3F4'"
    :mini="mini"
    class="disable-scrollbars"
  >
    <NavDrawerContents />
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

<style scoped>
.linkactive {
  color: var(--v-primary-base) !important;
}

.linkactive:before {
  opacity: 0 !important;
}

.planetactive:before {
  opacity: 0.06 !important;
}

>>> .v-input__control {
  min-height: 34px !important;
  height: 34px !important;
}

>>> .v-label {
  font-size: 1rem;
}
</style>
