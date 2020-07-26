<template>
  <v-bottom-sheet v-model="menu">
    <template v-slot:activator="{ on }">
      <SortMenuButton v-on="on" />
    </template>

    <SortMenuContent :open="menu" @selected="menu = false" />
  </v-bottom-sheet>
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
