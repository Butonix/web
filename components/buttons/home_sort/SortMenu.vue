<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <SortMenuButton v-on="on" />
    </template>
    <SortMenuContent :open="menu" @selected="menu = false" />
  </v-bottom-sheet>

  <v-menu
    v-else
    v-model="menu"
    bottom
    offset-y
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <SortMenuButton v-on="on" />
    </template>
    <SortMenuContent :open="menu" @selected="menu = false" />
  </v-menu>
</template>

<script>
import SortMenuContent from './SortMenuContent'
import SortMenuButton from './SortMenuButton'

export default {
  name: 'SortMenu',
  components: { SortMenuButton, SortMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
