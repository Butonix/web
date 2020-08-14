<template>
  <v-app-bar
    class="mb-3"
    style="position: sticky; top: 47px; border-width: 1px; border-style: solid; z-index: 20"
    flat
    dense
    :style="{
      'border-color': $vuetify.theme.dark
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)',
      'border-left-style': $device.isDesktop ? 'solid' : 'none',
      'border-right-style': $device.isDesktop ? 'solid' : 'none'
    }"
  >
    <slot />
    <v-spacer />
    <SortMenu />
  </v-app-bar>
</template>

<script>
import SortMenu from '@/components/buttons/home_sort/SortMenu'
export default {
  name: 'SortingBar',
  components: { SortMenu }
}
</script>

<style scoped>
>>> .v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}
</style>
