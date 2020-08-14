<template>
  <SortingBar>
    <v-btn
      tile
      text
      height="46"
      class="px-3"
      style="border-right-style: solid; border-right-width: 1px; margin-bottom: 2px"
      :style="{
        'border-right-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)'
      }"
      nuxt
      to="/galaxies/explore"
    >
      <v-icon class="mr-2" size="20">{{
        $vuetify.icons.values[galaxy.icon]
      }}</v-icon>
      {{ galaxy.fullName }}</v-btn
    >
    <v-btn
      tile
      text
      height="46"
      class="px-3"
      style="font-weight: 400; border-right-style: solid; border-right-width: 1px; margin-bottom: 2px"
      :style="{
        'border-right-color': $vuetify.theme.dark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.12)'
      }"
      nuxt
      :to="{ query: { view: 'planets' } }"
      >{{ galaxy.planetCount }} Planet{{
        galaxy.planetCount === 1 ? '' : 's'
      }}</v-btn
    >
  </SortingBar>
</template>

<script>
import SortingBar from '@/components/bars/SortingBar'
export default {
  name: 'GalaxyBar',
  components: { SortingBar },
  props: {
    galaxy: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
