<template>
  <v-bottom-sheet v-model="menu">
    <template v-slot:activator="{ on }">
      <SortMenuButton v-on="on" />
    </template>

    <v-card>
      <v-card-text class="px-0 pt-2" style="padding-bottom: 24px">
        <SortMenuContent :open="menu" @selected="menu = false" />
      </v-card-text>
    </v-card>
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
