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
      to="/planets/explore"
    >
      <v-avatar size="32" color="primary" class="mr-2">
        <v-img v-if="planet.avatarImageUrl" :src="planet.avatarImageUrl" />
      </v-avatar>
      {{ planet.customName || planet.name }}</v-btn
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
      >{{ planet.userCount }} User{{ planet.userCount === 1 ? '' : 's' }}</v-btn
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
      :to="`/g/${planet.galaxy.name}`"
    >
      <v-icon class="mr-2" size="20">{{
        $vuetify.icons.values[planet.galaxy.icon]
      }}</v-icon>
      {{ planet.galaxy.fullName }}</v-btn
    >
  </SortingBar>
</template>

<script>
import SortingBar from '@/components/bars/SortingBar'
export default {
  name: 'PlanetBar',
  components: { SortingBar },
  props: {
    planet: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
