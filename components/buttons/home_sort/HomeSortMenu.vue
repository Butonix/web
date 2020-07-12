<template>
  <v-bottom-sheet v-if="!$device.isDesktop" v-model="menu">
    <template v-slot:activator="{ on }">
      <SortMenuButton v-on="on" />
    </template>
    <HomeSortMenuContent :open="menu" @selected="menu = false" />
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
    <HomeSortMenuContent :open="menu" @selected="menu = false" />
  </v-menu>
</template>

<script>
import HomeSortMenuContent from './HomeSortMenuContent'
import SortMenuButton from './SortMenuButton'

export default {
  name: 'HomeSortMenu',
  components: { SortMenuButton, HomeSortMenuContent },
  data() {
    return {
      menu: false
    }
  }
}
</script>

<style scoped></style>
